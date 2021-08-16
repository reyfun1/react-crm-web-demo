import React, { useState, useEffect }from 'react'
import PageTitle from '../components/PageTitle'
import Button from '../components/Button'

import { Link } from 'react-router-dom'
import { useDispatch, useSelector} from 'react-redux'
import { login, loginWithPersistance} from '../actions/userActions'
import { auth } from '../firebase'

import ModalContainer  from '../components/ModalContainer'


const LoginPage = ({ history, location}) => {

    // For the local state of fields 
    const [email, setEmail] = useState('test@test.com')
    const [password, setPassword] = useState('test123')

    // Modal method
    const [showAlert,setShowAlert] = useState(false)

    // declaring dispatch
    const dispatch = useDispatch()

    // Get the userInfo from the redux state  
    const userLogin = useSelector(state => state.userLogin)
    const {loading, error, userInfo } = userLogin

    // on error change 
    useEffect(() => {
        if(error){
            setShowAlert(true)
        }
    }, [error])

    // UseEffect functions when elements loads 
    // Check if the user is already signed in
    // if logged in redirect the user to home page 
    useEffect(() => {  
        // check if user is logged in already in firebase peristance
        auth.onAuthStateChanged( data => dispatch(loginWithPersistance()))

        if(userInfo) {
            console.log("User Logged in ")
            history.push("/")
        }
    },[history,userInfo,dispatch])

    // submit the state 

    // Handle when the user presses submit 
    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(login(email,password))
    }

    return (
        <div className="page-padding small fade">
        {showAlert && <ModalContainer modalType='alert' msg='Wrong Password / User does not exist' acceptMethod={() => setShowAlert(false)} />}

        <PageTitle title='Login' subtitle="Enter credentials" btns={[]} showCurrentDate={true}></PageTitle> 
        
        <i className="fas fa-user-circle big-logo"></i>

        <div className='page-container'>
            <form onSubmit={submitHandler}>
                <div className="input-section">
                    <div className='text-input-container'>
                        <label htmlFor='email'>Email Address</label> 
                        <input type='email' name='email' value={email}/> 
                    </div>
                    <div className='text-input-container'>
                        <label htmlFor='email'>Password</label> 
                        <input type='password' name='password' value={password}/> 
                    </div>
                </div>
                <Button typeBtn="Login"/> 
            </form>
        </div>

        
        </div>
    )
}

export default LoginPage
