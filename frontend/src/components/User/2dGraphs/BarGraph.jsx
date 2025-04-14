import React from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    BarElement,
    Colors
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    BarElement,
    Legend, PointElement, LineElement, ArcElement, Colors
);

function BarGraph({ graphData }) {
    const data = JSON.parse(graphData)

    const dataBar = {
        labels: data.map(rows => rows[Object.keys(rows)[0]]),
        datasets: Object.keys(data[0]).slice(1,).map((colName, index) => ({
            label: colName,
            data: data.map(rows => rows[colName])//Object.keys(rows).slice(index+1,).map(data=>)

        }))
        //[
        //   {
        //     label: 'Dataset 1',
        //     data: [65, 59, 80, 81, 56, 55, 40],
        //     backgroundColor: 'rgba(255, 99, 132, 0.2)',
        //     borderColor: 'rgba(255, 99, 132, 1)',
        //     borderWidth: 1,
        //     barThickness: 20,
        //   },
        //   {
        //     label: 'Dataset 2',
        //     data: [28, 48, 40, 19, 86, 27, 90],
        //     backgroundColor: 'rgba(54, 162, 235, 0.2)',
        //     borderColor: 'rgba(54, 162, 235, 1)',
        //     borderWidth: 1,
        //     barThickness: 20,
        //   },
        //   {
        //     label: 'Dataset 3',
        //     data: [18, 48, 77, 9, 100, 27, 40],
        //     backgroundColor: 'rgba(75, 192, 192, 0.2)',
        //     borderColor: 'rgba(75, 192, 192, 1)',
        //     borderWidth: 1,
        //     barThickness: 20,
        //   },
        //   {
        //     label: 'Dataset 4',
        //     data: [18, 48, 77, 9, 100, 27, 40],
        //     backgroundColor: 'rgba(75, 192, 192, 0.2)',
        //     borderColor: 'rgba(75, 192, 192, 1)',
        //     borderWidth: 1,
        //     barThickness: 20,
        //   },
        // ],
    };
    
    const optionsBar = {
        responsive: true,
        plugins: {
            datalabels: false,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Multi Dataset Bar Chart',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    title: (tooltipItems) => {
                        return tooltipItems[0].label;
                    },
                    label: (tooltipItem) => {
                        return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                    },
                },
            },
        },
        hover: {
            mode: 'index',
            intersect: false,

        },
    };

    return (
        <Bar data={dataBar} options={optionsBar} />
    )
}

export default BarGraph