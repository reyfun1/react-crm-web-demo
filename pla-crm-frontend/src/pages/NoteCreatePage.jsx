import React, { useState , useEffect } from 'react'
import PageTitle from '../components/PageTitle'
import CustomInput from '../components/CustomInput'
import Button from '../components/Button'
import AutoCompleteSection from '../components/AutoCompleteSection'
import RadioSelector from '../components/RadioSelector'
import ModalContainer  from '../components/ModalContainer'

import { useDispatch, useSelector} from 'react-redux'

import { createNote } from '../actions/noteActions'

const NoteCreatePage = ({ history }) => {
    const dispatch = useDispatch()
    
    // Modal State
    const [showModal,setShowModal] = useState(false)
    const [showAlert,setShowAlert] = useState(false)
    

    // getting outside resources
    const {customerList} = useSelector(state => state.customerList)
    const {userInfo} = useSelector( state => state.userLogin)
    const environmentVariables = useSelector(state => state.environmentVariables)
    const { lists } = environmentVariables


    // ppulating the note type section 
    let typeOfNotes = []

    if(environmentVariables.hasOwnProperty('lists')){
        if(lists.hasOwnProperty('noteTypes')){
            typeOfNotes = Object.keys(lists.noteTypes).map(key => lists.noteTypes[key].displayName)
        } else{
            console.log("cannot display note types")
        }
    }

    // component level state for the form 
    const [selectedCustomerObj, setselectedCustomerObj ] = useState({})
    const [noteClass, setNoteClass] = useState('standard')
    const [accName, setAccName] = useState('')
    const [noteSubject, setNoteSubject] = useState('')
    const [typeOfNote, setTypeOfNote] = useState('Call')
    const [noteText, setNoteText] = useState('')


    // Grab the customer from history (client clicked from customer page )
    const setCustomerFromHistory = () => {
        const customerIdFromHistory = history.location.search.split('=')[1]
        const selectedCustomer = customerList.filter(customer => customer.ListID === customerIdFromHistory )[0]
        setselectedCustomerObj(selectedCustomer)
    }

    // clear everything ( Clicking clear btn or submitting note)
    const clearTextBoxes = () => {
        setselectedCustomerObj({})
        setAccName('')
        setNoteSubject('')
        setTypeOfNote('Call')
        setNoteText('')
    }

    // set the selected customer object (client cliked on autocomplete result)
    const autoCompleteClick = customer => {
        setselectedCustomerObj(customer)
    }

    // use history to set customer obj 
    useEffect(() => {
        if(history.location.search !== ''){
            setCustomerFromHistory()
        }
    }, [history.location.search])



    // Handle note clas change 
    const handleNoteClassChange = e => {
        if(e === 'personal'){
            setTypeOfNote('Personal')
        } else{
            setTypeOfNote('Call')
        }
        setNoteClass(e)
    }

    //Handle Type of note change
    const handleTypeOfNoteChange = e => {
        if(noteClass === 'personal'){
            setTypeOfNote('Personal')
        } else{
            setTypeOfNote(e)
        }
    }

    // clicking submit on the form,show modal and check the fields 
    const submitHandler = (e) => {
        e.preventDefault()

        if(noteClass === 'standard' && Object.keys(selectedCustomerObj).length < 1){
            setShowAlert(true)
        } else{
            setShowModal(true)
        }
    }

    // actual submit method 
    const submitNote = () => {
        
        const note = {
            CustomerRef: selectedCustomerObj,
            Subject: noteSubject,
            Text: noteText,
            AuthorRef: {
                uid: userInfo.uid,
                displayName: userInfo.displayName,
                email: userInfo.email,
                photoURL: userInfo.photoURL,
            },
            NoteType : typeOfNote,
            NoteClass : noteClass,
            TimeStamp: new Date()
        }

        // turn off modal
        setShowModal(false)

        dispatch(createNote(note))

        history.push('/submitnote')    
    }


    return (
        <div id='create-note-page' className="page-padding medium page-animated fade">
            {showModal && <ModalContainer modalType='question' msg='Are you sure you want to submit this note?' acceptMethod={submitNote} declineMethod={()=> setShowModal(false)} />}
            {showAlert && <ModalContainer modalType='alert' msg='Please select an existing customer' acceptMethod={() => setShowAlert(false)} />}
            <PageTitle title="Note Page" subtitle="Add a new Note" btns={['Clear']} btnFunc={clearTextBoxes}/>
            <form action="" onSubmit={submitHandler}>
                <div className="input-section">
                <RadioSelector 
                    name="standardOrPersonalNote" 
                    selectedValue='standard'
                    options={[{title: 'Standard', value: 'standard'},{title: 'Personal', value : 'Personal-Note'}]} 
                    handleChange={e => handleNoteClassChange(e)}
                />
                <br/><br/>
                    {noteClass === 'standard' ? Object.keys(selectedCustomerObj).length === 0
                    ? (
                    <>
                        <CustomInput 
                        title="Select Customer" 
                        placeholder="Enter Name of Account"
                        elName="note-account-name"
                        type="text"
                        value={accName}
                        required={true}
                        onChange={e => setAccName(e.target.value)}
                        maxLength={60}/>
                        
                        {accName.length > 0 
                        ?  <AutoCompleteSection 
                            searchBoxText={accName} 
                            resetMainSearchBar={() => setAccName('')} 
                            handleClick={customerResult => autoCompleteClick(customerResult)}/> 
                        : (<p>&nbsp;&nbsp;<i className="fas fa-exclamation-circle"></i> No Customer Selected</p>)}
                    </>) : (
                        <>
                        <CustomInput 
                            title='Selected Customer' 
                            elName="note-account-name"
                            type="text-selected"
                            value={selectedCustomerObj.CompanyName}
                            required={true}
                            onChange={() => setselectedCustomerObj({})}/>
                        </>
                    ) : (
                        <></>
                    )}
                    <br/>
                        
                    <CustomInput 
                        title="Note Subject" 
                        placeholder="Enter the subject of the note"
                        elName="note-account-subject"
                        type="text"
                        required={true}
                        value={noteSubject}
                        onChange={e => setNoteSubject(e.target.value)}
                        maxLength={144}/>
                    <CustomInput 
                        title="Type of Note" 
                        placeholder=""
                        elName="note-account-type"
                        type="select"
                        options={typeOfNotes}
                        value={typeOfNote}
                        onChange={e => handleTypeOfNoteChange(e.target.value)}/>
                    <CustomInput 
                        title="Note Text" 
                        placeholder=""
                        elName="note-account-type"
                        type="textarea"
                        required={true}
                        value={noteText}
                        maxLength={900}
                        onChange={e => setNoteText(e.target.value)}/>
                    <Button typeBtn='Submit' />
                </div>
            </form>
        </div>
    )
}

export default NoteCreatePage
