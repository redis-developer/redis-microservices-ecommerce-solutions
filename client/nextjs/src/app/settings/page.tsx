'use client';

import { ChangeEvent, useState } from "react";
import { useRouter } from 'next/navigation';

import { setClientConfig, getClientConfig, SEARCH_TYPES, VSS_EMBEDDINGS } from '@/config/client-config';

export default function SettingsPage() {
    const CLIENT_CONFIG = getClientConfig();
    const router = useRouter();

    const [searchType, setSearchType] = useState(CLIENT_CONFIG.SEARCH_TYPE.VALUE);
    const [embeddingsType, setEmbeddingsType] = useState(CLIENT_CONFIG.SEARCH_TYPE.OTHER.VSS_EMBEDDINGS);
    const [aiChatBot, setAiChatBot] = useState(CLIENT_CONFIG.AI_CHAT_BOT.VALUE);
    const [adminScreen, setAdminScreen] = useState(CLIENT_CONFIG.ADMIN_SCREEN.VALUE);
    const [triggersFunctions, setTriggersFunctions] = useState(CLIENT_CONFIG.TRIGGERS_FUNCTIONS.VALUE);

    const handleSearchTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchType(event.target.value);
    };
    const handleEmbeddingsTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmbeddingsType(event.target.value);
    };

    const handleAiChatBotChange = (event: ChangeEvent<HTMLInputElement>) => {
        setAiChatBot(event.target.checked);
    };

    const handleAdminScreenChange = (event: ChangeEvent<HTMLInputElement>) => {
        setAdminScreen(event.target.checked);
    };

    const handleTriggersFunctionsChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTriggersFunctions(event.target.checked);
    };

    const onApplySettings = () => {

        CLIENT_CONFIG.AI_CHAT_BOT.VALUE = aiChatBot;
        CLIENT_CONFIG.ADMIN_SCREEN.VALUE = adminScreen;
        CLIENT_CONFIG.TRIGGERS_FUNCTIONS.VALUE = triggersFunctions;

        CLIENT_CONFIG.SEARCH_TYPE.VALUE = searchType;
        CLIENT_CONFIG.SEARCH_TYPE.OTHER.VSS_EMBEDDINGS = embeddingsType;

        setClientConfig(CLIENT_CONFIG);

        //redirect to home page
        router.push('/');
    };

    return (
        <div className="flex justify-center">
            <div className="max-w-full rounded bg-slate-100 shadow-lg border border-neutral-200 mt-4 overflow-y-auto">
                <div className="flex-grow flex p-2 justify-center bg-slate-600">
                    <h1 className="text-xl font-semibold text-white">Settings</h1>
                </div>
                <div className="flex-grow flex flex-col p-4">
                    <div className="flex-grow flex">
                        <h3 className="text-lg font-bold text-neutral-600">Search Type</h3>
                    </div>
                    <div className="flex-grow flex p-2">
                        <div className="flex flex-row">
                            <div className="flex flex-row">

                                <input type="radio" id="normal" name="searchType"
                                    value={SEARCH_TYPES.NORMAL.VALUE}
                                    checked={searchType == SEARCH_TYPES.NORMAL.VALUE}
                                    onChange={handleSearchTypeChange} />

                                <label htmlFor="normal" className="ml-1">{SEARCH_TYPES.NORMAL.LABEL}</label>
                            </div>

                            <div className="flex flex-row ml-4">
                                <input type="radio" id="vssText" name="searchType"
                                    value={SEARCH_TYPES.VSS_TEXT.VALUE}
                                    checked={searchType == SEARCH_TYPES.VSS_TEXT.VALUE}
                                    onChange={handleSearchTypeChange} />

                                <label htmlFor="vssText" className="ml-1">{SEARCH_TYPES.VSS_TEXT.LABEL}</label>
                                <a href={SEARCH_TYPES.VSS_TEXT.TUTORIAL} className="ml-1" target="_blank" rel="noreferrer">
                                    <i className="fas fa-arrow-up-right-from-square text-blue-600 ml-2"></i>
                                </a>
                            </div>
                            <div className="flex flex-row ml-4">
                                <input type="radio" id="vssImageSummary" name="searchType"
                                    value={SEARCH_TYPES.VSS_IMAGE_SUMMARY.VALUE}
                                    checked={searchType == SEARCH_TYPES.VSS_IMAGE_SUMMARY.VALUE}
                                    onChange={handleSearchTypeChange} />

                                <label htmlFor="vssImageSummary" className="ml-1">{SEARCH_TYPES.VSS_IMAGE_SUMMARY.LABEL}</label>
                                <a href={SEARCH_TYPES.VSS_IMAGE_SUMMARY.TUTORIAL} className="ml-1" target="_blank" rel="noreferrer">
                                    <i className="fas fa-arrow-up-right-from-square text-blue-600 ml-2"></i>
                                </a>

                            </div>
                            <div className="flex flex-row ml-4">
                                <input type="radio" id="geoLocation" name="searchType"
                                    value={SEARCH_TYPES.GEO_LOCATION.VALUE}
                                    checked={searchType == SEARCH_TYPES.GEO_LOCATION.VALUE}
                                    onChange={handleSearchTypeChange} />

                                <label htmlFor="geoLocation" className="ml-1">{SEARCH_TYPES.GEO_LOCATION.LABEL}</label>
                            </div>

                            <div className="flex flex-row ml-4">
                                <input type="radio" id="geoLocationSemantic" name="searchType"
                                    value={SEARCH_TYPES.GEO_LOCATION_SEMANTIC.VALUE}
                                    checked={searchType == SEARCH_TYPES.GEO_LOCATION_SEMANTIC.VALUE}
                                    onChange={handleSearchTypeChange} />

                                <label htmlFor="geoLocationSemantic" className="ml-1">{SEARCH_TYPES.GEO_LOCATION_SEMANTIC.LABEL}</label>
                            </div>
                        </div>
                    </div>
                    {searchType === SEARCH_TYPES.VSS_TEXT.VALUE &&
                        <>
                            <div className="flex-grow flex pt-2">
                                <h3 className="text-lg font-bold text-neutral-600">Semantic Text Search</h3>
                            </div>
                            <div className="flex-grow flex p-2">
                                <div className="flex flex-row">
                                    <input type="radio" id="openAi" name="vssEmbeddings"
                                        value={VSS_EMBEDDINGS.OPEN_AI}
                                        checked={embeddingsType == VSS_EMBEDDINGS.OPEN_AI}
                                        onChange={handleEmbeddingsTypeChange} />

                                    <label htmlFor="openAi" className="ml-1">{VSS_EMBEDDINGS.OPEN_AI}</label>
                                </div>
                                <div className="flex flex-row ml-4">
                                    <input type="radio" id="huggingFace" name="vssEmbeddings"
                                        value={VSS_EMBEDDINGS.HUGGING_FACE}
                                        checked={embeddingsType == VSS_EMBEDDINGS.HUGGING_FACE}
                                        onChange={handleEmbeddingsTypeChange} />

                                    <label htmlFor="huggingFace" className="ml-1">{VSS_EMBEDDINGS.HUGGING_FACE}</label>
                                </div>
                            </div>
                        </>
                    }
                    <div className="text-neutral-500 pb-2 ml-2">
                        Note :
                        <ul>
                            {searchType === SEARCH_TYPES.VSS_TEXT.VALUE &&
                                <li>OpenAI / HuggingFace API key is required in .env file</li>
                            }
                            <li> Search products include watches, bags, belts, shoes, sandal, shirts/ t-shirts, trousers/ pants,..so on
                            </li>
                        </ul>

                    </div>
                    <div className="flex-grow flex pt-2">
                        <h3 className="text-lg font-bold text-neutral-600">AI Chat Bot</h3>
                    </div>
                    <div className="flex-grow flex p-2">
                        <div className="flex flex-col">
                            <div className="flex flex-row">
                                <input type="checkbox" id="aiChatBot" name="aiChatBot"
                                    checked={aiChatBot}
                                    onChange={handleAiChatBotChange} />

                                <label htmlFor="aiChatBot" className="ml-1">{CLIENT_CONFIG.AI_CHAT_BOT.LABEL} </label>

                                <a href={CLIENT_CONFIG.AI_CHAT_BOT.TUTORIAL} className="ml-1" target="_blank" rel="noreferrer">
                                    <i className="fas fa-arrow-up-right-from-square text-blue-600 ml-2"></i>
                                </a>

                            </div>
                        </div>
                    </div>
                    <div className="flex-grow flex pt-2">
                        <h3 className="text-lg font-bold text-neutral-600">Admin Screen</h3>
                    </div>
                    <div className="flex-grow flex p-2">
                        <div className="flex flex-col">
                            <div className="flex flex-row">
                                <input type="checkbox" id="adminScreen" name="adminScreen"
                                    checked={adminScreen}
                                    onChange={handleAdminScreenChange} />

                                <label htmlFor="adminScreen" className="ml-1">{CLIENT_CONFIG.ADMIN_SCREEN.LABEL}</label>
                            </div>
                        </div>
                    </div>
                    <div className="flex-grow flex pt-2">
                        <h3 className="text-lg font-bold text-neutral-600">Triggers and Functions</h3>
                    </div>
                    <div className="flex-grow flex p-2">
                        <div className="flex flex-col">
                            <div className="flex flex-row">
                                <input type="checkbox" id="triggersFunctions" name="triggersFunctions"
                                    checked={triggersFunctions}
                                    onChange={handleTriggersFunctionsChange} />

                                <label htmlFor="triggersFunctions" className="ml-1">{CLIENT_CONFIG.TRIGGERS_FUNCTIONS.LABEL}</label>

                                <a href={CLIENT_CONFIG.TRIGGERS_FUNCTIONS.TUTORIAL} className="ml-1" target="_blank" rel="noreferrer">
                                    <i className="fas fa-arrow-up-right-from-square text-blue-600 ml-2"></i>
                                </a>

                            </div>
                        </div>
                    </div>
                    <div className="flex-grow flex pt-2 justify-end">
                        <button
                            type="button"
                            onClick={onApplySettings}
                            className="inline-block rounded bg-orange-300 hover:bg-orange-400 px-6 pt-2.5 pb-2 text-xs font-semibold uppercase leading-normal text-black">
                            APPLY SETTINGS
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}