'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import Cart from '@/components/Cart';
import Alert from '@/components/Alert';
import {
    triggerResetInventory,
    getZipCodes, getStoreProductsByGeoFilter
} from '@/utils/services';


export default function Home() {
    const [products, setProducts] = useState<models.Product[]>();
    const [zipCodeList, setZipCodeList] = useState<ListItem[]>();
    const [selectedZipCodeInfo, setSelectedZipCodeInfo] = useState<models.ZipCode>();
    const [alertNotification, setAlertNotification] = useState({ title: '', message: '' });
    const [filterLabel, setFilterLabel] = useState<string>();
    const [nearestStore, setNearestStore] = useState<string>();

    async function suggestionSelectedCallback(itm: ListItem) {
        setSelectedZipCodeInfo(itm.value);
        await refreshProducts("", itm.value);
    }

    async function refreshProducts(_search: string, _zipCodeInfo?: models.ZipCode) {
        //_zipCodeInfo not passed on search textbox submit

        _zipCodeInfo = _zipCodeInfo || selectedZipCodeInfo;
        if (_zipCodeInfo) {
            if (!_search) {
                _search = window?.location?.search ?? '';
            }
            const searchText = _search.replace(/\?search=/g, '');
            const products = await getStoreProductsByGeoFilter(_zipCodeInfo, searchText)
            setProducts(products);

            setNearestStore("");
            if (products?.length) {
                setNearestStore(products[0].storeId);
            }

            let label = "For zip code: " + _zipCodeInfo?.zipCode;
            if (searchText) {
                label += " and search: " + searchText;
            }
            label = "(" + label + ")";
            setFilterLabel(label);
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
        await refreshProducts("");

        setAlertNotification({
            title: `RESET STOCK QTY`,
            message:
                'Stock Qty of all products are updated to default value!',
        });
    }

    useEffect(() => {
        (async () => {
            const zipCodes = await getZipCodeList();
            if (zipCodes?.length) {
                setZipCodeList(zipCodes);
                setSelectedZipCodeInfo(zipCodes[0].value);

                await refreshProducts("", zipCodes[0].value);
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
            <main className="pt-12">
                <div className="max-w-screen-xl mx-auto mt-6 px-6 pb-6">
                    <div className="mb-2 flex justify-between">
                        <span>Showing {products?.length} products in nearest stores {filterLabel}</span>
                        <button
                            type="button"
                            onClick={resetStockQtyBtnClick}
                            className="inline-block rounded bg-slate-300 hover:bg-slate-400 px-4 pt-2 pb-2 text-xs font-semibold uppercase leading-normal text-black">
                            Reset Stock QTY
                        </button>
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
