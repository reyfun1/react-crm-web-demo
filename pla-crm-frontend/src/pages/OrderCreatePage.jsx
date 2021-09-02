import React, {useState, useEffect} from 'react'

import PageTitle from '../components/PageTitle'
import TabsSection from '../components/TabSection'
import RadioSelector from '../components/RadioSelector'
import CustomInput from '../components/CustomInput'
import AutoCompleteSection from '../components/AutoCompleteSection'
import TableForm from '../components/TableForm'
import Button from '../components/Button'
import Loader from '../components/Loader'
import ModalContainer  from '../components/ModalContainer'

import accounting from 'accounting-js'

import { getCustomerData } from '../actions/customerActions'
import { createOrder} from '../actions/orderActions'

import { useDispatch, useSelector} from 'react-redux'

const OrderCreatePage = ({history}) => {
    const dispatch = useDispatch()

    // Modal method
    const [showModal,setShowModal] = useState(false)
    const [showAlert,setShowAlert] = useState(false)
    const [alertMsg, setAlertMsg] = useState('')

    // Order Form List and Customer List  
    const lists = useSelector(state => state.environmentVariables.lists)
    const { customerList} = useSelector(state => state.customerList)

    // User Information
    const {userInfo} = useSelector( state => state.userLogin)

    // Customer Info 
    const customerData = useSelector(state => state.customerDetails)
    const { loading: loadingCustomerData, customerInfo } = customerData;
    
    // order forms object to be populated later
    let orderForms, itemList, termsList

    // if lists has not loaded yet, then set order form to null, else set it to list
    if(!lists){
        orderForms = null
        itemList = null
        termsList = null
    } else{
        orderForms = lists.orderForms
        itemList = lists.itemList
        termsList = Object.keys(lists.termList).map(term => lists.termList[term].Name)
    }


    // check if list exists and get the keys of the json doc
    const orderFormTypesOptions = lists &&  Object.keys(orderForms)

    // state for the tabs
    const [activeTab,setActiveTab] = useState(0)
    
    // state for the radio selector
    const [orderFormType, setOrderFormType] = useState('standard')
    const [selectedCustomerObj, setselectedCustomerObj ] = useState({})

    // Customer name
    const [customerType, setCustomerType] = useState('currentcustomer')
    const [customerName, setCustomerName] = useState('')

    // Shipping Information
    const [streetAddress, setStreetAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('-')
    const [zipcode, setZipCode] = useState('')

    // Contact Information
    const [firstname, setFirstName] = useState('')
    const [lastname, setLastName] = useState('')
    const [phone, setPhone] = useState('')
    const [email, setEmail] = useState('')

    // Payment Information (NEW CUSTOMERR)
    const [paymentTerm, setPaymentTerm] = useState('Credit Card')
    const [priceLevel, setPriceLevel] = useState('')

    // Payment Information (CURRENT CUSTOMERR)
    const [currentPaymentTerm, setCurrentPaymentTerm] = useState(customerInfo.TermsRef ? customerInfo.TermsRef.FullName : '-')
    const [currentPriceLevel, setCurrentPriceLevel] = useState(customerInfo ? customerInfo.PriceLevelRef ? customerInfo.PriceLevelRef.FullName.split('%')[0]: 0 : 0)

    // Form Calculations
    const [formProducts, setFormProducts] = useState({})
    const [orderTotals, setOrderTotals] = useState({amount: 0, qty: 0, facings: 0})

    // Order instructions / REP Code
    const [orderInstructions, setOrderInstructions] = useState('')
    const [repCode, setRepCode] = useState('RF')

    const calculateTotals = () => {
        let amount = 0, qty = 0, facings = 0

        for( let item in formProducts){
            amount += (formProducts[item]['price'] * formProducts[item]['qty'])
            qty += formProducts[item]['qty']
            facings = formProducts[item]['qty'] > 0 ? facings + 1: facings
        }
        setOrderTotals({amount,qty,facings})
    }

    // Grab the customer from history (client clicked from customer page )
    const setCustomerFromHistory = () => {
        const customerIdFromHistory = history.location.search.split('=')[1]
        const selectedCustomer = customerList.filter(customer => customer.ListID === customerIdFromHistory )[0]
        autoCompleteClick(selectedCustomer)
    }

    const formFieldsInputHandler = (product) => {
        setFormProducts({...formProducts,[product.productListID] : product})
    }

    // set the selected customer object (client cliked on autocomplete result)
    const autoCompleteClick = customer => {
        dispatch(getCustomerData(customer.ListID))
        setselectedCustomerObj(customer)
    }

    // handle the changing of customer types
    const handleCustomerTypeChange = (e) => {
        setCustomerType(e)
        if(e === 'newcustomer'){
            setselectedCustomerObj({})
        }
    }

    // change the pricing on the itemlist to reflect the new discount
    const handlePriceLevelChange = (newPriceDiscount) => {
        setCurrentPriceLevel(newPriceDiscount)
        setPriceLevel(newPriceDiscount)
        // mix and match the formProduct with the inventory and update form prodcuts with new pricing
        let products = {}
        Object.keys(formProducts).forEach(productID => {
            const salesPriceFromInvetory = itemList.inventoryItems[productID].SalesPrice
            products[productID] = {...formProducts[productID], price: salesPriceFromInvetory - ( salesPriceFromInvetory * (newPriceDiscount/100) ) }
        })
        setFormProducts(products)
    }

    // Change the payment terms and the price level depending on the customer 
    useEffect(() => {
        setCurrentPaymentTerm(customerInfo ? customerInfo.TermsRef && customerInfo.TermsRef.FullName : '-')
        handlePriceLevelChange(customerInfo ? customerInfo.PriceLevelRef ? customerInfo.PriceLevelRef.FullName.split('%')[0]: 0 : 0 )
    }, [customerInfo])


    // Call on the calcualte otals methods everytime there is change in the formProducts
    useEffect(() => {
        calculateTotals()
    }, [formProducts])


    // use history to set customer obj 
    useEffect(() => {
        if(history.location.search !== ''){
            setCustomerFromHistory()
        }
    }, [history.location.search])

    const clearTextBoxes = () => {
        
    }

    // check the fields for empty
    const submitHandler = () => {

        let alertCompoundMsg = '' 

        // Customer is current
            // selectedCustomerObj has keys
            // products kas keys
        if(customerType === 'currentcustomer'){
            if(Object.keys(selectedCustomerObj).length < 1) alertCompoundMsg += 'Missing / Customer not selected \n'
            if(repCode === '-') alertCompoundMsg += 'Please select a REP Code \n'
            if(Object.keys(formProducts).filter(productID => formProducts[productID]['qty'] > 0 ).length < 1) alertCompoundMsg += 'Missing: Products, there are no products selected \n'
        // Customer is new 
        } else {
            if(customerName.length < 1) alertCompoundMsg += 'Missing : Customer Name\n'
            if(streetAddress.length < 1) alertCompoundMsg += 'Missing : Street Address\n'
            if(city.length < 1) alertCompoundMsg += 'Missing : City\n'
            if(state === '-') alertCompoundMsg += 'Missing : State\n'
            if(zipcode.length < 1) alertCompoundMsg += 'Missing : ZipCode\n'
            if(firstname.length < 1) alertCompoundMsg += 'Missing : Contact First Name\n'
            if(lastname.length < 1) alertCompoundMsg += 'Missing : Contact Last Name\n'
            if(phone.length < 1) alertCompoundMsg += 'Missing : Contact Phone\n'
            if(email.length < 1) alertCompoundMsg += 'Missing : Contact Email\n'
            if(Object.keys(formProducts).filter(productID => formProducts[productID]['qty'] > 0 ).length < 1) alertCompoundMsg += 'Missing: Products, there are no products selected \n'
            if(repCode === '-') alertCompoundMsg += 'Please select a REP Code \n'
            if(alertCompoundMsg.split("\n").length > 7) alertCompoundMsg += '\n\n Please make sure you are trying to submit a new customer, if not, switch to "Current Customer" in the Customer tab \n'
            
        }
        // if there is a problem, show the alert
        if(alertCompoundMsg.length > 0) {
            setAlertMsg(alertCompoundMsg)
            setShowAlert(true)
        // there are no problems, show the question modal
        } else{
            setShowModal(true)
        }
        
    }

    const submitOrder = () => {
        // convert formProducts to only show qty > 0
        let newProductsForm = {}

        Object.keys(formProducts).filter(productID => formProducts[productID]['qty'] > 0 ).forEach(productID => {
            newProductsForm[productID] = formProducts[productID]
        })

        const order = {
            CustomerRef: selectedCustomerObj,
            NewCustomer: customerType === 'currentcustomer' ? false : true,
            NewCustomerRef : customerType === 'currentcustomer' ? {} : {
                ShipAddress: {
                    Addr1: customerName,
                    Addr2: streetAddress,
                    City: city,
                    DefaultShipTo: true,
                    Name: 'Ship to 1',
                    PostalCode: zipcode,
                    State: state
                },
                ContactInfo: {
                    CompanyName: customerName,
                    Email: email,
                    Phone: phone,
                    FirstName: firstname,
                    LastName: lastname
                }
            },
            
            OrderFormType: orderFormType,
            Products: newProductsForm,
            AuthorRef: {
                uid: userInfo.uid,
                displayName: userInfo.displayName,
                email: userInfo.email,
                photoURL: userInfo.photoURL,
            },
            PriceLevel : customerType === 'currentcustomer' ? currentPriceLevel : priceLevel,
            Terms : (customerType === 'currentcustomer' ? currentPaymentTerm : paymentTerm) ? customerType === 'currentcustomer' ? currentPaymentTerm : paymentTerm : '',
            OrderTotals : orderTotals,
            TimeStamp: new Date(),                                                                                                                                                                                                                                                                                                                                                                              
            OrderInstructions: orderInstructions,
            OrderStatus : 'OrderSubmitted',
            RepCode: repCode
        }
        // Hide the modal,  Dispatch the order method, and push history to order submission page
        setShowModal(false)
        dispatch(createOrder(order))
        history.push('/submitorder')  
    }

    return (
        <div className="page-padding large fade" id="order-create-page">
            {showModal && <ModalContainer modalType='question' msg='Are you sure you want to submit this order?' acceptMethod={submitOrder} declineMethod={()=> setShowModal(false)} />}
            {showAlert && <ModalContainer modalType='alert' msg={alertMsg} acceptMethod={() => setShowAlert(false)} />}
        <PageTitle title="Order Page" subtitle="Add a new Order" btns={['Clear']} btnFunc={clearTextBoxes}/>
        <form onSubmit={(e) => e.preventDefault()}>
            <TabsSection footerbtns activeTab={activeTab} setActiveTab={setActiveTab}>
                <div name="tab-buttons">
                    <button type="button">Customer</button>
                    <button type="button">Products</button>
                    <button type="button">Summary</button>
                </div>
                <div name="tab-pages">
                    <div>
                        <div className="input-section">
                            <RadioSelector 
                            name="NewOrCurrentCustomer" 
                            selectedValue="currentcustomer"
                            options={radioOptions} 
                            handleChange={e => handleCustomerTypeChange(e)}/>
                            <br/><br/>
                            {customerType === 'currentcustomer' ? (
                                <>
                                <CustomInput 
                                    title={Object.keys(selectedCustomerObj).length === 0 ? 'Select a Customer' : 'Customer Selected'}
                                    placeholder="Enter the name of the customer"
                                    elName="customer-name"
                                    type={Object.keys(selectedCustomerObj).length === 0 ? 'text' : 'text-selected'}
                                    value={Object.keys(selectedCustomerObj).length === 0 ? customerName : selectedCustomerObj.CompanyName}
                                    required={true}
                                    maxLength={60}
                                    onChange={e => { setCustomerName(e.target.value); setselectedCustomerObj({})}}/>

                                    {customerName.length > 0 
                                        ?  <AutoCompleteSection
                                            searchBoxText={customerName} 
                                            resetMainSearchBar={() => setCustomerName('')} 
                                            handleClick={customerResult => autoCompleteClick(customerResult)}/> 
                                        : ''}
                                    {Object.keys(selectedCustomerObj).length > 0 ? (
                                        <>
                                        {/* Account Terms ajnd Pricing Specs */}

                                        <div className="flex-items-container" id="selected-customer-payment-info">
                                            <CustomInput 
                                                title="Terms" 
                                                elName="new-customer-terms"
                                                type="select"
                                                options={termsList}
                                                value={currentPaymentTerm}
                                                required={true}
                                                onChange={e => setCurrentPaymentTerm(e.target.value)}/>

                                            <CustomInput 
                                                title="PriceLevel" 
                                                placeholder="Discount % Off"
                                                elName="new-customer-price-level"
                                                type="number"
                                                value={currentPriceLevel}
                                                onChange={e => handlePriceLevelChange(e.target.value)}/>
                                        </div>

                                        {/* If terms or price-level is changed */}
                                        
                                        {loadingCustomerData ? (<p>Loading...</p>) : (
                                            <>
                                            {customerInfo ? (
                                                <>{
                                                customerInfo.TermsRef && customerInfo.TermsRef.FullName !== currentPaymentTerm ? (
                                                    <p> &nbsp;&nbsp; <i className="fas fa-exclamation-circle"></i> You are changing the payment terms for this order only</p> 
                                                ) : (
                                                    <></>
                                                )}
                                                
                                                {
                                                customerInfo.PriceLevelRef && customerInfo.PriceLevelRef.FullName.split('%')[0] !== currentPriceLevel ? (
                                                    <p> &nbsp;&nbsp; <i className="fas fa-exclamation-circle"></i> You are changing the discount rate for this order only</p> 
                                                ) : (
                                                    <></>
                                                )}
                                                <br/><br/>
                                                </>  
                                            ) : ('')}
                                            </>
                                        )}
                                        
                                        {/* Account Info Summary */}
                                        <div className="info-section" id="order-form-account-information">
                                            {loadingCustomerData ? (<Loader/>) : (
                                                <>
                                                <p className="section-title">Account Information</p>
                                                <div className="section-content flex">
                                                    <div className="info-key-value">
                                                    <p>Current Balance</p>
                                                    <p>{customerInfo && accounting.formatMoney(customerInfo.Balance)}</p>
                                                    </div>
                                                    <div className="info-key-value">
                                                        <p>Account Created</p>
                                                        <p>{customerInfo && new Date(customerInfo.TimeCreated).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="info-key-value">
                                                        <div>
                                                            <p>Main Contact</p>
                                                            <p>{ customerInfo && customerInfo.FirstName} {customerInfo && customerInfo.LastName}</p>
                                                        </div>
                                                    </div>
                                                    <div className="info-key-value with-logo">
                                                        <i className="fas fa-phone-square-alt"></i>
                                                        <div>   
                                                            <p>Main Phone</p>
                                                            <p>{customerInfo && customerInfo.Phone}</p>
                                                        </div>
                                                    </div>
                                                    <div className="info-key-value with-logo">
                                                        <i className="fas fa-envelope-square"></i>
                                                        <div>
                                                                <p>Main Email</p>
                                                                <p>{customerInfo && customerInfo.Email}</p>
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
                                                </>
                                            )}
                                        </div>
                                        <br/><br/>
                                        </>)
                                    : (<p><i className="fas fa-exclamation-circle"></i> No Customer Selected</p> ) }
                                </>
                            ) : (
                                <>
                                <br/>
                                 <div className="info-section">
                                    <p className="section-title bold centered">
                                        Company Name
                                    </p>
                                </div>
                                <br/><br/>

                                <CustomInput 
                                    title="New Customer Name" 
                                    placeholder="Enter the name of the customer"
                                    elName="new-customer-name"
                                    type="text"
                                    value={customerName}
                                    required={true}
                                    maxLength={60}
                                    onChange={e => setCustomerName(e.target.value)}/>
                                    <br/><br/>

                                <div className="info-section">
                                    <p className="section-title bold centered">
                                        Shipping Information
                                    </p>
                                </div>
                                <br/><br/>

                                <CustomInput 
                                    title="Street Address" 
                                    placeholder="Enter street address"
                                    elName="new-customer-streetaddress"
                                    type="text"
                                    value={streetAddress}
                                    required={true}
                                    maxLength={160}
                                    onChange={e => setStreetAddress(e.target.value)}/>

                                <CustomInput 
                                    title="City" 
                                    placeholder="Enter City"
                                    elName="new-customer-city"
                                    type="text"
                                    value={city}
                                    required={true}
                                    maxLength={60}
                                    onChange={e => setCity(e.target.value)}/>

                                <CustomInput 
                                    title="State" 
                                    placeholder="Enter State"
                                    elName="new-customer-state"
                                    type="select"
                                    value={state}
                                    required={true}
                                    options={statesList}
                                    onChange={e => setState(e.target.value)}/>

                                <CustomInput 
                                    title="Zip Code" 
                                    placeholder="Enter Zip Code"
                                    elName="new-customer-zip"
                                    type="text"
                                    value={zipcode}
                                    required={true}
                                    maxLength={5}
                                    onChange={e => setZipCode(e.target.value)}/>

                                <div className="info-section">
                                    <p className="section-title bold centered">
                                        Contact Information
                                    </p>
                                </div>
                                <br/><br/>

                                <CustomInput 
                                    title="First Name" 
                                    placeholder="Enter Contact First Name"
                                    elName="new-customer-fname"
                                    type="text"
                                    value={firstname}
                                    required={true}
                                    maxLength={60}
                                    onChange={e => setFirstName(e.target.value)}/>

                                <CustomInput 
                                    title="Last Name" 
                                    placeholder="Enter Contact Last Name"
                                    elName="new-customer-lanme"
                                    type="text"
                                    value={lastname}
                                    required={true}
                                    maxLength={60}
                                    onChange={e => setLastName(e.target.value)}/>

                                <CustomInput 
                                    title="Phone #" 
                                    placeholder="Enter Contact Phone"
                                    elName="new-customer-phone"
                                    type="text"
                                    value={phone}
                                    required={true}
                                    maxLength={20}
                                    onChange={e => setPhone(e.target.value)}/>

                                <CustomInput 
                                    title="Email Address" 
                                    placeholder="Enter Contact Email Address"
                                    elName="new-customer-email"
                                    type="email"
                                    value={email}
                                    required={true}
                                    maxLength={60}
                                    onChange={e => setEmail(e.target.value)}/>

                                <div className="info-section">
                                    <p className="section-title bold centered">
                                        Payment Terms
                                    </p>
                                </div>
                                <br/><br/> 

                                <CustomInput 
                                    title="Terms" 
                                    elName="new-customer-terms"
                                    type="select"
                                    options={termsList}
                                    value={paymentTerm}
                                    required={true}
                                    onChange={e => setPaymentTerm(e.target.value)}/>

                                <CustomInput 
                                    title="Price-Level" 
                                    placeholder="Discount % Off"
                                    elName="new-customer-price-level"
                                    type="number"
                                    value={priceLevel}
                                    onChange={e => handlePriceLevelChange(e.target.value)}/>
                                
                                </>
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="input-section">
                        <CustomInput 
                            title="Type of Order Form" 
                            placeholder=""
                            elName="order-form-type"
                            type="select"
                            options={orderFormTypesOptions}
                            value={orderFormType}
                            onChange={e => setOrderFormType(e.target.value)}/>
                        </div>
                        <TableForm 
                            id='orderForm'
                            type='orderForm' 
                            form={orderForms && orderForms.standard} 
                            list={itemList} 
                            onInput={formFieldsInputHandler} 
                            pricingLevel={customerType === 'currentcustomer' ? currentPriceLevel : priceLevel}/>
                        <br/> 
                        <br/> 
                        <div className="info-section" id="order-form-totals">
                            <p className="section-title">Order Totals</p>
                            <div className="section-content">
                                <div className="info-key-value ">
                                    <div>
                                            <p>Total Amount</p>
                                            <p>{accounting.formatMoney(orderTotals.amount)}</p>
                                    </div>
                                </div>
                                <div className="info-key-value ">
                                    <div>
                                            <p>Qty</p>
                                            <p>{orderTotals.qty}</p>
                                    </div>
                                </div>
                                <div className="info-key-value ">
                                    <div>
                                            <p>Facings</p>
                                            <p>{orderTotals.facings}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div>
                        <br/>
                        <div className="info-section">
                            <p className="section-title bold centered">
                                Order Summary
                            </p>
                        </div>
                        <br/>

                        {/* Account Info Summary */}
                        {/* Object.keys(selectedCustomerObj).length > 0 */}
                        {customerType === 'currentcustomer'  ? (
                            <>
                            <div className="info-section" id="order-form-account-information-summary">
                            <p className="section-title">Account Information Summary</p>
                            <div className="section-content">
                                    <div className="info-key-value ">
                                        <div>
                                                <p>Company Name</p>
                                                <p>{Object.keys(selectedCustomerObj).length > 0 ? selectedCustomerObj.CompanyName : '-'}</p>
                                        </div>
                                    </div>
                                    <div className="info-key-value ">
                                        <div>
                                                <p>City, State</p>
                                                <p>{Object.keys(selectedCustomerObj).length > 0 ? <>{selectedCustomerObj.City + ", "} {selectedCustomerObj.State} </>: '-' }</p>
                                        </div>
                                    </div>
                                    <div className="info-key-value ">
                                        <div>
                                                <p>Acc#</p>
                                                <p>{Object.keys(selectedCustomerObj).length > 0 ? selectedCustomerObj.AccountNumber : '-'}</p>
                                        </div>
                                    </div>
                                    <div className="info-key-value ">
                                        <div>
                                                <p>ListID#</p>
                                                <p>{Object.keys(selectedCustomerObj).length > 0 ? selectedCustomerObj.ListID : '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </>
                        ) : (
                            <>
                            <div className="info-section">
                            <p className="section-title">New Account/Customer Information</p>
                            <div className="section-content flex">
                                    <div className="info-key-value ">
                                        <div>
                                                <p>Company Name</p>
                                                <p>{customerName.length > 0 ? customerName : '-'}</p>
                                        </div>
                                    </div>
                                    <div className="info-key-value ">
                                        <div>
                                                <p>Contact Name</p>
                                                <p>{firstname.length > 0 ? firstname + " " + lastname : "-" }</p>
                                        </div>
                                    </div>
                                    <div className="info-key-value ">
                                        <div>
                                                <p>Contact Information</p>
                                                <p>
                                                {phone.length > 0 ? <>Phone: {phone} <br/> </> : <>-<br/></>}
                                                {email.length > 0 ? <>Email: {email} <br/> </> : <>-</>}
                                                </p>
                                        </div>
                                    </div>
                                    <div className="info-key-value ">
                                        <div>
                                                <p>Shipping Address</p>
                                                <p>
                                                {streetAddress.length > 0 ? streetAddress : "-"}<br/>
                                                {city.length > 0 ? <>{city}, {state} {zipcode}</> : <>-</>}
                                                </p>
                                        </div>
                                    </div>
                                    <div className="info-key-value ">
                                        <div>
                                                <p>Pricing and Terms </p>
                                                <p>Pricing: {priceLevel} <br/> Terms: {paymentTerm}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </>
                        )}
                        <br/><br/>
                        
                        {/* Order Totals Summary */}
                        <div className="info-section" id="order-form-totals">
                            <p className="section-title">Order Totals</p>
                            <div className="section-content">
                                <div className="info-key-value ">
                                    <div>
                                            <p>Total Amount</p>
                                            <p>{accounting.formatMoney(orderTotals.amount)}</p>
                                    </div>
                                </div>
                                <div className="info-key-value ">
                                    <div>
                                            <p>Qty</p>
                                            <p>{orderTotals.qty}</p>
                                    </div>
                                </div>
                                <div className="info-key-value ">
                                    <div>
                                            <p>Facings</p>
                                            <p>{orderTotals.facings}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        

                        <br/><br/>

                        <div className="info-section">
                            <p className="section-title">
                                Products Summary
                            </p>
                        </div>

                        <table id="order-page-summary-products">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Qty</th>
                                </tr>
                            </thead>

                            {!Object.keys(formProducts).length > 0  ? (
                            <>
                            </>)
                             : (
                                <tbody>
                                    {Object.keys(formProducts).filter(listID => formProducts[listID].qty > 0 ).map( (listID, index, arr) => {
                                        //separate sections in the order form 
                                        let isDiffFromPrev = false
                                        if(index > 0 && formProducts[arr[index - 1]].productCode.substring(0,4) !== formProducts[listID].productCode.substring(0,4)){
                                            isDiffFromPrev = true
                                        }
                                        return (
                                            <tr key={listID} className={isDiffFromPrev ? "with-spacer-small" : ""}>
                                                <td>{formProducts[listID].name}</td>
                                                <td>{accounting.formatMoney(formProducts[listID].price)}</td>
                                                <td>{formProducts[listID].qty}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            )}


                        </table>
                        <br/><br/>
                        <div className="input-section">
                            <CustomInput 
                                title="Order Instructions" 
                                placeholder="Enter notes for this order"
                                elName='order-instructions'
                                type="text"
                                value={orderInstructions}
                                maxLength={240}
                                onChange={e => setOrderInstructions(e.target.value)}/> 
                            <br/><br/> 
                                
                            {/* TO BYPASS UNFOCUSABLE ELEMENT ERROR */}
                            <button type='submit' hidden ></button>
                            
                            <Button typeBtn='SubmitEscapeForm' onClick={submitHandler}/>

                        </div>

                    </div>
                </div>
            </TabsSection>
        </form>
        </div>
    )
}

export default OrderCreatePage

const radioOptions = [
    {title: 'Current Customer', value: 'currentcustomer'},
    {title: 'New Customer', value : 'newcustomer'},
]


const statesList = [ 
"-", 
"AK",
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
