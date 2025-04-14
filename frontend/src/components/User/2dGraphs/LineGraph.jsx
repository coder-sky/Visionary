import { Button } from '@mui/material';
import React, { useCallback, useRef } from 'react'
import { Line } from 'react-chartjs-2';

const userActivityData = [
    { name: "Jan", users: 400, graphs: 240 },
    { name: "Feb", users: 300, graphs: 139 },
    { name: "Mar", users: 200, graphs: 980 },
    { name: "Apr", users: 278, graphs: 390 },
    { name: "May", users: 189, graphs: 480 },
    { name: "Jun", users: 239, graphs: 380 },
    { name: "Jul", users: 349, graphs: 430 },
]

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const options = {
    responsive: true,

    plugins: {
        datalabels: {
            display: false
        },
        legend: {
            position: 'bottom',
        },
        title: {
            display: true,
            text: 'Multi Dataset Bar Chart',
        },







    },

};
export const data = {
    labels,
    datasets: [
        {
            label: 'Users',
            data: userActivityData.map(data => data.users),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',

            tension: 0.4,
        },
        {
            label: 'Graphs',
            data: userActivityData.map(data => data.graphs),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            tension: 0.4,
        },
    ],
};


function LineGraph({ downloadRef, graphData,graphTitle }) {

    const data = JSON.parse(graphData)
    const lineGraphOptions = {
        responsive: true,
        plugins: {
            datalabels: {
                display: false
            },
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text:graphTitle,
            }
        },
    };
    const lineGraphData = {
        labels: data.map(rows => rows[Object.keys(rows)[0]]),
        datasets: Object.keys(data[0]).slice(1,).map((colName) => ({
            label: colName,
            data: data.map(rows => rows[colName])
        }))
    };

    return (
        <>
            <Line ref={downloadRef} options={lineGraphOptions} data={lineGraphData} />
        </>

    )
}

export default LineGraph