import React from 'react'

import accounting from 'accounting-js'

import { Link } from 'react-router-dom'

const OrderItem = ({order}) => {
    const {AuthorRef, CustomerRef, OrderTotals, TimeStamp, id, NewCustomerRef, NewCustomer} = order

    return (
        <div className="order">
            <Link to={`/orderview/${id}`}>
            <div className={order.OrderStatus === 'OrderInQBooks' ? 'order-container highlight': 'order-container'}>
                <div className="order-left">
                    <p>{CustomerRef.CompanyName ? CustomerRef.CompanyName : NewCustomerRef.ContactInfo?.CompanyName }</p>
                    {NewCustomer && <p>New Customer <span style={{color : 'red'}}>*</span></p>}
                    <p>{formatDateTime(TimeStamp.toDate())}</p>
                    <p>{AuthorRef && AuthorRef.displayName ? AuthorRef.displayName : 'Anonymous' }</p>
                </div>
                <div className="order-right">
                    <p>{accounting.formatMoney(OrderTotals.amount)}</p>
                    <p>{OrderTotals.qty } boxes</p>
                    <p>{OrderTotals.facings } skus</p>
                </div>
            </div>
            </Link>
        </div> 
    )
}

const formatDateTime  = (date) => {
    let dateString =  `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
    let timeString = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' })

    return dateString + ' ' +  timeString
}



export default OrderItem
