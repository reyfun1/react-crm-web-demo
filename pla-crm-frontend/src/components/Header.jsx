import React, { useState, useRef, useEffect } from 'react'
import { useHistory } from "react-router-dom";
import AutoCompleteSection from './AutoCompleteSection';
import { useDispatch, useSelector } from 'react-redux'

import { getCustomerList } from '../actions/customerActions'
import { getEnvironmentVariables } from '../actions/environmentVariablesActions'

import { Link, useLocation} from 'react-router-dom'

const Header = () => {
    const dispatch = useDispatch()
    const [searchBoxStatus, setSearchBoxStatus] = useState(false)
    const [searchBoxText, setSearchBoxText] = useState('')

    const history = useHistory()
    const textInput = useRef(null)

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin;

    // Run Once when app Load
    useEffect(()=>{
        if(userInfo){
            // get the customer lists 
            dispatch(getCustomerList())
            dispatch(getEnvironmentVariables())

            // get the environment lists
            // item list
            // rep list
            // terms list
            // price level list 
            // aging report level list 
            
        }

    },[userInfo])


    const sideNav = useSelector(state => state.sideNav)
    const searchClickHandler = () => {
        if(!searchBoxStatus){
            setSearchBoxStatus(true)
            textInput.current.focus()
        } else{
            setSearchBoxStatus(false)
        }

    }

    const arrowClickHandler = () => {

        // go back in history
        history.goBack()
    }

    const barsClickHandler = () => {
        console.log('clicked bars')
        dispatch({type: "TOGGLE_SIDENAV"})
    }

    const resetSearchBar = () => {
        setSearchBoxText('')
        searchClickHandler()
    }

    const handleAutoCompleteClick = (customer) => {
        history.push(`/customerpage/${customer.ListID}`)
    }

    return (
        <nav>
            <div className="left-navbar" >
                {!searchBoxStatus && (
                    <>
                    {!sideNav && (<div className="sidenav-btn" onClick={barsClickHandler}>
                        <button >
                            <i className="fas fa-bars"></i>
                        </button>
                    </div>)}
                    <div className="back-btn" onClick={arrowClickHandler}>
                        <button>
                            <i className="fas fa-arrow-left"></i>
                        </button>
                    </div>
                    </>)
                }
            </div>
            <div className="search">
                <div className="searchbar-container">
                    <input 
                        id="main-search" 
                        ref={textInput} 
                        type="text" 
                        className={`input ${searchBoxStatus && 'active'}`} 
                        placeholder="Search..."
                        value={searchBoxText}
                        onChange={(e) => setSearchBoxText(e.target.value)}/>
                    {searchBoxStatus ? <AutoCompleteSection searchBoxText={searchBoxText} resetMainSearchBar={resetSearchBar} handleClick={handleAutoCompleteClick}/> : ''}     
                </div>
                <button className="btn" onClick={searchClickHandler}>
                        {!searchBoxStatus ? (
                            <i className='fas fa-search'></i>
                        ) : (
                            <i className='fas fa-times-circle active'></i>
                        )}
                </button>
                    
                
            </div>

        </nav>
    )
}

export default Header
