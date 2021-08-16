import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector} from 'react-redux'


import TabsSection from '../components/TabSection'
import CustomInput from '../components/CustomInput'

import { getCustomerData, getCustomerInvoices, resetCustomerInfo, getCustomerAppOrders, getCustomerSalesOrders, getCustomerSalesList} from '../actions/customerActions'
import { getNotesForCustomerPage } from '../actions/noteActions'
import Loader from '../components/Loader'
import NoteItem from '../components/NoteItem'
import OrderItem from '../components/OrderItem'
import TransactionTable from '../components/TransactionTable'
import Button from '../components/Button'
import ReportItem from '../components/ReportItem'
import ChartItem from '../components/ChartItem'



import accounting from 'accounting-js'

const CustomerPage = ({ match , history}) => {
    const dispatch = useDispatch()
    const customerId = match.params.id

    const userLogin = useSelector(state => state.userLogin)
    const { loading: userLoginLoading, userInfo } = userLogin;

    const customerData = useSelector(state => state.customerDetails)
    const { loading, customerInfo, error: errorCustomerDetails } = customerData;

    const customerInvoices = useSelector(state => state.customerInvoices)
    const { loading: customerInvoicesLoading, customerInvoices: customerInvoiceList, error: errorCustomerInvoices } = customerInvoices;

    const customerAppOrders = useSelector(state => state.customerAppOrders)
    const { loading: customerAppOrdersLoading, customerAppOrders: customerAppOrderList, error: errorAppOrders} = customerAppOrders;

    const customerSalesOrders = useSelector(state => state.customerSalesOrders)
    const { loading: customerSalesOrdersLoading, customerSalesOrders: customerSalesOrderList, error: errorSalesOrders} = customerSalesOrders;

    const customerSalesList = useSelector(state => state.customerSalesList)
    const { loading: customerSalesListLoading, salesList: customerSalesListObj, error: errorCustomerSalesList} = customerSalesList;

    const customerNotes = useSelector(state => state.customerNotes)
    const { loading: customerNotesLoading, notes } = customerNotes;


    useEffect(async() => {
        if(!userInfo) {
            history.push('/login')
        } else{
            // check if the customer is different
            // if the custoemr is different, reset data & dispatch for new data
            // otherwise do nothing

            if(!customerInfo) return 
            if(customerId !== customerInfo.ListID){
                dispatch( await getCustomerData(customerId)) 
                dispatch( resetCustomerInfo())
            }

        }

    }, [dispatch, match,customerId])

    // Get later from the db 
    const transactionTypes = ['Invoices', 'App-Orders']

    const [transactionType, setTransactionType] = useState(transactionTypes[0])
    const [activeTab,setActiveTab] = useState(0)

    // checking if there are states saved from sessionstorage
    useEffect(() => {
        const data = sessionStorage.getItem("customerPage")
        if(data){
            setTransactionType(JSON.parse(data).transactionType)
            setActiveTab(JSON.parse(data).activeTab)
        }
    }, [])

    // Saving the state to session storage
    useEffect(() => {
        sessionStorage.setItem("customerPage", JSON.stringify({
            transactionType : transactionType,
            activeTab : activeTab
        }))
    })


    const getNotesForAccountHandler = () => {
        // if there are notes and they are the same as id as customer id then load
        if(notes.length > 1){
            if(notes[0].CustomerRef.ListID !== customerId){
                dispatch(getNotesForCustomerPage())
            }
        }
        // there no notes 
        else{
            dispatch(getNotesForCustomerPage())
        }    
    }

    const transactionLoaderHandler  = () => {
        if(transactionType === 'Invoices'){
            if(customerInvoiceList && customerInvoiceList.length > 0 && customerInvoiceList[0]['CustomerRef']['ListID'] === customerInfo.ListID){
                // alert(`Invoices already loaded for Customer : ${customerInfo.FullName && customerInfo.FullName}`)
            } else{
                dispatch(getCustomerInvoices(customerInfo.ListID))
            } 
        }

        if(transactionType === 'App-Orders'){
            if(customerAppOrderList && customerAppOrderList.length > 0 && customerAppOrderList[0]['CustomerRef']['ListID'] === customerInfo.ListID){
                // alert(`App order List already loaded for Customer : ${customerInfo.FullName && customerInfo.FullName}`)
            } else{
                dispatch(getCustomerAppOrders(customerInfo.ListID))
            } 
        }

        if(transactionType === 'Sales-Orders'){
            if(customerSalesOrderList && customerSalesOrderList.length > 0 && customerSalesOrderList[0]['CustomerRef']['ListID'] === customerInfo.ListID){
                // alert(`App order List already loaded for Customer : ${customerInfo.FullName && customerInfo.FullName}`)
            } else{
                dispatch(getCustomerSalesOrders(customerInfo.ListID))
            } 
        }
    }

    const handletest = () => {
        dispatch(getCustomerSalesList(customerInfo.ListID))
    }

    return (
        <div className="page-padding extra-large page-animated fade">
                {errorCustomerDetails ? (
                    <div className="info-key-value with-logo">
                    <i className="fas fa-exclamation-circle"></i>
                    <p>Error : {errorCustomerDetails.code}</p>
                </div>
                )
                :(
                    <>
                    {!loading ? (<div className="customer-header-section">
                    <h2 className="title">{customerInfo && customerInfo.FullName}</h2>

                    <div className="customer-sub-section">
                        <p><i className="fas fa-store"></i></p>
                        <p>{customerInfo && customerInfo.AccountNumber}</p>
                        {<p>{customerInfo && customerInfo.ShipAddress && customerInfo.ShipAddress.City 
                            + ', ' + customerInfo.ShipAddress.State}</p>}
                    </div>

                    <div className="customer-sub-actions">
                        <Link to={`/ordercreate?customerListID=${customerId}`} className="customer-add-order">
                            <p><i className="fas fa-file-invoice-dollar"></i> ADD ORDER</p>
                        </Link>

                        <Link to={`/notecreate?customerListID=${customerId}`} className="customer-add-note">
                            <p><i className="fas fa-pen"></i> ADD NOTE</p>
                        </Link>

                        {/* <a className="customer-add-desc">
                            <p><i className="fas fa-comment-medical"></i> ADD DESC.</p> 
                        </a> */}
                    </div>

                    <TabsSection activeTab={activeTab} setActiveTab={setActiveTab}>
                            <div name="tab-buttons">
                                <button>Info</button>
                                <button>Stats</button>
                                <button onClick={getNotesForAccountHandler}>Notes</button>
                                <button>Transactions</button>
                            </div>

                            <div name="tab-pages">
                                <div>
                                
                                <div className="info-section">
                                    <p className="section-title">Account Status Information</p>
                                    <div className="section-content flex">
                                        <div className="info-key-value">
                                            <p>Current Balance</p>
                                            <p>{customerInfo && accounting.formatMoney(customerInfo.Balance)}</p>
                                        </div>
                                        <div className="info-key-value">
                                            <p>Payment Terms</p>
                                            <p>{ customerInfo && customerInfo.TermsRef && customerInfo.TermsRef?.FullName}</p>
                                        </div>
                                        <div className="info-key-value">
                                            <p>Account Created</p>
                                            <p>{customerInfo && new Date(customerInfo?.TimeCreated).toLocaleDateString()}</p>
                                        </div>
                                        <div className="info-key-value">
                                            <p>Price Level</p>
                                            <p>{customerInfo && customerInfo.PriceLevelRef ? customerInfo.PriceLevelRef?.FullName : 'Standard'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="divider"></div>

                                <div className="info-section">
                                    <p className="section-title">Contact Information</p>
                                    <div className="section-content">
                                        <div className="info-key-value with-logo">
                                            <i className="fas fa-user-circle"></i>
                                            <div>
                                                <p>Main Contact</p>
                                                <p>{ customerInfo && customerInfo.FirstName} {customerInfo && customerInfo.LastName}</p>
                                            </div>
                                        </div>
                                        <div className="info-key-value with-logo">
                                            <i className="fas fa-phone-square-alt"></i>
                                            <div>   
                                                <p>Main Phone</p>
                                                <p>{customerInfo && <a href={`tel:${customerInfo.Phone?.replace( /^\D+/g, '')}`}>{customerInfo.Phone}</a>}</p>
                                            </div>
                                        </div>
                                        <div className="info-key-value with-logo">
                                            <i className="fas fa-envelope-square"></i>
                                        <div>
                                                <p>Main Email</p>
                                                <p>{customerInfo && <a href={`mailto:${customerInfo.Email}`}>{customerInfo.Email}</a>}</p>
                                        </div>
                                        </div>
                                        <div className="info-key-value with-logo"> 
                                            <i className="fas fa-map-marker-alt"></i>
                                            <div>
                                                <p>Shipping Address</p>
                                                {customerInfo && customerInfo.ShipAddress && 
                                                <p>{customerInfo.ShipAddress.Addr1}<br/>
                                                {customerInfo.ShipAddress.Addr2}<br/>
                                                {customerInfo.ShipAddress.City}, {customerInfo.ShipAddress.State} {customerInfo.ShipAddress.PostalCode}
                                                </p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <br/>
                                <div className="info-section">
                                    <p className="section-title">Sales Information</p>
                                    <div className="section-content flex">
                                        <div className="info-key-value">
                                            <p>Last Invoice #</p>
                                            <p>{customerSalesListObj?.lastInvoice?.RefNumber}</p>
                                        </div>
                                        <div className="info-key-value">
                                            <p>Last Invoice Date</p>
                                            <p>{ customerSalesListObj?.lastInvoice?.InvDate}</p>
                                        </div>
                                    </div>
                                </div>
                                <br/><br/><br/>
                                {customerSalesListObj && customerSalesListObj.yearSales ? <ChartItem type='customer-page-sales-list' chartData={customerSalesListObj.yearSales}/> : <></>}
                                <br/><br/><br/><br/>
                                {customerSalesListObj && customerSalesListObj.yearSales ? <ReportItem type='customer-page-sales-summary-table' data={customerSalesListObj.yearSales}/> : <></>}
                            </div>
                            <div>
                                {customerNotesLoading ? (<Loader/>) : (
                                    <>
                                    {notes ? (
                                        <>
                                       
                                        {notes.length > 0 && notes[0].CustomerRef.ListID !== customerId ? getNotesForAccountHandler(): <></>}
                                            <p className="feed-result-text">{notes.length} Notes Found</p>
                                            <div className="feed notes-feed">
                                                {notes
                                                    .sort((a,b) => b.TimeStamp.toDate() - a.TimeStamp.toDate())
                                                    .map(note => (
                                                    <NoteItem key={note.id} note={note}/>              
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p className="feed-result-text">0 Notes Found</p>
                                        </>
                                    )}
                                    </>
                                )}
                            </div>
                            <div>
                                <div className='input-section'>
                                <CustomInput 
                                    title="Type of Transaction to show" 
                                    placeholder=""
                                    elName="customer-transaction-type"
                                    type="select"
                                    options={transactionTypes}
                                    value={transactionType}
                                    onChange={e => setTransactionType(e.target.value)}
                                />

                                <Button typeBtn="Load" onClick={transactionLoaderHandler} text={`Load ${transactionType}`}/>
                                <div className="divider clear"></div>


                                {transactionType === 'Invoices' && (
                                    <>
                                    {customerInvoicesLoading ? <Loader/> 
                                    : errorCustomerInvoices ? <p>Error: {errorCustomerInvoices.code}</p> : (
                                        <>
                                        {customerInvoiceList && customerInvoiceList.length > 0 ? (
                                            <TransactionTable data={customerInvoiceList}  type="customer-page-invoices"/>
                                        ) : (
                                            <p className="feed-result-text"> <i className="fas fa-exclamation-circle"></i> No invoices were found</p>
                                        )}
                                        </>
                                    )
                                    }
                                    </>
                                )}

                                {transactionType === 'App-Orders' && (
                                    <>
                                    {customerAppOrdersLoading ? <Loader/> 
                                    : errorAppOrders ? <p>Error: {errorAppOrders.code}</p> : (
                                        <>
                                        {customerAppOrderList && customerAppOrderList.length > 0 ? (
                                            <TransactionTable data={customerAppOrderList}  type="customer-page-apporders"/>
                                        ) : (
                                            <p className="feed-result-text"> <i className="fas fa-exclamation-circle"></i> No app-orders were found</p>
                                        )}
                                        </>
                                    )
                                    }
                                    </>
                                )}

                                {transactionType === 'Sales-Orders' && (
                                    <>
                                    {customerSalesOrdersLoading ? <Loader/> 
                                    : errorSalesOrders ? <p>Error: {errorSalesOrders.code}</p> : (
                                        <>
                                        {customerSalesOrderList && customerSalesOrderList.length > 1 ? (
                                            <TransactionTable data={customerSalesOrderList}  type="customer-page-salesorders"/>
                                        ) : (
                                            <p className="feed-result-text"> <i className="fas fa-exclamation-circle"></i> No sales-orders were found</p>
                                        )}
                                        </>
                                    )
                                    }
                                    </>
                                )}
                            
                                </div>
                            </div>
                        </div>
                    </TabsSection>

                </div>) : (
                    <Loader/>
                )}
                </>
                )}
   
        </div>
    )
}


export default CustomerPage
