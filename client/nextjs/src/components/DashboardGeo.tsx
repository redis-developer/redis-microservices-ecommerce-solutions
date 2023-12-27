'use client';
import type { IChatMessageCallbackData } from '@/components/Chat';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import Cart from '@/components/Cart';
import Alert from '@/components/Alert';
import { default as Chat, CHAT_CONSTANTS } from '@/components/Chat';

import {
    triggerResetInventory,
    getZipCodes, getStoreProductsByGeoFilter,
    chatBot, getChatHistory
} from '@/utils/services';

import {
    setObjectToWindowQueryParams,
    getObjectFromWindowQueryParams,
    convertObjectToLabel,
    formatChatBotAnswer
} from '@/utils/convert';
import { CLIENT_CONFIG } from '@/config/client-config';


export default function Home() {
    const [products, setProducts] = useState<models.Product[]>();
    const [zipCodeList, setZipCodeList] = useState<ListItem[]>();
    const [selectedZipCodeInfo, setSelectedZipCodeInfo] = useState<models.ZipCode>();
    const [alertNotification, setAlertNotification] = useState({ title: '', message: '' });
    const [filterLabel, setFilterLabel] = useState<string>();
    const [nearestStore, setNearestStore] = useState<string>();
    const [oldChatHistory, setOldChatHistory] = useState<IChatMessage[]>([]);

    async function suggestionSelectedCallback(itm: ListItem) {
        setSelectedZipCodeInfo(itm.value);
        await refreshProducts(null, itm.value);
    }

    async function refreshProducts(searchData?: models.Product | null, zipCodeInfo?: models.ZipCode) {
        //_zipCodeInfo not passed on search textbox submit

        zipCodeInfo = zipCodeInfo || selectedZipCodeInfo;
        if (zipCodeInfo) {
            if (!searchData) {
                searchData = getObjectFromWindowQueryParams();
            }
            const products = await getStoreProductsByGeoFilter(zipCodeInfo, searchData?.productDisplayName, searchData?.productId)
            setProducts(products);

            setObjectToWindowQueryParams(searchData);

            setNearestStore("");
            if (products?.length) {
                setNearestStore(products[0].storeId);
            }

            let labelObj = { zipCode: zipCodeInfo?.zipCode };
            let searchFilter = convertObjectToLabel({ ...labelObj, ...searchData }) || "";
            if (searchFilter) {
                searchFilter = " with search : (" + searchFilter + ")";
            }
            setFilterLabel(searchFilter);
        }
    }

    async function getZipCodeList() {
        const listItems: ListItem[] = [];

        const zipCodes = await getZipCodes();
        for (let z of zipCodes) {
            if (z?.zipCode) {
                listItems.push({
                    text: z?.zipCode?.toString(),
                    id: z?.zipCode?.toString(),
                    value: z
                });
            }
        }

        return listItems;
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
                answer = answer.replace(/\n/g, '<br/>');
                answer = answer.replace(/<a/g, '<a class="text-blue-500 underline"');
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
            const zipCodes = await getZipCodeList();
            if (zipCodes?.length) {
                setZipCodeList(zipCodes);
                setSelectedZipCodeInfo(zipCodes[0].value);

                await refreshProducts(null, zipCodes[0].value);
            }

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
            <Navbar refreshProducts={refreshProducts}
                autoCompleteText={{
                    placeHolder: "Zip code...",
                    suggestionSelectedCallback: suggestionSelectedCallback,
                    listItems: zipCodeList ?? []
                }} />
            <Cart refreshProducts={refreshProducts} setAlertNotification={setAlertNotification} />

            {CLIENT_CONFIG.AI_CHAT_BOT.VALUE &&
                <Chat chatMessageCallback={chatMessageCallback} oldChatHistory={oldChatHistory} />
            }

            <main className="pt-12">
                <div className="max-w-screen-xl mx-auto mt-6 px-6 pb-6">
                    <div className="mb-2 flex justify-between">
                        <span>Showing {products?.length} products in nearest stores {filterLabel}</span>

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
                        {products?.map((product) => {
                            const cardColorCss = (product.storeId != nearestStore) ? 'bg-orange-100' : '';
                            return (
                                <ProductCard key={product.productId} product={product} cardColorCss={cardColorCss} />
                            )
                        }
                        )}
                    </div>
                </div>
            </main>
            {!!alertNotification &&
                typeof window !== 'undefined' &&
                createPortal(<Alert {...alertNotification} />, document.body)}
        </>
    );
}
