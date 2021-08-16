import React, { useState , useEffect} from 'react'
import PageTitle from '../components/PageTitle'
import CustomInput from '../components/CustomInput'
import Loader from '../components/Loader'
import TransactionTable from '../components/TransactionTable'
import {getInvoiceList} from '../actions/invoiceActions'

import {  standardDateFormatFromQb } from '../utils/DateMethods'

import { useDispatch, useSelector} from 'react-redux'

const ListsPage = React.memo(({ history }) => {
    const dispatch = useDispatch()

    // User information 
    const {userInfo} = useSelector( state => state.userLogin)

    // Customer List from Redux
    const customerListState = useSelector(state => state.customerList)
    const { loading: loadingCustomerList , customerList} = customerListState

    // Invoice List from Redux
    const invoiceListState = useSelector(state => state.invoiceList)
    const { loading: loadingInvoiceList , invoiceList, disableShowMore} = invoiceListState

    // Sales Order List from Redux
    // const salesOrderListState = useSelector(state => state.salesOrderList)
    // const { loading: loadingSalesOrderList , salesOrderList} = salesOrderListState
    
    // Componment Level states 
    const [customerListCompState, setCustomerListCompState] = useState(customerList)
    const [invoiceListCompState, setInvoiceListCompState] = useState(invoiceList)
    const [salesOrderListCompState, setSalesOrderListCompState] = useState(customerList)


    // Regular Component States
    const [typeOfList, setTypeOfList] = useState('Customer List')
    const [keyword, setKeyword] = useState('')
    const [filterField, setFilterField] = useState('Name')
    const [sortField, setSortField] = useState('Name')
    const [filterOptions, setFilterOptions] = useState(customerListFilterOptions)
    const [sortOptions, setSortOptions] = useState(customerListSortOptions)


    // Check the type of list selected 
    useEffect(()=>{
        switch (typeOfList) {
            case 'Customer List':
                setFilterOptions(customerListFilterOptions)
                setSortOptions(customerListSortOptions)
                break;
            case 'Invoice List':
                setFilterOptions(invoiceListFilterOptions)
                setSortOptions(invoiceListSortOptions)
                if(invoiceList.length < 1) {
                    dispatch(getInvoiceList())
                }
                // do nothing
                break;
            case 'Sales Order List':
                // do nothing
                break;
            default:
                break;
        }
        // dispatch to get the invoices,sales orders or custoemr list 
    },[typeOfList])


    // Populate the state level customer list when the actual customer list if finiaished loading from the db 
    useEffect(() => {
        setCustomerListCompState(customerList)
    }, [customerList])

    // Populate the state level customer list when the actual customer list if finiaished loading from the db 
    useEffect(() => {
        setInvoiceListCompState(invoiceList)
    }, [invoiceList])

    const handleListFilterSort = () => {
        switch (typeOfList) {
            case 'Customer List':
                handleCustomerListFilter(keyword)
                break;
            case 'Invoice List':
                handleInvoiceListFilter(keyword)
                break;
            default:
                break;
        }
    }


    const handleCustomerListFilter = (text) => {
        // space forwradslahs
        text = text.replace(/\\/g, "\\\\");

        const regex = new RegExp(text,'gi')

        let filterFunction, sortFunction
        
        // Determine right filter function
        switch (filterField) {
            case "Name":
                filterFunction = (customer) => (customer["CompanyName"]).match(regex)
                break;
            case "City":
                filterFunction = (customer) => (customer["City"]).match(regex)
                break;
            case "State":
                filterFunction = (customer) => (customer["State"]).match(regex)
                break;
            case "Contact":
                filterFunction = (customer) => (customer["FirstName"] + " " + customer["LastName"]).match(regex)
                break;
            case "ZIP":
                filterFunction = (customer) => (customer["PostalCode"]).match(regex)
                break;
            default:
                filterFunction = (customer) => (customer["CompanyName"]).match(regex)
                break; 
        }

        // Dertermine rioght sort function 
        switch (sortField) {
            
            case "Name":
            sortFunction = (a,b) => (a.CompanyName.localeCompare(b.CompanyName))
                break;
            case "Name (Desc)":
            sortFunction = (a,b) => (b.CompanyName.localeCompare(a.CompanyName))
                break;
            case "City":
                sortFunction = (a,b) => (a.City.localeCompare(b.City))
                break;
            case "City (Desc)":
                sortFunction = (a,b) =>  (b.City.localeCompare(a.City))
                break;
            case "State":
                sortFunction = (a,b) => (a.State.localeCompare(b.State))
                break;
            case "State (Desc)":
                sortFunction = (a,b) => (b.State.localeCompare(a.State))
                break;
            case "Contact":
                sortFunction = (a,b) => (a.FirtstName.localeCompare(b.FirtstName))
                break;
            case "Contact (Desc)":
                sortFunction = (a,b) => (b.FirtstName.localeCompare(a.FirtstName))
                break;
            case "ZIP":
                sortFunction = (a,b) => (a.PostalCode.localeCompare(b.PostalCode))
                break;
            case "ZIP (Desc)":
                sortFunction = (a,b) => (b.PostalCode.localeCompare(a.PostalCode))
                break;
            default:
                sortFunction = (a,b) => (a.CompanyName.localeCompare(b.CompanyName))
                break;
        }        
    
        // set the list state by running filter and sort functions
        setCustomerListCompState(customerList.filter(filterFunction).sort(sortFunction))
    }

    const handleInvoiceListFilter = (text) => {
        // space forwradslahs
        text = text.replace(/\\/g, "\\\\");

        const regex = new RegExp(text,'gi')

        let filterFunction, sortFunction
        
        // Determine right filter function
        switch (filterField) {
            case "Name":
                filterFunction = (inv) => (inv.CustomerRef.FullName).match(regex)
                break;
            case "Invoice #":
                filterFunction = (inv) => (inv.RefNumber).match(regex)
                break;
            case "State":
                filterFunction = (inv) => (inv.State).match(regex)
                break;
            case "Date":
                filterFunction = (inv) => (standardDateFormatFromQb(inv.Date)).match(regex)
                break;
            case "Amount":
                filterFunction = (inv) => (inv.Subtotal).match(regex)
                break;
            default:
                break; 
        }

        // Dertermine rioght sort function 
        switch (sortField) {
            
            case "Name":
            sortFunction = (a,b) => (a.CompanyName.localeCompare(b.CompanyName))
                break;
            case "Name (Desc)":
            sortFunction = (a,b) => (b.CompanyName.localeCompare(a.CompanyName))
                break;
            case "City":
                sortFunction = (a,b) => (a.City.localeCompare(b.City))
                break;
            case "City (Desc)":
                sortFunction = (a,b) =>  (b.City.localeCompare(a.City))
                break;
            case "State":
                sortFunction = (a,b) => (a.State.localeCompare(b.State))
                break;
            case "State (Desc)":
                sortFunction = (a,b) => (b.State.localeCompare(a.State))
                break;
            case "Contact":
                sortFunction = (a,b) => (a.FirtstName.localeCompare(b.FirtstName))
                break;
            case "Contact (Desc)":
                sortFunction = (a,b) => (b.FirtstName.localeCompare(a.FirtstName))
                break;
            case "ZIP":
                sortFunction = (a,b) => (a.PostalCode.localeCompare(b.PostalCode))
                break;
            case "ZIP (Desc)":
                sortFunction = (a,b) => (b.PostalCode.localeCompare(a.PostalCode))
                break;
            default:
                sortFunction = (a,b) => (a.CompanyName.localeCompare(b.CompanyName))
                break;
        }        

        console.log(invoiceList)
    
        // set the list state by running filter and sort functions
        setInvoiceListCompState(invoiceList.filter(filterFunction))
    }

    const handleLoadMore = () => {
        dispatch(getInvoiceList(filterOptions,invoiceListCompState[invoiceListCompState.length - 1].TxnDate))
    }


    return (
        <div  className="page-padding large fade">
            <PageTitle title="List Lookup" subtitle="Select a type of list to display" btns={[]}/>
            <div className="input-section">
                <CustomInput 
                    title="Type of List" 
                    placeholder=""
                    elName="list-type"
                    type="select"
                    options={typesOfLists}
                    value={typeOfList}
                    onChange={e => setTypeOfList(e.target.value) }/>
            <div className="list-page-filter-sort-selectors">
                <CustomInput 
                    title="Filter by" 
                    placeholder=""
                    elName="list-field-filter"
                    type="select"
                    options={filterOptions}
                    value={filterField}
                    onChange={e => setFilterField(e.target.value) }
                    />

                    <div style={{width: '5%'}}></div>
                    
                <CustomInput 
                    title="Sort by" 
                    placeholder=""
                    elName="list-field-sort"
                    type="select"
                    options={sortOptions}
                    value={sortField}
                    onChange={e => setSortField(e.target.value) }
                    />
            </div>

            {!filterField == '' ? (
                <>
                <CustomInput 
                    title={`Search by ${filterField}`} 
                    placeholder="Enter a keyword"
                    elName="list-keyword"
                    type="text"
                    value={keyword}
                    maxLength={60}
                    onChange={e => setKeyword(e.target.value)}/>

                <button style={{float: 'right'}} onClick={handleListFilterSort}> Apply Filters / Sort</button>
                <br/>
                
                </>
            ) : (
                <></>
            )}
            </div>
            
            {loadingCustomerList ? <Loader/> : ( typeOfList === 'Customer List' && <TransactionTable data={customerListCompState} type="lists-customers"/>) }
            {loadingInvoiceList ? <Loader/> : ( typeOfList === 'Invoice List' ? 
                (
                <>
                    <p>Hello</p>
                    <TransactionTable data={invoiceListCompState} type="lists-invoices"/>
                    <br/>
                    <div className="info-section flex">
                        {disableShowMore ? (
                            <button className={disableShowMore ? 'disabled' : ''} style={{margin: 'auto'}} onClick={handleLoadMore}>
                            No more Invoices
                        </button>
                        ) : (
                            <button style={{margin: 'auto'}} onClick={handleLoadMore}>
                            Load more
                        </button>
                        )}
                                        
                    </div>
                </>
                ) : (
                    <></>
                )
            ) }

        </div>
    )
})

const formatDate  = (date) => {
    date = new Date(date)
   return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`

}

const typesOfLists = ['Customer List', 'Invoice List', 'Sales Order List']

const customerListFilterOptions = ['Name','City', 'State','Contact','ZIP']
const invoiceListFilterOptions = ['Invoice #','Name', 'State','Date','Amount']
const salesOrderListFilterOptions = ['Name','City', 'State','Contact','ZIP']


const customerListSortOptions = ['Name', 'Name (Desc)','City', 'City (Desc)', 'State' ,'State (Desc)','Contact', 'Contact (Desc)','ZIP', 'ZIP (Desc)']
const invoiceListSortOptions = ['Invoice #', "Invoice # (Desc)",'Name','Name (Desc)', 'State', 'State (Desc)','Date', 'Date (Desc)','Amount']


export default ListsPage

