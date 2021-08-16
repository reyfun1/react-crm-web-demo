import React, {useRef, useEffect, useState} from 'react'

import {auth} from '../firebase'


const ReportsPage = () => {

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

    return (
        <div className="">
          {isAdmin || isOffice ? <iframe
            width="100%" 
            height="1500"
            src="https://datastudio.google.com/embed/reporting/e0a22b84-ced5-46d3-a1ea-69f197ba75be/page/NKw0B" 
            frameBorder="0" 
            style={{border: "0"}} 
            allowFullScreen></iframe> : <></>}
        </div>
    )
}

export default ReportsPage

function getCurrentUser(auth) {
    return new Promise((resolve, reject) => {
       const unsubscribe = auth.onAuthStateChanged(user => {
          unsubscribe();
          resolve(user);
       }, reject);
    });
  }
