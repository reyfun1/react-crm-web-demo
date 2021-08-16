import { formatMoney } from 'accounting-js'
import React from 'react'

const InvoicePDF = ({invoice}) => {

    const MAX_ITEMS_PER_PAGE = 8
    let itemsLength = 0
    let pagesNeeded = 0
    let itemToPrint = 0

    if(invoice.InvoiceLineRet && invoice.InvoiceLineRet.length) {
        itemsLength = invoice.InvoiceLineRet.length
        pagesNeeded = Math.ceil(itemsLength / MAX_ITEMS_PER_PAGE)
    }


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
                <h2>Invoice</h2>
                <table cellSpacing={0}>
                <tbody>
                    <tr>
                    <th>Date</th>
                    <th>Invoice #</th>
                    </tr>
                    <tr>
                    <td>{invoice.TxnDate && formatDate(invoice.TxnDate)}</td>
                    <td>{invoice.RefNumber && invoice.RefNumber}</td>
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
                <p>{invoice.BillAddress && invoice.BillAddress.Addr1 && invoice.BillAddress.Addr1}<br />
                    {invoice.BillAddress && invoice.BillAddress.Addr2 && invoice.BillAddress.Addr2}<br />
                    {invoice.BillAddress && invoice.BillAddress.City && invoice.BillAddress.City},
                    {invoice.BillAddress && invoice.BillAddress.State && invoice.BillAddress.State} 
                    {invoice.BillAddress && invoice.BillAddress.PostalCode && invoice.BillAddress.PostalCode}
                    </p>
                </div>
            </div>
            <div className="ship-to">
                <div className="header">
                <p>Ship To</p>
                </div>
                <div className="text-content">
                    <p>{invoice.ShipAddress && invoice.ShipAddress.Addr1 && invoice.ShipAddress.Addr1}<br />
                    {invoice.ShipAddress && invoice.ShipAddress.Addr2 && invoice.ShipAddress.Addr2}<br />
                    {invoice.ShipAddress && invoice.ShipAddress.City && invoice.ShipAddress.City},
                    {invoice.ShipAddress && invoice.ShipAddress.State && invoice.ShipAddress.State} 
                    {invoice.ShipAddress && invoice.ShipAddress.PostalCode && invoice.ShipAddress.PostalCode}
                    </p>
                </div>
            </div>
            </div>
            <br />
            <table className="mini-table" cellSpacing={0}>
            <tbody><tr>
                <td>S.O. No.</td>
                <td>P.O. No.</td>
                <td>Terms</td>
                <td>Due Date</td>
                <td>Rep</td>
                <td>FOB</td>
                </tr>
                <tr>
                <td></td>
                <td>{invoice.PONumber}</td>
                <td>{invoice.TermsRef ? invoice.TermsRef.FullName : ''}</td>
                <td>{invoice.DueDate ? formatDate(invoice.DueDate) : ''}</td>
                <td>{invoice.SalesRepRef ? invoice.SalesRepRef.FullName : ''}</td>
                <td></td>
                </tr>
            </tbody></table>
            <br />
            <table className="big-table" cellSpacing={0}>
            <thead>
                <tr>
                <td>Item</td>
                <td>Description</td>
                <td>MSRP</td>
                <td>Qty</td>
                <td>Backordered</td>
                <td>Rate</td>
                <td>Amount</td>
                </tr>
            </thead>
            <tbody>
                {invoice.InvoiceLineRet ? [...Array(MAX_ITEMS_PER_PAGE)].map(( j, item) => {
                    itemToPrint = itemToPrint + 1
                    const arr = invoice.InvoiceLineRet

                    return(
                        <>
                        { itemToPrint <= arr.length  ? (
                            <tr key={`item-line-${arr[itemToPrint - 1].ItemRef ? arr[itemToPrint - 1].ItemRef.ListID : ''}`}>
                                <td>{arr[itemToPrint - 1].ItemRef && arr[itemToPrint - 1].ItemRef.FullName}</td>
                                <td>{arr[itemToPrint - 1].Desc && arr[itemToPrint - 1].Desc}</td>
                                <td>{''}</td>
                                <td>{arr[itemToPrint - 1].Quantity && arr[itemToPrint - 1].Quantity}</td>
                                <td>{''}</td>
                                <td>{arr[itemToPrint - 1].Rate && arr[itemToPrint - 1].Rate}</td>
                                <td>{arr[itemToPrint - 1].Amount && arr[itemToPrint - 1].Amount}</td>
                            </tr>
                        ) : (<tr key={`item-line-blank-${itemToPrint - 1}-${getRandom()}`}>
                                <td></td>
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
            <div className="footer-subtotal"><h2>Subtotal</h2><p>{invoice.Subtotal && formatMoney(invoice.Subtotal)}</p></div>
            <div className="footer-subtotal"><h2>Total</h2><p>{invoice.Subtotal && formatMoney(invoice.Subtotal)}</p></div>
            <div className="footer-subtotal"><h2>Payments/Credits</h2><p>{formatMoney( (invoice.Subtotal * 1 )- (invoice.BalanceRemaining * 1))}</p></div>
            <div className="footer-subtotal"><h2>Balance Due</h2><p>{formatMoney(invoice.BalanceRemaining)}</p></div>
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

export default InvoicePDF


const formatDate = (date) => {
    let newDate = new Date(date).toISOString().split("T")[0].split("-")
    return `${newDate[1]}/${newDate[2]}/${newDate[0]}`
}


const getRandom = () =>{
    return Math.floor(1000 + Math.random() * 9000);
}