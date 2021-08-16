import React, {useEffect, useRef, useState} from 'react'

import InvoicePDF from '../components/InvoicePDF'
import { useSelector} from 'react-redux'
import { useHistory } from 'react-router-dom'

import PageTitle from '../components/PageTitle'
import { jsPDF } from "jspdf";

const InvoicePage = ({match}) => {

    const history = useHistory()

    const invNum = match.params.id
    
    const customerInvoices = useSelector(state => state.customerInvoices)
    const { loading: customerInvoicesLoading, customerInvoices: customerInvoiceList } = customerInvoices;

    const listInvoices = useSelector(state => state.invoiceList)
    const { loading: allInvoicesLoading, invoiceList: allInvoicesList } = listInvoices;

    const [invoice, setInvoice] = useState({})

    const doc = new jsPDF('portrait','px', [825,1065], false, true, 5, 1)

    const x = useRef(null)

    // Use effect to check if the invoice request came from the custoemr page 
    useEffect(() => {
        // Look for the invoices in the diff lists 
        const foundInvFromCustomerList = customerInvoiceList.find(inv => inv.RefNumber === invNum)
        const foundInvFromAllList = allInvoicesList.find(inv => inv.RefNumber === invNum)
        if(foundInvFromCustomerList)setInvoice(foundInvFromCustomerList)
        if(foundInvFromAllList)setInvoice(foundInvFromAllList)
    }, [])

     
    const clickHandler = () => {
        const invoicesArrHTML = x.current.innerHTML

        doc.html(invoicesArrHTML, {
            x: 0,
            y: 0
        })

        setTimeout(  ()=>{
            doc.save(`Inv_${invNum}_from_Plasencia_1865_LLC.pdf`)
        }, 1000)    
    }

    const handleGoToCustomerClick = () => {
        history.push(`/customerpage/${invoice.CustomerRef.ListID}`)
    }

    return (
        <div style={{padding: '1rem'}}className="page-padding extra-large fade">
            <PageTitle title='Invoice Page' subtitle={`Showing Invoice # ${invoice.RefNumber}`} btns={[]}></PageTitle>
            <br/><br/>
            <div className="flex" style={{justifyContent : 'space-around'}}>
                <button onClick={clickHandler}>Download Invoice</button>
                <button onClick={handleGoToCustomerClick}>Go to Customer</button>
            </div>
            <br/><br/>
            <div id="invoice-preview-container" ref={x}>
                <InvoicePDF invoice={invoice} />
            </div>
            <br/><br/><br/><br/><br/><br/><br/>
        </div>
    )
}

export default InvoicePage
