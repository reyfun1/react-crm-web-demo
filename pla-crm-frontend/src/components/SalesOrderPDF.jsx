import { formatMoney } from 'accounting-js'
import React from 'react'

const SalesOrderPDF = ({salesorder}) => {

    if(!Array.isArray(salesorder.SalesOrderLineRet)){
        salesorder.SalesOrderLineRet = [salesorder.SalesOrderLineRet]
    }


    const MAX_ITEMS_PER_PAGE = 8
    let itemsLength = 0
    let pagesNeeded = 0
    let itemToPrint = 0

    if(salesorder.SalesOrderLineRet && salesorder.SalesOrderLineRet.length) {
        itemsLength = salesorder.SalesOrderLineRet.length
        pagesNeeded = Math.ceil(itemsLength / MAX_ITEMS_PER_PAGE)
    }

    console.log(salesorder)


    return (
        <div className="qb-template-container fade" key={`pdf-${getRandom()}`}>
        {[...Array(pagesNeeded)].map( (e, page) => {
            return (
            <div className="qb-template-pdf" key={`page-${page + 1}-${getRandom()}`}>
            <div className="main-header">
            <div className="company-title">
                <h4>Plasencia 1865, LLC</h4>
                <p>5100 NW 72nd Ave <br />
                Bay A-1 <br />
                Miami, FL 33166
                </p>
            </div>
            <div className="invoice-header">
                <h2>Sales Order</h2>
                <table cellSpacing={0}>
                <tbody>
                    <tr>
                    <th>Date</th>
                    <th>Sales Order #</th>
                    </tr>
                    <tr>
                    <td>{salesorder.TxnDate && formatDate(salesorder.TxnDate)}</td>
                    <td>{salesorder.RefNumber && salesorder.RefNumber}</td>
                    </tr>
                </tbody></table>
            </div>
            </div>
            <br />
            <div className="billtoshipto">
            <div className="bill-to">
                <div className="header">
                <p>Bill To</p>
                </div>
                <div className="text-content">
                <p>{salesorder.BillAddress?.Addr1}<br />
                    {salesorder.BillAddress?.Addr2}<br />
                    {salesorder.BillAddress?.City},
                    {salesorder.BillAddress?.State} 
                    {salesorder.BillAddress?.PostalCode}
                    </p>
                </div>
            </div>
            <div className="ship-to">
                <div className="header">
                <p>Ship To</p>
                </div>
                <div className="text-content">
                    <p>{salesorder.ShipAddress?.Addr1}<br />
                    { salesorder.ShipAddress?.Addr2}<br />
                    { salesorder.ShipAddress?.City},
                    { salesorder.ShipAddress?.State} 
                    { salesorder.ShipAddress?.PostalCode}
                    </p>
                </div>
            </div>
            </div>
            <br />
            <table className="mini-table" cellSpacing={0}>
            <tbody><tr>
                <td>P.O. No.</td>
                <td>Terms</td>
                <td>Rep</td>
                <td>FOB</td>
                </tr>
                <tr>
                <td>{salesorder.PONumber}</td>
                <td>{salesorder.TermsRef?.FullName}</td>
                <td>{salesorder.SalesRepRef?.FullName}</td>
                <td>{salesorder.FOB}</td>
                </tr>
            </tbody></table>
            <br />
            <table className="big-table" cellSpacing={0}>
            <thead>
                <tr>
                <td>Item</td>
                <td>Description</td>
                <td>Ordered</td>
                <td>Pending</td>
                <td>Rate</td>
                <td>Amount</td>
                </tr>
            </thead>
            <tbody>
                {salesorder.SalesOrderLineRet ? [...Array(MAX_ITEMS_PER_PAGE)].map(( j, item) => {
                    itemToPrint = itemToPrint + 1
                    const arr = salesorder.SalesOrderLineRet

                    return(
                        <>
                        { itemToPrint <= arr.length && arr[itemToPrint - 1]  ? (
                            <tr key={`item-line-${itemToPrint - 1}-${getRandom()}`}>
                                <td>{arr[itemToPrint - 1].ItemRef && arr[itemToPrint - 1].ItemRef.FullName}</td>
                                <td>{arr[itemToPrint - 1].Desc && arr[itemToPrint - 1].Desc}</td>
                                <td>{arr[itemToPrint - 1].Quantity && arr[itemToPrint - 1].Quantity}</td>
                                <td>{arr[itemToPrint - 1].Invoiced &&  arr[itemToPrint - 1].Quantity - arr[itemToPrint - 1].Invoiced}</td>
                                <td>{arr[itemToPrint - 1].Rate && arr[itemToPrint - 1].Rate}</td>
                                <td>{arr[itemToPrint - 1].Quantity && formatMoney( arr[itemToPrint - 1].Quantity * ( arr[itemToPrint - 1].Rate ? arr[itemToPrint - 1].Rate : 0))}</td>
                            </tr>
                        ) : (<tr key={`item-line-blank-${itemToPrint - 1}-${getRandom()}`}>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>)
                        }
                        </>
                    )
                }): <></>}
                
            </tbody>
            </table>
            <div className="big-table-footer"> 
            <div className="footer-subtotal" />
            <div className="footer-subtotal"><h2>Subtotal</h2><p>{salesorder.Subtotal && formatMoney(salesorder.Subtotal)}</p></div>
            <div className="footer-subtotal"><h2>Total</h2><p>{salesorder.Subtotal && formatMoney(salesorder.Subtotal)}</p></div>

            </div>
            <br />
            <div className="main-footer">
            <table cellSpacing={0}>
                <tbody><tr>
                    <th>Phone #</th>
                    <th>E-mail</th>
                </tr>
                <tr>
                    <td>786-600-3228</td>
                    <td>Hank@plasencia1865.com</td>
                </tr>
                </tbody></table>
            </div>
            <br />
            <div className="page-number">Page {page + 1}</div>
      </div>
            )
        })}
      </div>
)




}

export default SalesOrderPDF


const formatDate = (date) => {
    let newDate = new Date(date).toISOString().split("T")[0].split("-")
    return `${newDate[1]}/${newDate[2]}/${newDate[0]}`
}


const getRandom = () =>{
    return Math.floor(1000 + Math.random() * 9000);
}