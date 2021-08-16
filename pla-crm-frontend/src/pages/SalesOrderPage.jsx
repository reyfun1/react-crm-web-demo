import React, {useEffect, useRef, useState} from 'react'

import InvoicePDF from '../components/InvoicePDF'
import { useDispatch, useSelector} from 'react-redux'

import PageTitle from '../components/PageTitle'
import { jsPDF } from "jspdf";
import SalesOrderPDF from '../components/SalesOrderPDF';

const SalesOrderPage = ({match}) => {

    const soNum = match.params.id
    
    const customerSalesOrders = useSelector(state => state.customerSalesOrders)
    const { loading: customerSalesOrdersLoading, customerSalesOrders: customerSalesOrdersList } = customerSalesOrders;

    const [salesOrder, setSalesOrder] = useState({})

    const doc = new jsPDF('portrait','px', [825,1065], false, true, 5, 1)

    const x = useRef(null)

    // Use effect to check if the invoice request came from the custoemr page 
    useEffect(() => {
       if(!customerSalesOrdersLoading ) {
           const foundSoFromCustomerList = customerSalesOrdersList.find(so => so.RefNumber === soNum)
           if(foundSoFromCustomerList){
               
                setSalesOrder(foundSoFromCustomerList)
           } else{
               // disaptch to get an invocie from the databse here 
           }
       }
    }, [])

     
    const clickHandler = () => {
        const salesOrderHTML = x.current.innerHTML

        doc.html(salesOrderHTML, {
            x: 0,
            y: 0
        })

        setTimeout(  ()=>{
            doc.save(`SalesOrder_${soNum}_from_Plasencia_1865_LLC.pdf`)
        }, 1000)    
    }

    return (
        <div style={{padding: 0}}className="page-padding extra-large fade">
            <PageTitle title='Sales Order Page' subtitle={`Showing Sales Order # ${salesOrder.RefNumber}`} btns={[]}></PageTitle>
            <br/><br/>
            <button onClick={clickHandler}>Download Sales Order</button>
            <br/><br/>
            <div id="invoice-preview-container" ref={x}>
                <SalesOrderPDF salesorder={salesOrder} />
            </div>
            <br/><br/><br/><br/><br/><br/><br/>
        </div>
    )
}

export default SalesOrderPage
