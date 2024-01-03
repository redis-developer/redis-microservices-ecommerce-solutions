import type { Embeddings } from "langchain/embeddings/base";

import { ChatOpenAI, ChatOpenAICallOptions } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { HuggingFaceInferenceEmbeddings } from "langchain/embeddings/hf";
import { RedisVectorStore } from "langchain/vectorstores/redis";
import { StringOutputParser } from 'langchain/schema/output_parser';
import { Document } from "langchain/document";

import { SERVER_CONFIG, REDIS_KEYS, REDIS_STREAMS } from '../../../common/config/server-config';
import { getRedis, getNodeRedisClient } from '../../../common/utils/redis/redis-wrapper';
import { addMessageToStream } from '../../../common/utils/redis/redis-streams';

interface IParamsGetProductsByVSS {
    standAloneQuestion: string;
    openAIApiKey?: string;
    huggingFaceApiKey?: string
    KNN?: number;
    scoreLimit?: number;
    embeddingsType?: string;
}

const CHAT_CONSTANTS = {
    userMessagePrefix: "userMessage: ",
    openAIMessagePrefix: "openAIMessage(You): ",
    senderAssistant: "Assistant",
    senderUser: "User"
};

let llm: ChatOpenAI<ChatOpenAICallOptions>;

//#region helpers
const combineVectorDocuments = (_vectorDocs: Document[], _separator?: string) => {
    if (!_separator) {
        _separator = '\n\n --------------------- \n\n';
    }
    return _vectorDocs.map((doc) => doc.pageContent).join(_separator);
}

const getOpenAIInstance = (_openAIApiKey: string) => {
    if (!llm) {
        llm = new ChatOpenAI({
            openAIApiKey: _openAIApiKey
        })
    }
    return llm;
}

const getChatBotHistory = async (_sessionId: string) => {
    let chatHistory: string[] = [];

    if (_sessionId) {
        const redisWrapperInst = getRedis();
        const chatHistoryName = REDIS_KEYS.OPEN_AI.CHAT_HISTORY_KEY_PREFIX + _sessionId;
        const items = await redisWrapperInst.getAllItemsFromList(chatHistoryName);

        if (items?.length) {
            chatHistory = items;
        }
    }
    return chatHistory;
}

const getChatBotHistoryStr = async (_sessionId: string, _separator?: string) => {
    let chatHistoryStr = "";
    if (!_separator) {
        _separator = '\n\n';
    }
    const chatHistoryArr = await getChatBotHistory(_sessionId);
    if (chatHistoryArr?.length) {
        chatHistoryStr = chatHistoryArr.join(_separator);
    }

    return chatHistoryStr;
}

//#endregion

const convertToStandAloneQuestion = async (_userQuestion: string, _sessionId: string, _openAIApiKey: string) => {

    const llm = getOpenAIInstance(_openAIApiKey);

    const chatHistory = await getChatBotHistoryStr(_sessionId);

    const standaloneQuestionTemplate = `Given some conversation history (if any) and a question, convert it to a standalone question. 
    ***********************************************************
    conversation history: 
         ${chatHistory}
    ***********************************************************
    question: {question} 
    standalone question:`;

    const standaloneQuestionPrompt = PromptTemplate.fromTemplate(standaloneQuestionTemplate)

    const chain = standaloneQuestionPrompt.pipe(llm).pipe(new StringOutputParser());

    const response = await chain.invoke({
        question: _userQuestion
    })

    return response;
}

const getSimilarProductsByVSS = async (_params: IParamsGetProductsByVSS) => {
    let { standAloneQuestion, openAIApiKey, KNN } = _params;
    const client = getNodeRedisClient();
    let indexName = REDIS_KEYS.OPEN_AI.PRODUCT_INDEX_NAME;
    let keyPrefix = REDIS_KEYS.OPEN_AI.PRODUCT_KEY_PREFIX;
    KNN = KNN || SERVER_CONFIG.PRODUCTS_SERVICE.VSS_KNN;

    let embeddings = new OpenAIEmbeddings({
        openAIApiKey: openAIApiKey
    });

    const vectorStore = new RedisVectorStore(
        embeddings,
        {
            redisClient: client,
            indexName: indexName,
            keyPrefix: keyPrefix,
        }
    );

    /* Simple standalone search in the vector DB */
    let vectorDocs = await vectorStore.similaritySearch(standAloneQuestion, KNN);
    return vectorDocs;
}

