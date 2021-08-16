import React from 'react'
import accounting from 'accounting-js';

const ReportItem = ({type, data}) => {

    switch (type) {
        case 'customer-page-sales-summary-table':
            return (
                <div className="report-item-container">
                    <div className="info-section" >
                        <p className="section-title">Sales Details</p>
                    </div>
                <table>
                    <thead>
                        <tr>
                            <th>Year</th>
                            <th>Avg / Invoice</th>
                            <th>Facings</th>
                            <th>Sales</th>
                            <th>%Change</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data && Object.keys(data).map(year => {
                            const percentChangeResult = data[year - 1] ? percentChange(data[year - 1].totalSales,data[year].totalSales) : '-'
                            const hasInfinty = percentChangeResult.split(' ')[0] === 'Infinity'

                            return <tr key={year}>
                                <td>{year}</td>
                                <td>{accounting.formatMoney(data[year].avgPerInvoice)}</td>
                                <td>{data[year].facings}</td>
                                <td>{accounting.formatMoney(data[year].totalSales)}</td>
                                <td >{ hasInfinty ? '-' : percentChangeResult }</td>
                            </tr>
                        })}
                    </tbody>
                </table>

                    
                </div>
            )

    }
}


const percentChange = (initial,final) => {
    const result = accounting.toFixed(( (final - initial) / initial) * 100, 0)
    return result + " %"
}

export default ReportItem


