import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import Loader from './Loader'

const AutoCompleteSection = ({searchBoxText, resetMainSearchBar, handleClick}) => {

    const list = useSelector(state => state.customerList)
    const { loading, customerList } = list

    const [filteredList, setFilteredList] = useState([])

    const filterlist = () => {
        const regex = new RegExp(searchBoxText,'gi')

        return customerList.filter(customer => ( 
            (customer.CompanyName && customer.CompanyName.match(regex)) || (customer.FirstName && customer.FirstName.match(regex)) ||  
            (customer.LastName && customer.LastName.match(regex)) || (customer.AccountNumber && customer.AccountNumber.match(regex))  // || (customer.AccountNumber.match(regex))
            )).slice(0,10)
    }

    useEffect(() => {
        if(customerList){
            setFilteredList(filterlist())
        }
    }, [searchBoxText,customerList])


    return (
        <div className={`autocomplete-section ${searchBoxText.length > 0 ? 'active' : ''}`}>
           {loading ? <Loader/> : ''}
           {filteredList.length > 0 ? (filteredList.map( customer => (

           <div className="autocomplete-result" key={customer.ListID} onClick={() => {handleClick(customer); resetMainSearchBar()}}>
               <div className="autocomplete-left">
                <p className="autocomplete-main-name">{customer.CompanyName && customer.CompanyName }</p>
                <p className="autocomplete-sub-name">{`${customer.FirstName && customer.FirstName} ${customer.LastName && customer.LastName}` }</p>
               </div>
               <div className="autocomplete-right">
                <p>{customer.City && customer.City}, {customer.State && customer.State}</p>
                <p>{customer.AccountNumber && customer.AccountNumber}</p>
               </div>
           </div>
           ))
                
           ) : (
               <p style={{'textAlign': 'center'}}>No results</p>
           )}
        </div>
    )
}

export default AutoCompleteSection
