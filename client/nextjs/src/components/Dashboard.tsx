'use client';
import type { IChatMessageCallbackData } from '@/components/Chat';

import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import Cart from '@/components/Cart';
import Alert from '@/components/Alert';
import {
    getProducts, getProductsByVSSText,
    triggerResetInventory,
    chatBot, getChatHistory
} from '@/utils/services';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { default as Chat, CHAT_CONSTANTS } from '@/components/Chat';
import {
    setObjectToWindowQueryParams,
    getObjectFromWindowQueryParams,
    convertObjectToLabel,
    formatChatBotAnswer
} from '@/utils/convert';
import { getClientConfig, SEARCH_TYPES } from '@/config/client-config';

export default function Home() {
    const CLIENT_CONFIG = getClientConfig();

    const [products, setProducts] = useState<models.Product[]>();
    const [alertNotification, setAlertNotification] = useState({ title: '', message: '' });
    const [filterLabel, setFilterLabel] = useState<string>();
    const [oldChatHistory, setOldChatHistory] = useState<IChatMessage[]>([]);
    const [searchPlaceHolder, setSearchPlaceHolder] = useState<string>();

    async function refreshProducts(searchData?: models.Product) {
        if (!searchData) {
            searchData = getObjectFromWindowQueryParams();
        }

        let products: models.Product[] = [];

        if (CLIENT_CONFIG.SEARCH_TYPE.VALUE == SEARCH_TYPES.VSS_TEXT.VALUE
            && searchData?.productDisplayName && !searchData?.productId) {
            const searchText = searchData?.productDisplayName;
            const embeddings = CLIENT_CONFIG.SEARCH_TYPE.OTHER.VSS_EMBEDDINGS;
            products = await getProductsByVSSText(searchText, embeddings);
        }
        else {
            products = await getProducts(searchData?.productDisplayName, searchData?.productId);
        }


        setProducts(products);

        setObjectToWindowQueryParams(searchData);

        let searchFilter = convertObjectToLabel(searchData) || "";
        if (searchFilter) {
            searchFilter = " with search : (" + searchFilter + ")";
        }
        setFilterLabel(searchFilter);
    }

    async function resetStockQtyBtnClick() {
        setAlertNotification({ title: '', message: '' });

        await triggerResetInventory();
        await refreshProducts();

        setAlertNotification({
            title: `RESET STOCK QTY`,
            message:
                'Stock Qty of all products are updated to default value!',
        });
    }

    async function chatMessageCallback({ newChatMessage, chatHistory, setChatHistory }: IChatMessageCallbackData) {

        if (newChatMessage.message) {
            const question = newChatMessage.message;
            let answer = await chatBot(question);

            if (answer) {
                answer = formatChatBotAnswer(answer);
            }
            else {
                answer = 'Sorry, Server could not process your request. Please try again later.';
            }

            const responseChatMessage: IChatMessage = {
                sender: CHAT_CONSTANTS.SENDER_ASSISTANT,
                message: answer,
            };
            setChatHistory([...chatHistory, responseChatMessage]);
        }
    }

    useEffect(() => {
        (async () => {
            await refreshProducts();

            const historyArr = await getChatHistory();
            if (historyArr?.length) {
                for (let item of historyArr) {
                    item.message = formatChatBotAnswer(item.message);
                }
                setOldChatHistory(historyArr);
            }

            if (CLIENT_CONFIG.SEARCH_TYPE.VALUE == SEARCH_TYPES.VSS_TEXT.VALUE) {
                const embeddings = CLIENT_CONFIG.SEARCH_TYPE.OTHER.VSS_EMBEDDINGS;
                setSearchPlaceHolder(`Semantic Search (${embeddings})`);
            }

        })();
    }, []);

    return (
        <>
            <Navbar refreshProducts={refreshProducts} searchPlaceHolder={searchPlaceHolder} />
            <Cart refreshProducts={refreshProducts} setAlertNotification={setAlertNotification} />

            {CLIENT_CONFIG.AI_CHAT_BOT.VALUE &&
                <Chat chatMessageCallback={chatMessageCallback} oldChatHistory={oldChatHistory} />
            }

            <main className="pt-12">
                <div className="max-w-screen-xl mx-auto mt-6 px-6 pb-6">
                    <div className="mb-2 flex justify-between">
                        <span>Showing {products?.length} products {filterLabel}</span>

                        {CLIENT_CONFIG.TRIGGERS_FUNCTIONS.VALUE &&

                            <button
                                type="button"
                                onClick={resetStockQtyBtnClick}
                                className="inline-block rounded bg-slate-300 hover:bg-slate-400 px-4 pt-2 pb-2 text-xs font-semibold uppercase leading-normal text-black">
                                Reset Stock QTY
                            </button>
                        }

                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {products?.map((product) => (
                            <ProductCard key={product.productId} product={product} />
                        ))}
                    </div>
                </div>
            </main>
            {!!alertNotification &&
                typeof window !== 'undefined' &&
                createPortal(<Alert {...alertNotification} />, document.body)}
        </>
    );
}
