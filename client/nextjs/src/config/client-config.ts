const SEARCH_TYPES = {
    NORMAL: {
        VALUE: "normal",
        LABEL: 'Normal title search'
    },
    GEO_LOCATION: {
        VALUE: "geo",
        LABEL: 'Geo location search',
        TUTORIAL: 'https://developer.redis.com/howtos/solutions/geo/getting-started'
    },
    GEO_LOCATION_SEMANTIC: {
        VALUE: "geoSemantic",
        LABEL: 'Geo location semantic search'
    },
    VSS_TEXT: {
        VALUE: "vssText",
        LABEL: 'Semantic text search',
        TUTORIAL: 'https://developer.redis.com/howtos/solutions/vector/semantic-text-search'
    },
    VSS_IMAGE_SUMMARY: {
        VALUE: "vssImageSummary",
        LABEL: 'Semantic image summary search',
        TUTORIAL: 'https://developer.redis.com/howtos/solutions/vector/image-summary-search'
    },
}

const VSS_EMBEDDINGS = {
    OPEN_AI: "OpenAI",
    HUGGING_FACE: "HuggingFace",
}

//TODO: merge both dashboards later
const CLIENT_CONFIG = {
    SEARCH_TYPE: {
        VALUE: SEARCH_TYPES.NORMAL.VALUE,
        OTHER: {
            VSS_EMBEDDINGS: VSS_EMBEDDINGS.OPEN_AI
        }
    },
    AI_CHAT_BOT: {
        VALUE: true,
        LABEL: 'AI Chat Bot using LangChain and OpenAI',
        TUTORIAL: 'https://developer.redis.com/howtos/solutions/vector/gen-ai-chatbot'
    },
    ADMIN_SCREEN: {
        VALUE: true,
        LABEL: 'Admin Screen'
    },
    TRIGGERS_FUNCTIONS: {
        VALUE: true,
        LABEL: 'Triggers and Functions',
        TUTORIAL: 'https://developer.redis.com/howtos/solutions/triggers-and-functions/getting-started'
    },
}

const setClientConfig = (config: any) => {
    if (config && typeof window !== 'undefined') {
        window.localStorage.setItem('clientConfig', JSON.stringify(config));
    }
}

const getClientConfig = () => {
    let config: any = CLIENT_CONFIG;
    if (typeof window !== 'undefined') {
        const clientConfig = window.localStorage.getItem('clientConfig');
        if (clientConfig) {
            config = JSON.parse(clientConfig);
        }
    }
    return config;
}

export {
    SEARCH_TYPES,
    VSS_EMBEDDINGS,
    setClientConfig,
    getClientConfig
}