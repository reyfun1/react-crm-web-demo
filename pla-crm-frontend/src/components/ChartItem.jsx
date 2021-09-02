import React from 'react'

import { Bar } from 'react-chartjs-2'
import "chartjs-plugin-datalabels";
import accounting from 'accounting-js';


const ChartItem = ({type, chartData}) => {
    // Bar.defaults.global.plugins.datalabels.anchor = 'end';
    // Bar.defaults.global.plugins.datalabels.align = 'end';

    switch (type) {
        case 'customer-page-sales-list':
            const data = {
                labels : Object.keys(chartData).filter( (year, index) => index >= Object.keys(chartData).length - 4).map(year => year),
                datasets : [
                    {
                        
                        data: Object.keys(chartData).filter( (year, index) => index >= Object.keys(chartData).length - 4).map(year => chartData[year].totalSales),
                        backgroundColor : Object.keys(chartData).map( (year, index) => getDifferentColors(index)),
                        
                    }
                ]
            }
            const options = {
                //scaleLabel : label => '$' + label.value.toString(),
                legend: {
                    display: false
                },
                maintainAspectRatio: true,
                responsive: true,
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: true,
                        callback: function(value, index, values) {
                            if(parseInt(value) >= 1000){
                              return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                            } else {
                              return '$' + value;
                            }
                          }
                      },
                    },
                  ],
                },
                plugins: {
                    datalabels: {
                        anchor: 'end',
                        align: 'start',
                        offset: '-25',
                        color: 'white',
                        borderWidth: 4,
                        font: {
                            weight: 700,
                        },
                        display: ctx => {
                            return true;
                        },
                        formatter: (ctx, data) => {
                            const index = data.dataIndex
                            const amount = data.dataset.data[index]
                            return accounting.formatMoney(amount);
                        }
                    }
                  }
              }

              return (
                  <div className="chart-container bar">
                      <div className="info-section" >
                            <p className="section-title">Sales by year</p>
                        </div>
                      <Bar data={data} options={options} />
                  </div>
              )
        case 'home-page-sales-goals':
        const data1 = {
            labels : ['Something'],
            datasets : [
                {
                    data: [50],
                    backgroundColor : getDifferentColors(2), 
                }
            ]
        }
        const options1 = {
            //scaleLabel : label => '$' + label.value.toString(),
            legend: {
                display: false
            },
            maintainAspectRatio: false,
            responsive: true,
            scales: {
                yAxes: [
                {
                    ticks: {
                    beginAtZero: true,
                    },
                },
                ],
            },
            plugins: {
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    color: 'white',
                    borderWidth: 4,
                    font: {
                        weight: 800,
                    },
                    display: ctx => {
                        return true;
                    },
                    formatter: (ctx, data) => {
                        const index = data.dataIndex
                        const amount = data.dataset.data[index]
                        return accounting.formatMoney(amount);
                    }
                }
                }
            }

            return (
                <div className="chart-container bar">
                    <div className="info-section" >
                        <p className="section-title">Sales by year</p>
                    </div>
                    <Bar data={data1} options={options1} />
                </div>
            )
    
        default:
            break;
    }
}


const getDifferentColors = (index) => {
    const colors = [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)'
    ]
    return colors[index]
}



export default ChartItem

