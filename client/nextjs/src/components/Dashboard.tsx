'use client';
import type { IChatMessageCallbackData } from '@/components/Chat';

import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import Cart from '@/components/Cart';
import Alert from '@/components/Alert';
import { getProducts, triggerResetInventory, chatBot, getChatHistory } from '@/utils/services';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { default as Chat, CHAT_CONSTANTS } from '@/components/Chat';
import {
    setObjectToWindowQueryParams,
    getObjectFromWindowQueryParams,
    convertObjectToLabel,
    formatChatBotAnswer
} from '@/utils/convert';

export default function Home() {
    const [products, setProducts] = useState<models.Product[]>();
    const [alertNotification, setAlertNotification] = useState({ title: '', message: '' });
    const [filterLabel, setFilterLabel] = useState<string>();
    const [oldChatHistory, setOldChatHistory] = useState<IChatMessage[]>([]);

    async function refreshProducts(searchData?: models.Product) {
        if (!searchData) {
            searchData = getObjectFromWindowQueryParams();
        }
        const products = await getProducts(searchData?.productDisplayName, searchData?.productId);
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
        })();
    }, []);

    return (
        <>
            <Navbar refreshProducts={refreshProducts} />
            <Cart refreshProducts={refreshProducts} setAlertNotification={setAlertNotification} />
            <Chat chatMessageCallback={chatMessageCallback} oldChatHistory={oldChatHistory} />
            <main className="pt-12">
                <div className="max-w-screen-xl mx-auto mt-6 px-6 pb-6">
                    <div className="mb-2 flex justify-between">
                        <span>Showing {products?.length} products {filterLabel}</span>
                        <button
                            type="button"
                            onClick={resetStockQtyBtnClick}
                            className="inline-block rounded bg-slate-300 hover:bg-slate-400 px-4 pt-2 pb-2 text-xs font-semibold uppercase leading-normal text-black">
                            Reset Stock QTY
                        </button>
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
