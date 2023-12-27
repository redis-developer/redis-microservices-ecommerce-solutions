const SEARCH_TYPES = {
    NORMAL: {
        VALUE: 1,
        LABEL: 'Normal product title search'
    },
    GEO_LOCATION: {
        VALUE: 2,
        LABEL: 'Nearest Location based search'
    },
    VSS_TEXT: {
        VALUE: 3,
        LABEL: 'Semantic text search using LangChain with OpenAI / HuggingFace embeddings'
    },
}

const VSS_EMBEDDINGS = {
    OPEN_AI: "OpenAI",
    HUGGING_FACE: "HuggingFace",
}

//TODO: merge both dashboards later
const CLIENT_CONFIG = {
    SEARCH_TYPE: {
        VALUE: SEARCH_TYPES.VSS_TEXT.VALUE,
        LABEL: SEARCH_TYPES.NORMAL.LABEL,
        OTHER: {
            VSS_EMBEDDINGS: VSS_EMBEDDINGS.OPEN_AI
        }
    },
    AI_CHAT_BOT: {
        VALUE: true,
        LABEL: 'AI Chat Bot using LangChain + OpenAI',
        TUTORIAL: 'https://developer.redis.com/howtos/solutions/vector/gen-ai-chatbot'
    },
    ADMIN_SCREEN: {
        VALUE: true,
        LABEL: 'Admin Screen to show trending products and other purchase stats'
    },
    TRIGGERS_FUNCTIONS: {
        VALUE: true,
        LABEL: 'Triggers and Functions - Manual/ OnDemand, KeySpace and stream triggers'
    },
}

export {
    CLIENT_CONFIG,
    SEARCH_TYPES,
    VSS_EMBEDDINGS
}