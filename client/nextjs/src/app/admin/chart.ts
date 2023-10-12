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
    "#FF5733",
    "#581845",
    "#E9724D",
    "#D6D727",
    "#92CAD1",
    "#79CCB3",
    "#868686",
    "#F4ECC1",
    "#F781BF",
    "#A6ACAF",
    "#F2F2F2",
    "#E9F9FF",
    "#CCEEFF",
    "#9BD1FF",
    "#6ACFFF",
];

const reverseColors = [...colors].reverse();

function createBasicChartData(_chartInfo: IChartInfo, _colors?: string[]) {
    if (!_colors) {
        _colors = reverseColors;
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
                backgroundColor: _colors,
                // borderColor: _colors,
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
    let { chartData, chartOptions } = createBasicChartData(_ChartInfo, colors);

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