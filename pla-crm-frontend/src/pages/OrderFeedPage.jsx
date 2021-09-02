import React, { useState , useEffect} from 'react'
import PageTitle from '../components/PageTitle'
import CustomInput from '../components/CustomInput'
import Loader from '../components/Loader'

import OrderItem from '../components/OrderItem'

import { useDispatch, useSelector} from 'react-redux'

import { dateSelectors, standardDateFormat } from '../utils/DateMethods'

import FeedCSVExporter from '../utils/FeedCSVExporter'

import {getOrders} from '../actions/orderActions'

const OrderFeedPage = ({ history }) => {
    const dispatch = useDispatch()

    const {userInfo} = useSelector( state => state.userLogin)
    const environmentVariables = useSelector(state => state.environmentVariables)
    const { loading, orders, error, disableShowMore } = useSelector(state => state.ordersFeed)
    const { lists } = environmentVariables

    // Component Level States
    const [typeOfDate, setTypeOfDate] = useState(Object.keys(dateSelectors)[0])
    const [datesToShow, setDatesToShow] = useState(dateSelectors['This Year'])


    // checking if there are states saved from sessionstorage
    useEffect(() => {
        const data = sessionStorage.getItem("orderFeedDates")
        if(data){
            setTypeOfDate(JSON.parse(data).typeOfDate)
            setDatesToShow({
                from : new Date(JSON.parse(data).datesToShow.from),
                to : new Date(JSON.parse(data).datesToShow.to)
            })
        }

        // if orders is empty 
        if(orders && orders.length < 1){
            // if there is data from the session storage then dispatch notes and use those dates
                if(data){
                dispatch(getOrders(dateSelectors[JSON.parse(data).typeOfDate]))
            // there no dates on session storage, use current state of the state element
                } else{
                dispatch(getOrders(dateSelectors[typeOfDate]))
                }
        }
}, [])

    // Saving the state to session storage
    useEffect(() => {
        sessionStorage.setItem("orderFeedDates", JSON.stringify({
            typeOfDate : typeOfDate,
            datesToShow: datesToShow,
        }))
    })

    // execute on the switch data type 
    const switchDateHandler = (val) => {
        setTypeOfDate(val)
        setDatesToShow(dateSelectors[val])
        dispatch(getOrders(dateSelectors[val]))
    }

    
    const handleExportCsvClick = () => {
        const exporter = new FeedCSVExporter(orders, csvHeaders ,'ordersfeed');
        const csvOutput = exporter.convertToCSV();
        const csvBlob = new Blob([csvOutput], { type: "text/csv" });
        const blobUrl = URL.createObjectURL(csvBlob);
        const anchorElement = document.createElement("a");

        anchorElement.href = blobUrl;
        anchorElement.download = "order-feed-export.csv";
        anchorElement.click();

        setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
        }, 500);
    }

    const handleLoadMore = () => {
        dispatch(getOrders(datesToShow, {},  orders[orders.length - 1].TimeStamp))
    }


    return (
        <div id='feed-order-page' className="page-padding large fade">
            <PageTitle title="Orders Feed" subtitle="Showing the latest Orders"/>
            <div className="input-section">
            <CustomInput 
                        title="Date Range" 
                        placeholder=""
                        elName="note-feed-date-selector"
                        type="select"
                        options={Object.keys(dateSelectors)}
                        value={typeOfDate}
                        onChange={e => switchDateHandler(e.target.value)}/>
            
            <p className="feed-result-text">
                {standardDateFormat(datesToShow.from)} - {standardDateFormat(datesToShow.to)}
            </p>
            </div>
            <div className="feed order-feed">
                {loading && !error ? (<Loader/>) : (
                    <>
                    {error ? (<p className="feed-result-text"> <i className="fas fa-exclamation-circle"></i> Error: please try again later </p>) : (
                        orders && orders.length > 0 ? (
                            <>
                            <div className="feed-result-title flex">
                                <p className="feed-result-text">Found {orders.length} orders</p>
                                <button onClick={handleExportCsvClick}> Export as CSV  <i className="fas fa-file-csv"></i> </button>
                            </div>
                            <br/>
                            {orders
                            .sort((a,b) => b.TimeStamp.toDate() - a.TimeStamp.toDate())
                            .map(order => <OrderItem order={order} key={order.id} />)}
    
                            <br/>
                            <div className="info-sectoion flex">
                            {disableShowMore ? (
                                        <button className={disableShowMore ? 'disabled' : ''} style={{margin: 'auto'}} onClick={handleLoadMore}>
                                        No more orders
                                    </button>
                                    ) : (
                                        <button style={{margin: 'auto'}} onClick={handleLoadMore}>
                                        Load more
                                    </button>
                                    )}
                            </div>
                            </>
                        ) : (
                            <p className="feed-result-text"> <i className="fas fa-exclamation-circle"></i> No orders were found for this time-period</p>
                        )
                    )}
                    </>
                )} 
            </div>

        </div>
    )
}

const csvHeaders = [
    'Order Id',
    'Customer',
    'Author',
    'Date',
    'PriceLevel',
    'Terms',
    'Facings',
    'Qty',
    'Amount',
    'New Customer?',
    'Order Instructions',
    'Order Form Type',
]



export default OrderFeedPage
