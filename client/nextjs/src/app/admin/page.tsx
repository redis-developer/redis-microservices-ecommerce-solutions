'use client';
import type { IChartInfo } from './chart';
import { useEffect, useState } from 'react';

import Navbar from '@/components/Navbar';
import Image from 'next/image';
import { getShortName, toCurrency } from '@/utils/convert';

import {
    Bar, Doughnut, PolarArea,
    createBarChartData, createBasicChartData
} from './chart';
import { getOrderStats } from '@/utils/services';

function getBrandPurchaseChartInfo(_orderStats?: api.OrderStatsResponse) {
    const chartInfo: IChartInfo = {
        xAxisLabel: "Brands",
        yAxisLabel: "Purchase Amount"
    }
    if (_orderStats?.brandPurchaseAmountSet?.length) {
        const labels: string[] = [];
        const values: number[] = [];

        _orderStats.brandPurchaseAmountSet.forEach(itm => {
            labels.push(itm.value);
            values.push(itm.score);
        })

        chartInfo.labels = labels;
        chartInfo.dataSets = [{
            name: "BrandPurchaseAmount",
            values: values
        }];
    }

    //const { chartData, chartOptions } = createBarChartData(chartInfo);
    const { chartData, chartOptions } = createBasicChartData(chartInfo, false);

    return {
        chartData,
        chartOptions
    }
}

function getCategoryPurchaseChartInfo(_orderStats?: api.OrderStatsResponse) {
    const chartInfo: IChartInfo = {
        xAxisLabel: "Category",
        yAxisLabel: "Purchase Amount"
    }
    if (_orderStats?.categoryPurchaseAmountSet?.length) {
        const labels: string[] = [];
        const values: number[] = [];

        _orderStats.categoryPurchaseAmountSet.forEach(itm => {
            labels.push(itm.value);
            values.push(itm.score);
        })

        chartInfo.labels = labels;
        chartInfo.dataSets = [{
            name: "CategoryPurchaseAmount",
            values: values
        }];
    }

    const { chartData, chartOptions } = createBasicChartData(chartInfo, true);
    return {
        chartData,
        chartOptions
    }
}

function getProductPurchaseChartInfo(_orderStats?: api.OrderStatsResponse) {
    const chartInfo: IChartInfo = {
        xAxisLabel: "Product",
        yAxisLabel: "Purchase Qty"
    }
    if (_orderStats?.productPurchaseQtySet?.length) {
        const labels: string[] = [];
        const values: number[] = [];

        _orderStats.productPurchaseQtySet.forEach(itm => {
            labels.push(itm.value);
            values.push(itm.score);
        })

        chartInfo.labels = labels;
        chartInfo.dataSets = [{
            name: "ProductPurchaseQty",
            values: values
        }];
    }

    // const { chartData, chartOptions } = createBasicChartData(chartInfo);
    const { chartData, chartOptions } = createBarChartData(chartInfo);
    return {
        chartData,
        chartOptions
    }
}

function getDummyData() {
    return {
        "totalPurchaseAmount": "18629",
        "productPurchaseQtySet": [
            {
                "value": "11000",
                "score": 1
            },
            {
                "value": "11009",
                "score": 1
            },
            {
                "value": "11010",
                "score": 1
            },
            {
                "value": "11017",
                "score": 1
            },
            {
                "value": "11021",
                "score": 1
            },
            {
                "value": "11001",
                "score": 2
            }
        ],
        "categoryPurchaseAmountSet": [
            {
                "value": "apparel:topwear",
                "score": 3734
            },
            {
                "value": "accessories:watches",
                "score": 14895
            }
        ],
        "brandPurchaseAmountSet": [
            {
                "value": "Inkfruit",
                "score": 499
            },
            {
                "value": "Wrangler",
                "score": 3235
            },
            {
                "value": "Puma",
                "score": 14895
            }
        ],
        "products": [
            {
                "productId": "11000",
                "price": 3995,
                "productDisplayName": "Puma Men Slick 3HD Yellow Black Watches",
                "variantName": "Slick 3HD Yellow",
                "brandName": "Puma",
                "ageGroup": "Adults-Men",
                "gender": "Men",
                "displayCategories": "Accessories",
                "styleImages_default_imageURL": "http://host.docker.internal:8080/images/11000.jpg",
                "productDescriptors_description_value": "",
                "stockQty": 25,
            },
            {
                "productId": "11001",
                "price": 5450,
                "productDisplayName": "Puma Men Top Fluctuation Red Black Watches",
                "variantName": "Top Fluctuation Red",
                "brandName": "Puma",
                "ageGroup": "Adults-Men",
                "gender": "Men",
                "displayCategories": "Accessories",
                "styleImages_default_imageURL": "http://host.docker.internal:8080/images/11001.jpg",
                "productDescriptors_description_value": "",
                "stockQty": 25,
            },
            {
                "productId": "11009",
                "price": 499,
                "productDisplayName": "Inkfruit Men Let Me Skate White Tshirts",
                "variantName": "Let Me Skate",
                "brandName": "Inkfruit",
                "ageGroup": "Adults-Men",
                "gender": "Men",
                "displayCategories": "Casual Wear",
                "styleImages_default_imageURL": "http://host.docker.internal:8080/images/11009.jpg",
                "productDescriptors_description_value": "",
                "stockQty": 25,
            },
            {
                "productId": "11010",
                "price": 1095,
                "productDisplayName": "Wrangler Women Smocked Yoke Purple Tops",
                "variantName": "SMOCKED YOKE",
                "brandName": "Wrangler",
                "ageGroup": "Adults-Women",
                "gender": "Women",
                "displayCategories": "Sale and Clearance,Casual Wear",
                "styleImages_default_imageURL": "http://host.docker.internal:8080/images/11010.jpg",
                "productDescriptors_description_value": "",
                "stockQty": 25,
            },
            {
                "productId": "11017",
                "price": 1295,
                "productDisplayName": "Wrangler Women Floral Print Blue Top",
                "variantName": "POOPY PRINT",
                "brandName": "Wrangler",
                "ageGroup": "Adults-Women",
                "gender": "Women",
                "displayCategories": "Casual Wear",
                "styleImages_default_imageURL": "http://host.docker.internal:8080/images/11017.jpg",
                "productDescriptors_description_value": "",
                "stockQty": 25,
            },
            {
                "productId": "11021",
                "price": 845,
                "productDisplayName": "Wrangler Women Freedom Spirit Black T-Shirts",
                "variantName": "FREEDOM SPIRIT",
                "brandName": "Wrangler",
                "ageGroup": "Adults-Women",
                "gender": "Women",
                "displayCategories": "Sale and Clearance,Casual Wear",
                "styleImages_default_imageURL": "http://host.docker.internal:8080/images/11021.jpg",
                "productDescriptors_description_value": "",
                "stockQty": 25,
            }
        ]
    };
}