const convertToAnswer = async (_originalQuestion: string, _standAloneQuestion: string, _productDetails: string, _sessionId: string, _openAIApiKey: string) => {

    const llm = getOpenAIInstance(_openAIApiKey);

    const chatHistory = await getChatBotHistoryStr(_sessionId);

    const answerTemplate = `
    Please assume the persona of a retail shopping assistant for this conversation.
    Use a friendly tone, and assume the target audience are normal people looking for a product in a ecommerce website.

    ***********************************************************
    ${chatHistory ? `
    Conversation history between user and you is : 
       ${chatHistory}
    ` : ""}
    ***********************************************************
    OriginalQuestion of user is : {originalQuestion}
    ***********************************************************
    converted stand alone question is : {standAloneQuestion}
    ***********************************************************
    resulting details of products for the stand alone question are :
             {productDetails}
    Note : Different product details are separated by "---------------------" (if any)            
    ***********************************************************
    Answer the question based on the context provided and the conversation history.
    
    If you  don't know the answer, please direct the questioner to email help@redis.com. Don't try to suggest any product out of context as it may not be in the store.

    Let the answer include product display name, price and optional other details based on question asked.

    Let the product display name be a link like <a href="/?productId="> productDisplayName </a>
    so that user can click on it and go to the product page with help of productId.
    
    answer: `;

    const answerPrompt = PromptTemplate.fromTemplate(answerTemplate)
    const chain = answerPrompt.pipe(llm).pipe(new StringOutputParser());

    const response = await chain.invoke({
        originalQuestion: _originalQuestion,
        standAloneQuestion: _standAloneQuestion,
        productDetails: _productDetails
    });

    return response;
}

const chatBotMessage = async (_userMessage: string, _sessionId: string, _openAIApiKey: string) => {
    /**
       Refer docs/api/chat-bot.md for sample Logs
    */
    const CHAT_BOT_LOG = REDIS_STREAMS.STREAMS.CHAT_BOT_LOG;
    const redisWrapperInst = getRedis();

    const chatHistoryName = REDIS_KEYS.OPEN_AI.CHAT_HISTORY_KEY_PREFIX + _sessionId;
    redisWrapperInst.addItemToList(chatHistoryName, CHAT_CONSTANTS.userMessagePrefix + _userMessage);
    addMessageToStream({ name: "originalQuestion", comments: _userMessage }, CHAT_BOT_LOG); //async log

    const standAloneQuestion = await convertToStandAloneQuestion(_userMessage, _sessionId, _openAIApiKey);
    addMessageToStream({ name: "standaloneQuestion", comments: standAloneQuestion }, CHAT_BOT_LOG);

    const KNN = SERVER_CONFIG.PRODUCTS_SERVICE.VSS_KNN;
    const similarProducts = await getSimilarProductsByVSS({
        standAloneQuestion,
        openAIApiKey: _openAIApiKey,
        KNN,
    });
    if (similarProducts?.length) {
        addMessageToStream({ name: "similarProducts", comments: JSON.stringify(similarProducts) }, CHAT_BOT_LOG);
    }

    const productDetails = combineVectorDocuments(similarProducts);
    console.log("productDetails:", productDetails);

    const answer = await convertToAnswer(_userMessage, standAloneQuestion, productDetails, _sessionId, _openAIApiKey);
    addMessageToStream({ name: "answer", comments: answer }, CHAT_BOT_LOG);

    redisWrapperInst.addItemToList(chatHistoryName, CHAT_CONSTANTS.openAIMessagePrefix + answer);

    return answer;
}

