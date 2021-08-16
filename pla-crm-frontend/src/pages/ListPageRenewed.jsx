import React, { useState , useEffect} from 'react'
import PageTitle from '../components/PageTitle'
import CustomInput from '../components/CustomInput'
import Loader from '../components/Loader'

import { getInvoiceList } from '../actions/invoiceActions'

import { useDispatch, useSelector} from 'react-redux'

import TransactionTable from '../components/TransactionTable'


const ListPageRenewed = React.memo(({ history }) => {
    const dispatch = useDispatch()

    // Redux states 
    const environmentVariables = useSelector(state => state.environmentVariables)

    // Customer-List from Redux
    const customerListState = useSelector(state => state.customerList)
    const { loading: loadingCustomerList , customerList} = customerListState

    // Invoice-List from Redux
    const invoiceListState = useSelector(state => state.invoiceList)
    const { loading: loadingInvoiceList , invoiceList, disableShowMore} = invoiceListState

    // ui comoponent elevel states 
    const [showFilters, setShowFilters] = useState(false)

    // Filter form list states 
    const [typeOfList, setTypeOfList] = useState('Customer-List')
    const [keyword, setKeyword] = useState('')
    const [filterField, setFilterField] = useState('None')
    const [sortField, setSortField] = useState('Name')
    const [filterOptions, setFilterOptions] = useState(customerListFilterOptions)
    const [sortOptions, setSortOptions] = useState(customerListSortOptions)

    // List Component level state since ucstomer list is filtered, sorted offline
    const [customerListCompState, setCustomerListCompState] = useState(customerList)
    // const [invoiceListCompState, setInvoiceListCompState] = useState(invoiceList)
    // const [salesOrderListCompState, setSalesOrderListCompState] = useState(customerList)

    const [filterInfo, setFilterInfo] = useState({})
    const [sortInfo, setSortInfo] = useState({})

    // Once customer list laods, set it to the Component level stae 
    useEffect(() => {
        setCustomerListCompState(customerList)
    }, [customerList])

    // Persist the state of the selected list 
    // on load check if there are dates from session storage
    useEffect(() => (sessionStorage.getItem(`listPageStates-TypeOfList`) && setTypeOfList(sessionStorage.getItem(`listPageStates-TypeOfList`))), [])

    // Save the type of list everytime it changes
    useEffect(() => sessionStorage.setItem(`listPageStates-TypeOfList`, typeOfList) )

    // Check the type of list selected 
    useEffect(()=>{
        switch (typeOfList) {
            case 'Customer-List':
                setFilterOptions(customerListFilterOptions)
                setSortOptions(customerListSortOptions)
                if(filterField === 'Invoice #') setFilterField('None')
                break;
            case 'Invoice-List':
                setFilterOptions(invoiceListFilterOptions)
                setSortOptions(invoiceListSortOptions)
                if(invoiceList?.length < 1) dispatch(getInvoiceList({}))
                break;
            case 'Sales-Order-List':
                // do nothing
                break;
            default:
                break;
        }
        // dispatch to get the invoices,sales orders or custoemr list 
    },[typeOfList])


    // Check if there are states from session starage for the filters saved when changing the type of list 
    useEffect( () => {
        const data = JSON.parse(sessionStorage.getItem(`listPageStates-${typeOfList}`))
        if(data) {
            setFilterField(data[typeOfList].filterField)
            setSortField(data[typeOfList].sortField)
            setKeyword(data[typeOfList].keyword)
            handleApplyFiltersClick(data)
        }
        
    }, [typeOfList])

    const handleApplyFiltersClick = (datafromStorage) => {
        
        let newFilters = { [filterField] : keyword }
        let newSorts = { [sortField] : sortField }

        if(datafromStorage && datafromStorage[typeOfList]){
            newFilters = { [datafromStorage[typeOfList]['filterField']] : datafromStorage[typeOfList]['keyword']}
        }

        switch (typeOfList) {
            case 'Invoice-List':
                setFilterInfo(newFilters)
                setShowFilters(false) //if(invoiceList.length < 1)
                console.log(filterInfo, newFilters)
                if(!datafromStorage[typeOfList]) {
                    dispatch(getInvoiceList({...filterInfo,...newFilters}))
                }
                break;
            case 'Customer-List':
                setShowFilters(false)
                setCustomerListCompState(filterSortCustomerList(datafromStorage))
                break;
            default:
                break;
        }

        // Save State to Session Storage 
        sessionStorage.setItem(`listPageStates-${typeOfList}`, JSON.stringify({
            [typeOfList] : {
                typeOfList,
                filterField,
                keyword,
                sortField
            }
        }))

    }

    // Filter and sorting hapens locally since it was already loaded from before 
    const filterSortCustomerList = (dataFromStorage) => {
        const newlist = customerList

        let newFilterField, newSortField, newKeyword


        // differienteitae from mouse click
        if(dataFromStorage && Object.keys(dataFromStorage).length < 2){
            newFilterField = dataFromStorage[typeOfList].filterField
            newSortField = dataFromStorage[typeOfList].sortField
            newKeyword = dataFromStorage[typeOfList].keyword
        } else{
            newFilterField = filterField
            newSortField = sortField
            newKeyword = keyword
        }

        let modifiedlist = []

        // Apply Filters
        switch (newFilterField) {
            case 'None': modifiedlist =  customerList ; break
            case 'Name': modifiedlist =  newlist.filter(customer => customer.CompanyName === newKeyword) ; break
            case 'City': modifiedlist =  newlist.filter(customer => customer.City === newKeyword) ; break
            case 'State': modifiedlist =  newlist.filter(customer => customer.State === newKeyword) ; break
            case 'Contact': modifiedlist =  newlist.filter(customer => customer.FirstName === newKeyword || customer.LastName === newKeyword) ; break
            case 'ZIP': modifiedlist =  newlist.filter(customer => customer.PostalCode === newKeyword) ; break
            default: modifiedlist =  customerList ; break
        }

        //Apply Sorting
        switch (newSortField) {
            case "Name": modifiedlist.sort((a,b) => (a.CompanyName.localeCompare(b.CompanyName))) ;break
            case "Name (Desc)": modifiedlist.sort((a,b) => (b.CompanyName.localeCompare(a.CompanyName))) ; break
            case "City": modifiedlist.sort((a,b) => (a.City.localeCompare(b.City)));break;
            case "City (Desc)": modifiedlist.sort((a,b) =>  (b.City.localeCompare(a.City)));break;
            case "State": modifiedlist.sort((a,b) => (a.State.localeCompare(b.State)));break;
            case "State (Desc)": modifiedlist.sort((a,b) => (b.State.localeCompare(a.State)));break;
            case "Contact": modifiedlist.sort((a,b) => (a.FirtstName.localeCompare(b.FirtstName)));break;
            case "Contact (Desc)": modifiedlist.sort((a,b) => (b.FirtstName.localeCompare(a.FirtstName)));break;
            case "ZIP": modifiedlist.sort((a,b) => (a.PostalCode.localeCompare(b.PostalCode)));break;
            case "ZIP (Desc)": modifiedlist.sort((a,b) => (b.PostalCode.localeCompare(a.PostalCode)));break;
        }

        return modifiedlist
    }

    const handleClearFilter = () => { 
        setFilterInfo({})
        setShowFilters(false)
        
        if(typeOfList === 'Customer-List'){
            setFilterField('None')
            setKeyword('None')
            setSortField('None')
            handleApplyFiltersClick()
        }
        //dispatch(getNotes(datesToShow, {}))
    }

    const handleLoadMore = () => dispatch(getInvoiceList(filterOptions, invoiceList ? invoiceList[invoiceList.length - 1]?.TxnDate : invoiceList))
    


    return (
        <div id='feed-note-page' className="page page-padding large fade">
            <PageTitle title="Lists Page" subtitle={'Showing ' + typeOfList} btns={['Filter']} btnFunc={()=> setShowFilters(!showFilters)}/>
            <div className="input-section">
            <CustomInput 
                    title="Type of List" 
                    placeholder=""
                    elName="list-type"
                    type="select"
                    options={typesOfLists}
                    value={typeOfList}
                    onChange={e => setTypeOfList(e.target.value) }/>
                {showFilters && (
                <div className="filter-setter-container">
                    <div className="info-section">
                        <p className="section-title bold centered">
                            Filter {typeOfList}
                        </p>
                        <br/>
                        <div className="filter-fields flex">
                            <CustomInput 
                                title="Filter By" 
                                placeholder=""
                                elName="note-account-type"
                                type="select"
                                options={filterOptions}
                                value={filterField}
                                onChange={e => {setFilterField(e.target.value); setKeyword("")} } />

                                {/* flex divider */}
                                
                            <>
                            {filterField !== 'None' ? (
                                <>
                                <div style={{width: '5%'}}></div>
                                <CustomInput 
                                title={`${filterField} is : `} 
                                placeholder="Enter a keyword"
                                elName="list-keyword"
                                type="text"
                                value={keyword}
                                maxLength={60}
                                onChange={e => setKeyword(e.target.value)}/> 
                                </>
                            ) : (
                                <>
                                </>
                            )}
                            </> 
                            

                        </div>
                        <div className="filter-fields flex">
                        <CustomInput 
                                title="Sort By" 
                                placeholder=""
                                elName="note-account-class"
                                type="select"
                                options={sortOptions}
                                value={sortField}
                                onChange={e => setSortField(e.target.value)}/>
                        </div>

                        <div className="filter-fields flex">
                        <button style={{margin: 'auto'}} onClick={handleClearFilter}>Clear Filters</button>
                        <div style={{width: '5%'}}></div>
                        <button style={{margin: 'auto'}} onClick={handleApplyFiltersClick}>Apply Filters</button>
                        </div>
                    </div>

                    <div className="divider"></div>
                    
                </div>)}
                
            </div>
            <div className="feed notes-feed">
                   {typeOfList === 'Customer-List' && (loadingCustomerList ? <Loader/> : <TransactionTable data={customerListCompState} type="lists-customers"/>) }
                   {typeOfList === 'Invoice-List' && (loadingInvoiceList ? <Loader/> : 
                   (
                    <>
                        <TransactionTable data={invoiceList} type="lists-invoices"/>
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
                   )
                   )
                 }
            </div>

        </div>
    )
})


    const typesOfLists = ['Customer-List', 'Invoice-List']
    const customerListFilterOptions = ['None','Name','City', 'State','Contact','ZIP']
    const invoiceListFilterOptions = ['None','Invoice #','Name', 'State','Date']
    const salesOrderListFilterOptions = ['Name','City', 'State','Contact','ZIP']


    const customerListSortOptions = ['Name', 'Name (Desc)','City', 'City (Desc)', 'State' ,'State (Desc)','Contact', 'Contact (Desc)','ZIP', 'ZIP (Desc)']
    const invoiceListSortOptions = ['Invoice #', "Invoice # (Desc)",'Name','Name (Desc)', 'State', 'State (Desc)','Date', 'Date (Desc)']



export default ListPageRenewed
