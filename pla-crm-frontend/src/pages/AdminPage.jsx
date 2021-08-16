import React, {useEffect, useState} from 'react'

import { useDispatch, useSelector} from 'react-redux'
import Loader from '../components/Loader'

import Button from '../components/Button'
import ModalContainer from '../components/ModalContainer'

import PageTitle from '../components/PageTitle'

import CustomInput from '../components/CustomInput'
import TransactionTable from '../components/TransactionTable'

import OptionSelector from '../components/OptionSelector';
import { getUsersForAdmin, createNewUser } from '../actions/adminActions'

const AdminPage = () => {

    const dispatch = useDispatch()

    const { loading, users, error } = useSelector(state => state.adminUserList)
    const { loading: loadingCreateNewUser, user, error : errorCreateNewUser, success } = useSelector(state => state.adminCreateNewUser)

    const initialState = {
        showModal : false,
        showAlert : false,
        alertMsg: '',
        newEmail: '',
        firstname: '', 
        lastname: '',
        newPassword1: '',
        newPassword2: '',
        role: 'office',
        stateSelected : [],
        addUserActive : false,
        editUserActive : false,
        currentUserEditing: {},
        currentUserEditingForm: {
            firstname : '',
            lastname  : '',
            email: '',
            rep: 'office',
            stateSelected: []
        },
    }

    // Modal State
    const [showModal,setShowModal] = useState(initialState.showModal)
    const [showAlert,setShowAlert] = useState(initialState.showAlert)
    const [alertMsg, setAlertMsg] = useState(initialState.alertMsg)



    const [newEmail, setNewEmail] = useState(initialState.newEmail)
    const [firstname,setFirstName] = useState(initialState.firstname)
    const [lastname,setLastName] = useState(initialState.lastname)
    const [newPassword1, setNewPassword1] = useState(initialState.newPassword1)
    const [newPassword2, setNewPassword2] = useState(initialState.newPassword2)
    const [role, setRole] = useState(initialState.role)


    const [stateSelected, setStatesSelected] = useState(initialState.stateSelected)

    const [addUserActive, setAddUserActive] = useState(initialState.addUserActive)
    const [editUserActive, setEditUserActive] = useState(initialState.editUserActive)
    const [currentUserEditing, setCurrentUserEditing] = useState(initialState.currentUserEditing)
    const [currentUserEditingForm, setCurrentUserEditingForm] = useState(initialState.currentUserEditingForm)

    const addUserTableHandler = () => {
        setAddUserActive(!addUserActive)
    }


    // handlesubmitForm
    const handleSubmitForm = e => {

        e.preventDefault()

        let alertCompoundMsg = ''

        // check for the passwords matching 
        if(newPassword1 !== newPassword2) alertCompoundMsg += '*' + NOPASSWORDMATCH + '\n'

        // check for the password being at least 6 characters 
        if(newPassword1.length < 6 || newPassword2.length < 6) alertCompoundMsg +='*' + SHORTPASS + '\n'

        // check that if rep is selected that at east a state is selected
        if(role === 'rep' && stateSelected.length < 1) alertCompoundMsg += '*' +NOSTATEWITHREPMESSAGE + '\n'

        
        // check if there were errors
        if(alertCompoundMsg.length > 1) {
            setAlertMsg(alertCompoundMsg)
            setShowAlert(true)
            return
        }

        // Everything is good, open the modal
        setShowModal(true)
    } 

    // reset the text fields 
    const resetState = () => {
        setNewEmail(initialState.newEmail)
        setFirstName(initialState.firstname)
        setLastName(initialState.lastname)
        setNewPassword1(initialState.newPassword1)
        setNewPassword2(initialState.newPassword2)
        setRole(initialState.role)
        setStatesSelected(initialState.stateSelected)
    }



    // Handle the submission of a new user 
    const handleSubmit = e => {
        setShowModal(false)

        const user = {
            email: newEmail,
            firstname,
            lastname,
            password : newPassword1,
            role,
            restrictions : {
                states : role === 'rep' ? Object.keys(stateSelected).filter(o => stateSelected[o]).map(o => o ) : []
            }
        }

        dispatch(createNewUser(user))

    }

    const handleGoBack = () => {
        resetState()
        dispatch({
            type: 'ADMIN_USER_CREATE_RESET'
        })
    }


    useEffect(() => {
        window.scrollTo(0, 0)
        dispatch(getUsersForAdmin())
    }, [])

    const handleUserEditBtn = (e) => {
        return
        setEditUserActive(true)
        setCurrentUserEditing(e)
        setCurrentUserEditingForm({
            firstname : e.firstname
        })
    }

    const handleUserDeleteBtn = (e) => {
        console.log(e)
    }

    console.log(currentUserEditing)

    return (
        <div id="admin-page" className="page-padding extra-large fade">
            {showModal && <ModalContainer modalType='question' msg='Are you sure you want create his new user?' acceptMethod={handleSubmit} declineMethod={()=> setShowModal(false)} />}
            {showAlert && <ModalContainer modalType='alert' msg={alertMsg} acceptMethod={() => setShowAlert(false)} />}

            <PageTitle title="Admin Page" subtitle="Manage users and app features" btns={[]}/>
            <div className="admin-page-container">
                
                <TransactionTable 
                    data={users} 
                    type='admin-users-display' 
                    addBtnClick={addUserTableHandler} 
                    editUserClick={handleUserEditBtn}
                    deleteUserClick={handleUserDeleteBtn}
                    />

                <div id='admin-edit-create-user'>
                    {addUserActive ? (
                        <form id="create-user" className="input-section fade" onSubmit={handleSubmitForm}>
                            <div className="info-section">
                                <p className="section-title">
                                    Create a new user
                                </p>
                            </div>
                            <br/><br/>
                                <CustomInput 
                                    title="First Name" 
                                    placeholder="Enter User First Name"
                                    elName="new-user-fname"
                                    type="text"
                                    value={firstname}
                                    required={true}
                                    onChange={e => setFirstName(e.target.value)}
                                    maxLength={40}/>

                                <CustomInput 
                                    title="Last Name" 
                                    placeholder="Enter User Last Name"
                                    elName="new-user-lanme"
                                    type="text"
                                    value={lastname}
                                    required={true}
                                    onChange={e => setLastName(e.target.value)}
                                    maxLength={40}/>

                                <CustomInput 
                                    title="E-mail" 
                                    placeholder="Enter email address for new user"
                                    elName="new-user-email"
                                    type="email"
                                    value={newEmail}
                                    required={true}
                                    onChange={e => setNewEmail(e.target.value)}
                                    maxLength={60}/>
                                <CustomInput 
                                    title="Password" 
                                    placeholder="Enter password for new user"
                                    elName="new-user-pass-1"
                                    type="password"
                                    value={newPassword1}
                                    required={true}
                                    onChange={e => setNewPassword1(e.target.value)}/>
                                <CustomInput 
                                    title="Re-Type Password" 
                                    placeholder="Enter password for new user"
                                    elName="new-user-pass-2"
                                    type="password"
                                    value={newPassword2}
                                    required={true}
                                    onChange={e => setNewPassword2(e.target.value)}/>


                                <CustomInput 
                                    title="Role" 
                                    elName="new-user-role"
                                    type="select"
                                    options={ROLES}
                                    value={role}
                                    required={true}
                                    onChange={e => setRole(e.target.value)}/>
                                
                                {role === 'rep' && (
                                    <div className='fade' id="add-user-state-selector">
                                    <OptionSelector state={stateSelected} setState={setStatesSelected} dataArr={statesList} title='Please select the states to restrict to' />
                                </div>
                                )}
                                    
                                <br/>
                                <Button typeBtn='Submit' />
                                <br/><br/><br/><br/><br/>
                                {loadingCreateNewUser ? <Loader/> : (
                                    <>
                                        {errorCreateNewUser && <p>Error</p>}
                                        {success && (
                                            <div className="message-div">
                                            <i className="fas fa-check-circle"></i>
                                            <p>New user was created successfully</p> 
                                            <button style={{float:'right'}} onClick={handleGoBack}>Go Back</button>                                         
                                        </div>
                                        )}
                                    </>
                                )}

                        </form>
                    ) : (
                        <div></div>
                    )}

                     {/* flex divider */}
                     <div style={{width: '5%'}}></div>
                    {editUserActive ? (
                        <form className="input-section fade" onSubmit={handleSubmitForm}>
                            <div className="info-section">
                                <p className="section-title">
                                    Editing User: {currentUserEditing.firstname + ' ' + currentUserEditing.lastname}
                                </p>
                            </div>
                            <br/><br/>
                                <CustomInput 
                                    title="First Name" 
                                    placeholder="Enter User First Name"
                                    elName="new-user-fname"
                                    type="text"
                                    value={currentUserEditingForm.firstname}
                                    onChange={e => setCurrentUserEditingForm({currentUserEditingForm,...e.target.value})}
                                    maxLength={40}/>

                                <CustomInput 
                                    title="Last Name" 
                                    placeholder="Enter User Last Name"
                                    elName="new-user-lanme"
                                    type="text"
                                    value={lastname}
                                    onChange={e => setLastName(e.target.value)}
                                    maxLength={40}/>

                                <CustomInput 
                                    title="E-mail" 
                                    placeholder="Enter email address for new user"
                                    elName="new-user-email"
                                    type="email"
                                    value={newEmail}
                                    onChange={e => setNewEmail(e.target.value)}
                                    maxLength={60}/>
                                <CustomInput 
                                    title="Password" 
                                    placeholder="Enter password for new user"
                                    elName="new-user-pass-1"
                                    type="password"
                                    value={newPassword1}
                                    required={true}
                                    onChange={e => setNewPassword1(e.target.value)}/>
                                <CustomInput 
                                    title="Re-Type Password" 
                                    placeholder="Enter password for new user"
                                    elName="new-user-pass-2"
                                    type="password"
                                    value={newPassword2}
                                    required={true}
                                    onChange={e => setNewPassword2(e.target.value)}/>


                                <CustomInput 
                                    title="Role" 
                                    elName="new-user-role"
                                    type="select"
                                    options={ROLES}
                                    value={role}
                                    required={true}
                                    onChange={e => setRole(e.target.value)}/>
                                
                                {role === 'rep' && (
                                    <div className='fade' id="add-user-state-selector">
                                    <OptionSelector state={stateSelected} setState={setStatesSelected} dataArr={statesList} title='Please select the states to restrict to' />
                                </div>
                                )}
                                    
                                <br/>
                                <Button typeBtn='Submit' />
                                <br/><br/><br/><br/><br/>
                                {loadingCreateNewUser ? <Loader/> : (
                                    <>
                                        {errorCreateNewUser && <p>Error</p>}
                                        {success && (
                                            <div className="message-div">
                                            <i className="fas fa-check-circle"></i>
                                            <p>New user was created successfully</p> 
                                            <button style={{float:'right'}} onClick={handleGoBack}>Go Back</button>                                         
                                        </div>
                                        )}
                                    </>
                                )}

                        </form>
                    ) : (
                        <div></div>
                    )}

                </div>
                
                
            </div>
        </div>
    )
}

export default AdminPage

const ROLES = ['admin', 'office', 'rep']

const NOSTATEWITHREPMESSAGE = `You have selected role to be a rep, you need to select at least one state to restrict by, if this rep will not have any state restrctions then you should select the office role `

const NOPASSWORDMATCH = 'The passwords do not match'
const SHORTPASS = 'The password should be atleast 6 characters'
const statesList = [ 
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
    

function getCurrentUser(auth) {
    return new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            unsubscribe();
            resolve(user);
        }, reject);
    });
    }
    

