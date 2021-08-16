import React,  {useEffect} from 'react'
import PageTitle from '../components/PageTitle'
import Loader  from '../components/Loader'

import { useDispatch, useSelector} from 'react-redux'

import {getNoteDetails} from '../actions/noteActions'


const NoteViewPage = ({ match }) => {
    const dispatch = useDispatch()
    const noteId = match.params.id

    // getting state resources 
    const {userInfo} = useSelector( state => state.userLogin)
    const {loading,note} = useSelector(state => state.noteDetails)


    // get the note details
    useEffect(()=>{
        dispatch(getNoteDetails(noteId))
    },[noteId])




    const deleteHandler = () => {

    }

    const {CustomerRef, AuthorRef,NoteClass,NoteType,Subject,Text,TimeStamp, id } = note

    return (
        <div id='view-note-page' className="page-padding large fade">
            <PageTitle title="Note Page" subtitle="Showing note" btns={['Delete']} btnFunc={deleteHandler}/>
            <br/><br/>

            {loading ? (<Loader/>) : (
                <>
                <div className="info-section" id="view-note-data">
                 <p className="section-title">Note</p>
                 <div className="section-content">
                    <div className="info-key-value with-logo">
                            <i className="fas fa-paste"></i>
                        <div>
                                <p>{Subject}</p>
                                <p>{Text}</p>
                        </div>
                    </div>
                 </div>
             </div>             
             <br/><br/>
                 <div className="info-section">
                 <p className="section-title">Note # {id}</p>
                 <div className="section-content">
                     {NoteClass === 'standard' ? (
                         <>
                         <div className="info-key-value with-logo">
                            <i className="fas fa-store"></i>
                            <div>
                                <p>Company</p>
                                <p>{CustomerRef && CustomerRef.CompanyName }</p>
                            </div>
                         </div>
                         <div className="info-key-value">
                            <div>   
                                <p>Account#</p>
                                <p>{CustomerRef && CustomerRef.ListID}</p>
                            </div>
                        </div>
                        </>
                     ) : (<></>)}
                     
                     <div className="info-key-value with-logo">
                        <i className="fas fa-user-edit"></i>
                     <div>
                             <p>Submitted By</p>
                             <p>{AuthorRef?.displayName ? AuthorRef?.displayName : 'Anonymous'}</p>
                     </div>
                     </div>
                     <div className="info-key-value">
                         <div>
                            <p>Submitted on</p>
                             <p>{TimeStamp && formatDateTime(TimeStamp.toDate())}</p>
                         </div>
                     </div>
                     <div className="info-key-value with-logo">
                        
                     </div>

                     <div className="info-key-value">
                         <div>
                            <p>Note Type</p>
                             <p>{NoteType}</p>
                         </div>
                     </div>
                 </div>
             </div>
                </>
            )}

           
        </div>
    )
}

const formatDateTime  = (date) => {
    console.log(date)
    let dateString =  `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
    let timeString = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' })
    return dateString + ' ' +  timeString
}

export default NoteViewPage
