'use client';
import type { IChartInfo } from './chart';
import { useEffect, useState } from 'react';

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
    const { chartData, chartOptions } = createBasicChartData(chartInfo);

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

    const { chartData, chartOptions } = createBasicChartData(chartInfo);
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

    useEffect(() => {
        (async () => {
            const result = await getOrderStats();
            setOrderStats(result);
            //setOrderStats(getDummyData());
        })();
    }, []);

    return (
        <main>
            <div>
                (add nav bar)
                RefreshButton functionality
            </div>
            <div>
                Total Purchase Amount : {orderStats?.totalPurchaseAmount}
            </div>
            <hr />
            <div>
                <div>
                    Brand wise revenue
                </div>
                <div style={{ height: "400px" }}>
                    {//@ts-ignore
                        <Doughnut data={brandPurchaseChart.chartData} options={brandPurchaseChart.chartOptions} />
                    }

                </div>
                <hr />
                <div>
                    Category wise interests
                </div>
                <div style={{ height: "400px" }}>
                    {//@ts-ignore
                        <PolarArea data={categoryPurchaseChart.chartData} options={categoryPurchaseChart.chartOptions} />
                    }
                </div>
                <hr />
                <div>
                    Top Trending Products
                </div>
                <div style={{ height: "400px" }}>
                    {//@ts-ignore
                        <Bar data={productPurchaseChart.chartData} options={productPurchaseChart.chartOptions} />
                    }
                </div>
            </div>

        </main >

    );
}

