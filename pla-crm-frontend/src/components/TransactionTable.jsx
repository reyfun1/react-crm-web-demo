import React, { useState, useEffect, useRef } from 'react'

import { useDispatch, useSelector} from 'react-redux'
import { useHistory } from "react-router-dom";

import accounting from 'accounting-js'

import {  standardDateFormatFromQb, standardDateFormat } from '../utils/DateMethods'


import TableCSVExporter from '../utils/TableCSVExporter'
import Button from '../components/Button'

import { differenceInDays } from 'date-fns'


const TransactionTable = ({data, type, onClick, addBtnClick, editUserClick, deleteUserClick}) => {
    const history = useHistory()

    // grab the current active customer
    const customerData = useSelector(state => state.customerDetails)
    const { loading, customerInfo } = customerData;


    // init headers 
    let headers = []

    // table references 
    const customerPageInvoices = useRef(null)
    const customerPageSalesOrders = useRef(null)
    const customerPageAppOrders = useRef(null)
    const customerListTable = useRef(null)
    const iventoryListStatus = useRef(null)
    const salesOrderProducts = useRef(null)


    // export to csv method
    const handleExportCsvClick = (htmlTable) => {

        const exporter = new TableCSVExporter(htmlTable.current);
        const csvOutput = exporter.convertToCSV();
        const csvBlob = new Blob([csvOutput], { type: "text/csv" });
        const blobUrl = URL.createObjectURL(csvBlob);
        const anchorElement = document.createElement("a");

        anchorElement.href = blobUrl;
        anchorElement.download = "table-export.csv";
        anchorElement.click();

        setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
        }, 500);
    }

    switch (type) {
        case 'customer-page-invoices':
            headers= ['#','Date','Total','Balance','Age']

            console.log(data)
            const invoiceRowClickHandler = invNum =>{
                history.push(`/invoiceview/${invNum}`)
            }
            return (
                <>
                {customerInfo.ListID !== data[0]?.CustomerRef?.ListID ? (
                        <p className="feed-result-text"> Press "Load Invoices" </p>
                    ) : (
                <div className="transaction-table">
                    {/* Table Title  */}
                    <div className="info-section flex">
                        <p className="section-title"> {data?.length} Invoices for { customerInfo && customerInfo.CompanyName}</p>
                        <br/>
                        <button onClick={ () => handleExportCsvClick(customerPageInvoices)}> Export <i className="fas fa-file-csv"></i> </button>
                    </div>

                    <table ref={customerPageInvoices}>
                        <thead>
                            <tr>
                                {headers.map((header,i) => (
                                    <th key={i}>{header}</th>
                                ))}
                            </tr> 
                        </thead>
                        <tbody>
                            {data?.length > 0 && 
                            data.sort((a,b) => (new Date(b.TxnDate) - new Date(a.TxnDate)))
                            .map((transaction,i) => {
                                const invoiceOverDue = Number.parseInt(transaction.BalanceRemaining) > 0 
                                && determineDueAge(transaction.DueDate) > 0   
                                ? true: false
                                
                                return (
                                <tr key={i} className={invoiceOverDue ? 'problem' : ''} onClick={() => invoiceRowClickHandler(transaction.RefNumber)}>
                                    <td>{transaction.RefNumber}</td>
                                    <td>{standardDateFormatFromQb(transaction.TxnDate)}</td>
                                    <td>{accounting.formatMoney(transaction.Subtotal)}</td>
                                    <td>{accounting.formatMoney(transaction.BalanceRemaining)}</td>
                                    <td className={invoiceOverDue ? 'red' : '' }>{Number.parseInt(transaction.BalanceRemaining) > 0 
                                        ? determineDueAge(transaction.DueDate)
                                        : 0}</td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
                )}
                </>
            ) ;
        case 'customer-page-salesorders':
                headers= ['#','Date','Terms','Amount','Open']
                const salesOrderClickHandler = soNum =>{
                    history.push(`/salesorderview/${soNum}`)
                }
                return (
                    <>
                    {customerInfo.ListID !== data[0]?.CustomerRef?.ListID ? (
                        <p className="feed-result-text"> Press "Load Sales-Orders" </p>
                    ) : (
                        <div className="transaction-table">
                        {/* Table Title  */}
                        <div className="info-section flex">
                            <p className="section-title">Sales Orders for { customerInfo && customerInfo.CompanyName}</p>
                            <br/>
                            <button onClick={ () => handleExportCsvClick(customerPageSalesOrders)}> Export <i className="fas fa-file-csv"></i> </button>
                        </div>
    
                        
                        <table ref={customerPageSalesOrders}>
                            <thead>
                                <tr>
                                    {headers.map((header,i) => (
                                        <th key={i}>{header}</th>
                                    ))}
                                </tr> 
                            </thead>
                            <tbody>
                                {data?.length > 0 && 
                                data.sort((a,b) => (new Date(b.TxnDate) - new Date(a.TxnDate)))
                                .map((transaction,i) => {
                                    return (
                                    <tr key={i} className={transaction.IsFullyInvoiced === 'true' ? '' : 'warning'} onClick={() => salesOrderClickHandler(transaction.RefNumber)}>
                                        {console.log(transaction.IsFullyInvoiced)}
                                        <td>{transaction.RefNumber}</td>
                                        <td>{standardDateFormatFromQb(transaction.TxnDate)}</td>
                                        <td>{transaction.TermsRef?.FullName}</td>
                                        <td>{accounting.formatMoney(transaction.Subtotal)}</td>
                                        <td>{transaction.IsFullyInvoiced === 'true' ? 'Closed' : 'Pending'}</td>
                                    </tr>
                                )})}
                            </tbody>
                        </table>
                    </div>
                    )}
                    </>
                ) ;
        case 'lists-customers':
        headers= ['Name','City', 'State','Contact','ZIP', 'Acc#']
        
        const customerRowClickHandler = customerListID =>{
            history.push(`/customerpage/${customerListID}`)
        }
        return (
            <div className="transaction-table">
                {data.length > 0 ? (
                    <>
                    {/* Table Title  */}
                    <div className="info-section flex">
                        <p className="section-title">Showing {data.length} Customer(s) </p>
                        <button onClick={ () => handleExportCsvClick(customerListTable)}> Export <i className="fas fa-file-csv"></i> </button>
                    </div>

                    <table ref={customerListTable}>
                        <thead>
                            <tr>
                                {headers.map((header,i) => (
                                    <th key={i}>{header}</th>
                                ))}
                            </tr> 
                        </thead>
                        <tbody>
                            {data.length > 0 && 
                            data
                            // .sort( (a,b) => {
                            //     if((a.CompanyName < b.CompanyName)) return -1
                            //     if((a.CompanyName > b.CompanyName)) return 1
                            // })
                            .map((customer,i) => {                  
                                return (
                                <tr className='fade' key={i} onClick={() => customerRowClickHandler(customer.ListID)}>
                                    <td>{customer.CompanyName}</td>
                                    <td>{customer.City}</td>
                                    <td>{customer.State}</td>
                                    <td>{customer.FirstName} {customer.LastName}</td>
                                    <td>{customer.PostalCode}</td>
                                    <td>{customer.AccountNumber}</td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                    </>
                ) : (
                    <p style={{'textAlign': 'center'}}>No results</p>
                ) }
            </div>
        ) ;
        case 'customer-page-apporders':
            headers = ['Date','Order Id #','Amount', 'Author']

            const appOrderRowClickHandler = (orderId) =>{
                history.push(`/orderview/${orderId}`)
            }

            return (
                <>
                {customerInfo.ListID !== data[0]?.CustomerRef?.ListID ? (
                        <p className="feed-result-text"> Press "Load App-Orders" </p>
                    ) : (
                <div className="transaction-table">
                    {/* Table Title  */}
                    <div className="info-section">
                            <p className="section-title">App Orders for { customerInfo && customerInfo.CompanyName}</p>
                            <br/>
                            <button onClick={ () => handleExportCsvClick(customerPageAppOrders)}> Export <i className="fas fa-file-csv"></i> </button>
                        </div>
                    <table ref={customerPageAppOrders}>
                        <thead>
                            <tr>
                                {headers.map((header,i) => (
                                    <th key={i}>{header}</th>
                                ))}
                            </tr> 
                        </thead>
                        <tbody>
                            {data && data.length > 0 ? (
                            data.sort((a,b) => (new Date(b.TimeStamp) - new Date(a.TimeStamp)))
                            .map((transaction,i) => {
                                
                                return (
                                <tr key={i} onClick={() => appOrderRowClickHandler(transaction.id)}>
                                    <td>{standardDateFormat(transaction.TimeStamp.toDate())}</td>
                                    <td>{transaction.id}</td>
                                    <td>{accounting.formatMoney(transaction.OrderTotals.amount)}</td>
                                    <td>{transaction.AuthorRef.displayName ? transaction.AuthorRef.displayName : 'Anonymous'}</td>
                                </tr>)

                            })) :  (<></>)}
                        </tbody>
                    </table>
                </div>
                )} 
                </>)
        case 'admin-users-display':
            headers = ['Role','Name','Email', 'State Restriction', 'Initials', 'Last Login', '']

            const usersOnRowClick = (orderId) =>{
                // history.push(`/orderview/${orderId}`)
            }

            return (
                <div className="transaction-table users-table">
                <br/>
                    <h2>User List</h2>
                    <table>
                        <thead>
                            <tr>
                                {headers.map((header,i) => (
                                    <th key={i}>{header}</th>
                                ))}
                            </tr> 
                        </thead>
                        <tbody>
                            {data && data.length > 0 ? (
                            data.sort((a,b) => (new Date(b.TimeStamp) - new Date(a.TimeStamp)))
                            .map((user,i) => {
                                
                                return (
                                <tr key={i} onClick={() => usersOnRowClick(user.id)}>
                                    <td>{user.role}</td>
                                    <td>{user.firstname + " " + user.lastname}</td>
                                    <td>{user.email}</td>
                                    <td>{user.restrictions?.states.map(state => <span key={state}>{state} </span>)}</td>
                                    <td>{user.firstname?.substring(0,1) + user.lastname?.substring(0,1)}</td>
                                    <td>{user.lastLogin}</td>
                                    <td className='td-btns'> 
                                        <Button typeBtn="Edit" onClick={e => editUserClick?.(user)}/> &nbsp;&nbsp; 
                                        {/* <Button typeBtn="Delete" onClick={e => deleteUserClick?.(user.id)}/> */}
                                    </td>
                                </tr>)

                            })) :  (<></>)}
                        </tbody>
                    </table>
                    <br/>
                    <Button typeBtn='AddUser' onClick={addBtnClick}></Button>
                </div>
            )

        case 'lists-invoices':
        headers= ['#','Name','Terms','Date','Total', 'Age']
        const invoiceRowClickHandlerListPage = invNum =>{
            history.push(`/invoiceview/${invNum}`)
        }
        return (
            <>
            <div className="transaction-table">
                {/* Table Title  */}
                <div className="info-section flex">
                    <p className="section-title"> {data?.length > 1 ? data?.length : ''} Invoices</p>
                    <br/>
                    <button onClick={ () => handleExportCsvClick(customerPageInvoices)}> Export <i className="fas fa-file-csv"></i> </button>
                </div>

                
                <table ref={customerPageInvoices}>
                    <thead>
                        <tr>
                            {headers.map((header,i) => (
                                <th key={i}>{header}</th>
                            ))}
                        </tr> 
                    </thead>
                    <tbody>
                        {data?.length > 0 && 
                        data.sort((a,b) => (b.RefNumber - a.RefNumber))
                        .map((transaction,i) => {
                            const invoiceOverDue = Number.parseInt(transaction.BalanceRemaining) > 0  && determineDueAge(transaction.DueDate) > 0 ? true: false
                            
                            return (
                            <tr key={i} className={invoiceOverDue ? 'problem' : ''} onClick={() => invoiceRowClickHandlerListPage(transaction.RefNumber)}>
                                <td>{transaction.RefNumber}</td>
                                <td>{transaction.CustomerRef?.FullName}</td>
                                <td>{transaction.TermsRef?.FullName}</td>
                                <td>{standardDateFormatFromQb(transaction.TxnDate)}</td>
                                <td>{accounting.formatMoney(transaction.Subtotal)}</td>
                                <td className={invoiceOverDue ? 'red' : '' }>{Number.parseInt(transaction.BalanceRemaining) > 0 ? determineDueAge(transaction.DueDate): 0}</td>
                            </tr>
                        )})}
                    </tbody>
                </table>
            </div>
            </>
        ) ;
    
        case 'lists-inventory-status':
                headers= ['Item','Qty on Hand','Qty on Sales Order']

                return (
                    <>
                    {!data ? <p>No data</p> : (
                        <div className="transaction-table">
                        <div className="info-section flex">
                            <p className="section-title">Inventory Status </p>
                            <br/>
                            <button onClick={ () => handleExportCsvClick(iventoryListStatus)}> Export <i className="fas fa-file-csv"></i> </button>
                        </div>

                        <table ref={iventoryListStatus}>
                        <thead>
                            <tr>
                            {headers.map((header,i) => (
                                    <th key={i}>{header}</th>
                                ))}
                            </tr>
                            
                        </thead>
                        {data.length < 1 ?  <></> : (
                            <tbody>
                            {data
                            .sort((a,b) => a.Name.localeCompare(b.Name))
                            .map((product, index, arr) => {
                                //separate sections in the order form 
                                let isDiffFromPrev = false
                                if(index > 0 && arr[index - 1].FullName.substring(0,4) !== product.FullName.substring(0,4)){
                                    isDiffFromPrev = true
                                }
                                return (
                                    <tr key={product.ListID} 
                                    className={
                                        (product.QuantityOnHand < 100 ? product.QuantityOnHand < 5 ? "problem" : 'warning' : '') 
                                        + (isDiffFromPrev ? "" : "")}>
                                        <td>{product.SalesDesc}</td>
                                        <td>{product.QuantityOnHand}</td>
                                        <td>{product.QuantityOnSalesOrder}</td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        )}

                        </table>
                </div>
                    )}
                    </>
                ) ;
        case 'app-order-producs':
                headers= ['Item','Description','Price', 'Qty']

                return (
                    <>
                    {!data ? <p>No data</p> : (
                        <div className="transaction-table">
                        <div className="info-section flex">
                            <p className="section-title">Products Summary </p>
                            <br/>
                            <button onClick={ () => handleExportCsvClick(salesOrderProducts)}> Export <i className="fas fa-file-csv"></i> </button>
                        </div>

                        <table ref={salesOrderProducts} id='order-page-summary-products'>
                        <thead>
                            <tr>
                            {headers.map((header,i) => (
                                    <th key={i}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        {data.length < 1 ?  <></> : (
                            <tbody>
                                <>
                            {data
                            .sort( (a, b) => a.productCode.localeCompare(b.productCode))
                            .map( (product, index, arr) => {
                                //separate sections in the order form 
                                let isDiffFromPrev = false
                                if(index > 0 && arr[index - 1].productCode.substring(0,4) !== product.productCode.substring(0,4)){
                                    isDiffFromPrev = true
                                }

                                return (
                                    <tr key={`app-order-${product.productCode}`} listid={product.productCode} >
                                        <td className='nowrap'>{product.productCode}</td>
                                        <td>{product.name}</td>
                                        <td>{accounting.formatMoney(product.price)}</td>
                                        <td>{product.qty}</td>
                                    </tr>
                                )
                            })}
                            <tr>
                                <td></td>
                                <td></td>
                                <td style={{fontWeight: 'bold'}}>{accounting.formatMoney(data.reduce( (acc, current) => (current.price * current.qty) + acc, 0))}</td>
                                <td style={{fontWeight: 'bold'}}>{data.reduce( (acc, current) => current.qty + acc, 0)}</td>
                            </tr>
                            </>
                            </tbody>
                        )}

                        </table>
                </div>
                    )}
                    </>
                ) ;
        default:
            break;
    }
}

const determineDueAge = (date) => {
    const daysDiff = differenceInDays(new Date(), new Date(date))
    if(daysDiff < 0) return 0
    return daysDiff
}

export default TransactionTable


const statesList = [ "-", "AK",
"AL",
"AR",
"AS",
"AZ",
"CA",
"CO",
"CT",
"DC",
"DE",
"FL",
"GA",
"GU",
"HI",
"IA",
"ID",
"IL",
"IN",
"KS",
"KY",
"LA",
"MA",
"MD",
"ME",
"MI",
"MN",
"MO",
"MS",
"MT",
"NC",
"ND",
"NE",
"NH",
"NJ",
"NM",
"NV",
"NY",
"OH",
"OK",
"OR",
"PA",
"PR",
"RI",
"SC",
"SD",
"TN",
"TX",
"UT",
"VA",
"VI",
"VT",
"WA",
"WI",
"WV",
"WY"]


