import {
    Chart as ChartJS, CategoryScale, LinearScale, RadialLinearScale, Title, Tooltip,
    ArcElement, BarElement, Scriptable, ScriptableContext, Legend
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar, Pie, Doughnut, PolarArea } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, RadialLinearScale, Title, Tooltip, ArcElement, BarElement, Legend);
ChartJS.register(ChartDataLabels);

interface IChartInfo {
    labels?: string[];
    dataSets?: {
        name: string;
        values: number[];
    }[];

    xAxisLabel?: string;
    yAxisLabel?: string;
}

const colors = [
    "#FF9999",// - Light Red
    "#66CCFF",// - Light Sky Blue
    "#99FF99",// - Pale Green
    "#FFFF66",// - Pale Yellow
    "#FFCC99",// - Peach
    "#99E6E6",// - Pale Cyan
    "#FF99FF",// - Light Magenta
    // "#FF6666",// - Soft Red
    // "#99E699",// - Soft Green
    // "#99CCFF",// - Soft Blue
    "#D9B3FF",// - Pastel Purple
    "#80E0FF",// - Light Turquoise
    "#FFCC66",// - Gold
    "#C2C2F0",// - Lavender
    "#FFB366",// - Light Orange
];


function createBasicChartData(_chartInfo: IChartInfo, isReverseColors?: boolean) {
    let chartColors: string[] = colors;

    if (isReverseColors) {
        chartColors = [...colors].reverse();
    }

    const chartData = {
        labels: _chartInfo.labels,
        datasets: []
    };

    if (_chartInfo.dataSets && _chartInfo.dataSets.length) {
        for (let dataSet of _chartInfo.dataSets) {

            //@ts-ignore
            chartData.datasets.push({
                label: dataSet.name,
                data: dataSet.values,
                borderWidth: 1,
                backgroundColor: chartColors,
                // borderColor: chartColors,
            });
        }
    }

    const chartOptions: any = {
        plugins: {
            datalabels: {
                color: '#000',
                formatter: function (value: number) {
                    return value; //default
                },
                // font: {
                //     size: 14,
                //     weight: 'bold',
                // },
            },
            legend: {
                position: 'right'
            }
        }
    };

    return {
        chartData,
        chartOptions
    }
}

function createBarChartData(_ChartInfo: IChartInfo) {
    let { chartData, chartOptions } = createBasicChartData(_ChartInfo, true);

    //custom options
    chartOptions.scales = {
        x: {
            // display: true,
            title: {
                display: !!_ChartInfo?.xAxisLabel,
                text: _ChartInfo?.xAxisLabel || ""
            }
        },
        y: {
            beginAtZero: true,
            title: {
                display: !!_ChartInfo?.yAxisLabel,
                text: _ChartInfo?.yAxisLabel || ""
            }
        }
    };

    if (chartOptions?.plugins?.datalabels) {
        chartOptions.plugins.datalabels.anchor = "end";
        chartOptions.plugins.datalabels.align = "top";
        chartOptions.plugins.datalabels.offset = 5; // distance from the top of the bar
    }
    if (chartOptions?.plugins?.legend) {
        chartOptions.plugins.legend.position = "top";
    }

    return {
        chartData,
        chartOptions
    }
}


export {
    createBarChartData,
    createBasicChartData,
    Bar,
    Pie,
    Doughnut,
    PolarArea
}

export type {
    IChartInfo,
}