const getSimilarProductsScoreByVSS = async (_params: IParamsGetProductsByVSS) => {
    let {
        standAloneQuestion,
        openAIApiKey,

        //optional
        huggingFaceApiKey,
        KNN,
        scoreLimit,
        embeddingsType } = _params;

    let vectorDocs: Document[] = [];
    const client = getNodeRedisClient();

    const VSS_EMBEDDINGS_TYPE = SERVER_CONFIG.PRODUCTS_SERVICE.VSS_EMBEDDINGS_TYPE;
    KNN = KNN || SERVER_CONFIG.PRODUCTS_SERVICE.VSS_KNN;
    scoreLimit = scoreLimit || 0;
    embeddingsType = embeddingsType || VSS_EMBEDDINGS_TYPE.OPEN_AI;

    let indexName = "";
    let keyPrefix = "";
    let embeddings: Embeddings | null = null;

    // create embeddings
    if (huggingFaceApiKey &&
        embeddingsType.toLowerCase() === VSS_EMBEDDINGS_TYPE.HUGGING_FACE.toLowerCase()) {
        embeddings = new HuggingFaceInferenceEmbeddings({
            apiKey: huggingFaceApiKey
        });
        indexName = REDIS_KEYS.HUGGING_FACE.PRODUCT_INDEX_NAME;
        keyPrefix = REDIS_KEYS.HUGGING_FACE.PRODUCT_KEY_PREFIX;
    }
    else if (openAIApiKey) {
        embeddings = new OpenAIEmbeddings({
            openAIApiKey: openAIApiKey
        });
        indexName = REDIS_KEYS.OPEN_AI.PRODUCT_INDEX_NAME;
        keyPrefix = REDIS_KEYS.OPEN_AI.PRODUCT_KEY_PREFIX;
    }

    if (embeddings) {
        // create vector store
        const vectorStore = new RedisVectorStore(
            embeddings,
            {
                redisClient: client,
                indexName: indexName,
                keyPrefix: keyPrefix,
            }
        );

        // search for similar products
        const vectorDocsWithScore = await vectorStore.similaritySearchWithScore(standAloneQuestion, KNN);

        // filter by scoreLimit
        for (let [doc, score] of vectorDocsWithScore) {
            if (score >= scoreLimit) {
                doc["similarityScore"] = score;
                vectorDocs.push(doc);
            }
        }
        //sort by similarityScore in descending order
        vectorDocs = vectorDocs.sort((a, b) => b["similarityScore"] - a["similarityScore"]);
    }

    return vectorDocs;
}

const getSimilarProductsScoreByVSSImageSummary = async (_params: IParamsGetProductsByVSS) => {
    let {
        standAloneQuestion,
        openAIApiKey,

        //optional
        KNN,
        scoreLimit } = _params;

    let vectorDocs: Document[] = [];
    const client = getNodeRedisClient();

    KNN = KNN || SERVER_CONFIG.PRODUCTS_SERVICE.VSS_KNN;
    scoreLimit = scoreLimit || 0;

    const embeddings = new OpenAIEmbeddings({
        openAIApiKey: openAIApiKey
    });

    // create vector store
    const vectorStore = new RedisVectorStore(
        embeddings,
        {
            redisClient: client,
            indexName: REDIS_KEYS.OPEN_AI.PRODUCT_IMG_TEXT_INDEX_NAME,
            keyPrefix: REDIS_KEYS.OPEN_AI.PRODUCT_IMG_TEXT_KEY_PREFIX,
        }
    );

    // search for similar products
    const vectorDocsWithScore = await vectorStore.similaritySearchWithScore(standAloneQuestion, KNN);

    // filter by scoreLimit
    for (let [doc, score] of vectorDocsWithScore) {
        if (score >= scoreLimit) {
            doc["similarityScore"] = score;
            vectorDocs.push(doc);
        }
    }
    //sort by similarityScore in descending order
    vectorDocs = vectorDocs.sort((a, b) => b["similarityScore"] - a["similarityScore"]);

    return vectorDocs;
}

export {
    chatBotMessage,
    getChatBotHistory,
    getSimilarProductsByVSS,
    getSimilarProductsScoreByVSS,
    getSimilarProductsScoreByVSSImageSummary,
    CHAT_CONSTANTS
}