export default function Home() {
    const [orderStats, setOrderStats] = useState<api.OrderStatsResponse>();

    const brandPurchaseChart = getBrandPurchaseChartInfo(orderStats);
    const categoryPurchaseChart = getCategoryPurchaseChartInfo(orderStats);
    const productPurchaseChart = getProductPurchaseChartInfo(orderStats);

    async function refreshBtnClick() {
        const result = await getOrderStats();
        const MAX_TRENDING_ITEMS = 6;

        if (result?.products?.length) {
            result.products = result.products.slice(0, MAX_TRENDING_ITEMS);
        }

        setOrderStats(result);
    }

    useEffect(() => {
        (async () => {
            await refreshBtnClick();
            //setOrderStats(getDummyData());
        })();
    }, []);



    return (
        <>
            <Navbar path="admin" />
            <main>
                <div className="max-w-screen-xl mx-auto p-6 pt-16">
                    <div className="mb-2 flex justify-between">
                        <h5 className="font-bold uppercase">
                            Total Purchase Amount :
                            <span className="text-sm pl-1">
                                {toCurrency(orderStats?.totalPurchaseAmount)}
                            </span>
                        </h5>

                        <button
                            type="button"
                            onClick={refreshBtnClick}
                            className="inline-block rounded bg-slate-300 hover:bg-slate-400 px-4 pt-2 pb-2 text-xs font-semibold uppercase leading-normal text-black">
                            Refresh Stats
                        </button>
                    </div>

                    <hr />

                    <div className="pt-3 flex justify-between">
                        <div>
                            <div className="font-bold uppercase">
                                Brand wise revenue
                            </div>
                            <div style={{ width: "500px" }}>
                                {//@ts-ignore
                                    <Doughnut data={brandPurchaseChart.chartData} options={brandPurchaseChart.chartOptions} />
                                }
                            </div>
                        </div>
                        <div>
                            <div className="font-bold uppercase">
                                Category wise interests
                            </div>
                            <div style={{ width: "500px" }}>
                                {//@ts-ignore
                                    <PolarArea data={categoryPurchaseChart.chartData} options={categoryPurchaseChart.chartOptions} />
                                }
                            </div>
                        </div>

                    </div>

                    <hr />

                    <div className="pt-3">
                        <div className="font-bold uppercase">
                            Top Trending Products
                        </div>
                        {/* <div style={{ height: "400px" }}>
                            {//@ts-ignore
                                <Bar data={productPurchaseChart.chartData} options={productPurchaseChart.chartOptions} />
                            }
                        </div> */}
                        <div className="pt-3 flex flex-wrap justify-start">
                            {orderStats?.products?.map((product) => (
                                <div key={product.productId} className="block max-w-sm rounded bg-white shadow-lg border border-neutral-200 m-2">
                                    <Image
                                        className="rounded-t-lg w-auto mx-auto"
                                        style={{ height: '160px' }}
                                        src={product.styleImages_default_imageURL}
                                        alt={product.productDisplayName}
                                        width={480}
                                        height={640}
                                    />
                                    <hr />
                                    <div className="p-6 bg-slate-100">
                                        <h5 className="mb-2 h-20 text-xl font-medium leading-tight text-neutral-800">
                                            {product.productDisplayName}
                                        </h5>
                                        <p className="mb-4 text-base text-neutral-600">
                                            {getShortName(product.productDescriptors_description_value)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main >
        </>

    );
}
