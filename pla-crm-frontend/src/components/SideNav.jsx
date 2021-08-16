import React, { useRef,  useState, useEffect } from 'react'
import { Link, useLocation} from 'react-router-dom'
import {useSelector, useDispatch} from 'react-redux'

import Button from './Button'
import ModalContainer from './ModalContainer'

import { logout } from '../actions/userActions'
import { clearCustomerDetails, clearCustomerList} from '../actions/customerActions'

import {auth} from '../firebase'

const SideNav = () => {
    const location = useLocation()
    const dispatch = useDispatch()
    const sideNav = useSelector(state => state.sideNav)

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const closeBtn = useRef(null)

    const [isAdmin,setIsAdmin] = useState(false)
    const [isOffice,setIsOffice] = useState(false)

     // wait on the user load
     try {
          getCurrentUser(auth).then(user => {
               if(user){
                    user.getIdTokenResult().then( token => {
                         token?.claims?.admin ? setIsAdmin(true) : setIsAdmin(false)
                         token?.claims?.office ? setIsOffice(true) : setIsOffice(false)
                    })
               }
          })
     } catch (error) {
          console.log(error)
     }



    const handleLogOutClick = () => {
          // logout user
          dispatch(logout())
          // clear customer details state 
          dispatch(clearCustomerDetails())
          // clear customerlist
          dispatch(clearCustomerList())
    }

    const onNavLinkClick = () => {
          closeBtn.current.click()
    }
    
    return (
        <div className={`sidenav ${sideNav ? 'active' : ''}`}>
           <div className="sidenav-header">
               <button type="button" className="close-btn" ref={closeBtn} onClick={() => dispatch({type: "TOGGLE_SIDENAV"})}> 
                    {userInfo.photoURL ? (
                         <img src={userInfo.photoURL}></img>
                    ) : (
                         <i className="fas fa-times"></i>
                    )}
               </button>
                <i className="fas fa-user-circle big-logo"></i>
                <h3>{userInfo.displayName ? userInfo.displayName : 'User' }</h3>
                <p>{userInfo.email && userInfo.email }</p>
                <br/>
                <p>v2.7</p>
                <button onClick={()=> window.location.reload()} style={{transform: 'scale(0.7)', width: '100%'}}><i className="fas fa-redo"></i> Refresh</button>
           </div>
           <div className="sidenav-body-btns">
               <Link to="/" className={`sidenav-link ${location.pathname === '/home' || location.pathname === '/' && 'active'}`} onClick={onNavLinkClick}>
                    <i className="fas fa-home"></i>
                    <p>Home</p>
                    <i className="fas fa-chevron-right"></i>
               </Link>
               <Link to="/notefeed" className={`sidenav-link ${location.pathname === '/notefeed' && 'active'}` } onClick={onNavLinkClick}>
                    <i className="fas fa-clipboard-list"></i>
                    <p>View Notes</p>
                    <i className="fas fa-chevron-right"></i>
               </Link>
               <Link to="/orderfeed" className={`sidenav-link ${location.pathname === '/orderfeed' && 'active'}` } onClick={onNavLinkClick}>
                    <i className="fas fa-grip-vertical"></i>
                    <p>View Orders</p>
                    <i className="fas fa-chevron-right"></i>
               </Link>
               <Link to="/notecreate" className={`sidenav-link ${location.pathname === '/notecreate' && 'active'}` } onClick={onNavLinkClick}> 
                    <i className="fas fa-pen"></i>
                    <p>Add Note</p>
                    <i className="fas fa-chevron-right"></i>
               </Link>
               <Link to="/ordercreate" className={`sidenav-link ${location.pathname === '/ordercreate' && 'active'}`} onClick={onNavLinkClick}>
                    <i className="fas fa-file-invoice-dollar"></i>
                    <p>Add Order</p>
                    <i className="fas fa-chevron-right"></i>
               </Link>
               <Link to="/lists" className={`sidenav-link ${location.pathname === '/lists' && 'active'}` } onClick={onNavLinkClick}>
                    <i className="fas fa-list"></i>
                    <p>Lists</p>
                    <i className="fas fa-chevron-right"></i>
               </Link>
               { (isOffice || isAdmin ) && (
                    <Link to="/reportspage" className={`sidenav-link ${location.pathname === '/reportspage' && 'active'}` } onClick={onNavLinkClick}>
                    <i className="fas fa-chart-line"></i>
                    <p>Reports</p>
                    <i className="fas fa-chevron-right"></i>
               </Link>
               )}
               <Link to="/login" className={`sidenav-link ${location.pathname === '/logout' && 'active'}` } onClick={()=> {handleLogOutClick(); onNavLinkClick()}}>
                    <i className="fas fa-sign-out-alt"></i>
                    <p>Logout</p>
                    <i className="fas fa-chevron-right"></i>
               </Link>
               {isAdmin && (
                    <Link to="/admin" className={`sidenav-link ${location.pathname === '/admin' && 'active'}` } onClick={onNavLinkClick}>
                    <i className="fas fa-user-shield"></i>
                    <p>Admin</p>
                    <i className="fas fa-chevron-right"></i>
               </Link>
               )}
           </div>
           <div className="sidenav-footer-btns">

           </div>
        </div>
    )
}


export default SideNav



function getCurrentUser(auth) {
     return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged(user => {
           unsubscribe();
           resolve(user);
        }, reject);
     });
   }
 