import React, { useEffect} from 'react'
import PageTitle from '../components/PageTitle'
import Loader  from '../components/Loader'

import { useDispatch, useSelector} from 'react-redux'

import {getOrderDetails, setOrderStatus} from '../actions/orderActions'
import accounting from 'accounting-js'
import TransactionTable from '../components/TransactionTable'


const OrderViewPage = ({ match }) => {
    const dispatch = useDispatch()
    const orderId = match.params.id

    // getting state resources 
    const { userInfo } = useSelector( state => state.userLogin)

    const { loading:loadingOrderStatus, success, error } = useSelector( state => state.orderChangeStatus)
    const { loading, order} = useSelector(state => state.orderDetails)
    
    
    // get the order details
    useEffect(()=>{
        dispatch(getOrderDetails(orderId))
    },[orderId])

    const deleteHandler = () => {

    }

    const handleStatusChange = () => {
        // const typesOfOrderStatus = ['OrderSubmitted, OrderInQBooks']
        let val = ''

        switch(order.OrderStatus){
            case 'OrderSubmitted':
                val = 'OrderInQBooks'
            break;
            case 'OrderInQBooks':
                val = 'OrderSubmitted'
            break;
            default:
                val = 'OrderInQBooks'
            break;
        }
        // if rep is not office, then give warning 
        dispatch(setOrderStatus(val, orderId))

    }
    const { CustomerRef, AuthorRef, TimeStamp ,id , OrderInstructions, OrderTotals, Products, NewCustomerRef, PriceLevel, Terms} = order;

    return (
        <div id='view-order-page' className="page-padding large page-animated fade">
            <PageTitle title="Order Page" subtitle="Showing order"/>
            <br/><br/>
            {loading ? (<Loader/>) : Object.keys(order).length > 0 ? (
                <>
                <div className="info-section">
                    <div className="flex">
                    {order.NewCustomer ? <p className="section-title">New Customer <span style={{color: 'red'}}>*</span></p> : <div>&nbsp;</div>}
                 <p className="section-title">App-Order #{ order.id} </p>
                    </div>
                 <div className="section-content">
                    <div className="info-key-value with-logo">
                        <i className="fas fa-store"></i>
                        <div>
                                <p>Account Name</p>
                                <p>{CustomerRef.CompanyName ? CustomerRef.CompanyName : order.NewCustomerRef?.ContactInfo?.CompanyName}</p>
                        </div>
                    </div>
                    <div className="info-key-value">
                        <div>
                                <p>Account #</p>
                                <p>{CustomerRef && CustomerRef.AccountNumber ? CustomerRef.AccountNumber : 'no-number'}</p>
                        </div>
                    </div>
                    <div className="info-key-value with-logo">
                        <i className="fas fa-user-edit"></i>
                        <div>
                                <p>Submitted by</p>
                                <p>{AuthorRef.displayName ? AuthorRef.displayName : 'Anonymous'}</p>
                        </div>
                    </div>
                    <div className="info-key-value">
                        <div>
                                <p>Submitted on</p>
                                <p>{formatDateTime(TimeStamp.toDate())}</p>
                        </div>
                    </div>
                    <div className="info-key-value with-logo">
                        <i className="fas fa-clipboard-list"></i>
                        <div>
                                <p>Order Instructions</p>
                                <p>{OrderInstructions}</p>
                        </div>
                    </div>
                    <div className="info-key-value">
                        <div >
                                <p>REP</p>
                                <p>{order.RepCode ? order.RepCode : '-'}</p>
                        </div>
                    </div>
                    
                 </div>
                </div>
                <br/><br/>

                <div className="info-section" id="order-form-totals">
                            <p className="section-title">Order Summary</p>
                            <div className="section-content">
                                <div className="info-key-value ">
                                    <div>
                                            <p>Total Amount</p>
                                            <p>{accounting.formatMoney(OrderTotals.amount)}</p>
                                    </div>
                                </div>
                                <div className="info-key-value ">
                                    <div>
                                            <p>Qty</p>
                                            <p>{OrderTotals.qty}</p>
                                    </div>
                                </div>
                                <div className="info-key-value ">
                                    <div>
                                            <p>Facings</p>
                                            <p>{OrderTotals.facings}</p>
                                    </div>
                                </div>
                            </div>
                </div>

                <br/><br/>

                <TransactionTable type="app-order-producs" data={Object.keys(Products).map(o => Products[o])} />
                <br/>
                <br/>

                {/* Information for new customer  */}
                {order.NewCustomer && 
                    <>
                    <div className="info-section">
                    <p className="section-title">New Account/Customer Information</p>
                    <div className="section-content flex">
                            <div className="info-key-value ">
                                <div>
                                        <p>Company Name</p>
                                        <p>{NewCustomerRef.ContactInfo?.CompanyName}</p>
                                </div>
                            </div>
                            <div className="info-key-value ">
                                <div>
                                        <p>Contact Name</p>
                                        <p>{NewCustomerRef.ContactInfo?.FirstName} {NewCustomerRef.ContactInfo?.LastName}</p>
                                </div>
                            </div>
                            <div className="info-key-value ">
                                <div>
                                        <p>Contact Information</p>
                                        <p>
                                        {NewCustomerRef.ContactInfo?.Phone ? <>Phone: {NewCustomerRef.ContactInfo?.Phone} <br/> </> : <>-<br/></>}
                                        {NewCustomerRef.ContactInfo?.Email ? <>Email: {NewCustomerRef.ContactInfo?.Email} <br/> </> : <>-<br/></>}
                                        </p>
                                </div>
                            </div>
                            <div className="info-key-value ">
                                <div>
                                        <p>Shipping Address</p>
                                        <p>
                                        {NewCustomerRef.ShipAddress?.Addr2}<br/>
                                        {NewCustomerRef.ShipAddress?.City}, {NewCustomerRef.ShipAddress?.State} {NewCustomerRef.ShipAddress?.PostalCode}
                                        </p>
                                </div>
                            </div>
                            <div className="info-key-value ">
                                <div>
                                        <p>Pricing and Terms </p>
                                        <p>Special Pricing: {PriceLevel} <br/> Terms: {Terms}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br/>
                    </>
                }            

                
                {/* Order status */}
                {error ? (
                    <>
                        <p><i className="fas fa-exclamation-circle"></i> There has been an error</p>
                    </>
                ) : (
                    <>
                    { allowedStatusEditUsers.includes(userInfo?.uid) ? (
                        <div className="info-section">
                        <p className="section-title">
                            Status
                        </p>
                        <br/>
                            {order.OrderStatus === 'OrderInQBooks' ? (
                                <p><i className="fas fa-check-circle"></i> Order in Quickbooks</p>
                            ) : (
                                <p><i className="fas fa-times-circle"></i> Order Submitted on the app</p>
                            )}
                            <button onClick={handleStatusChange}>Change status</button>
                            {/* <RadioSelector 
                                name="orderViewStatus"
                                selectedValue={order?.OrderStatus}
                                options={
                                    [{title: 'Order Submitted To App', value: 'OrderSubmitted'},
                                    {title: 'Order in QBooks', value : 'OrderInQBooks'}]
                                } 
                                handleChange={e => handleStatusChange(e)}
                            /> */}
                        </div>
                    ) : (
                        <>
                        </>
                    )}
                    </>
                ) }
                
                </>
            ) : (<p>There seems to be an isse, try again later</p>)}

           
        </div>
    )
}

const formatDateTime = (date) => {
    let dateString =  `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
    let timeString = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' })
    return dateString + ' ' +  timeString
}


function getCurrentUser(auth) {
    return new Promise((resolve, reject) => {
       const unsubscribe = auth.onAuthStateChanged(user => {
          unsubscribe();
          resolve(user);
       }, reject);
    });
  }

export default OrderViewPage


// Users Only Allowed to edit the status of order
const allowedStatusEditUsers = [
    'pvVYZPa2v4U9yFt35Gz7nGBFWBE2',
     'O3i2Ifm4wRNPl6M2LHkawfi8ZVY2',
     'qc70o2sDswTwU3ot21V1FGrXQ5o1',
     'VlYEyzPRQFgPDK33uGNZUVaKvYT2',
     'BI3FqdZMRQMDW7kCJbFVYmkyjPT2'
]


