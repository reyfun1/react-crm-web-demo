import React from 'react'
import { useSelector} from 'react-redux'
import { Link} from 'react-router-dom'
import Loader from '../components/Loader'


const NoteSubmissionPage = () => {

    const noteCreate = useSelector(state => state.noteCreate)
    const { loading, success, note} = noteCreate

    return (
        <div className="page-padding large fade">
            {loading ? (<Loader/>) : (
                <>
                {success ? (
                    <div className="message-div">
                        <i className="fas fa-check-circle"></i>
                        {note.CustomerRef ? (
                            <>
                            <p>Your note for {note.CustomerRef.CompanyName} was submitted successfully</p>
                            <Link to={`/noteview/${note.id}`} className="link-button">Go to note</Link>
                            <Link to={`/customerpage/${note.CustomerRef.ListID}`} className="link-button" >Go to Customer</Link>
                            </>
                        ) : (
                            <>
                            <p>Your personal note was submitted successfully</p>
                            <Link to={`/noteview/${note.id}`} className="link-button">Go to Note</Link>
                            </>
                        )}

                    </div>
                ) : (
                    <div className="message-div">
                        <i className="fas fa-times-circle"></i>
                        <p> There was a problem submitting the note, try again later</p>
                    </div>
                )}
                </>
            )}
        </div>
    )
}

export default NoteSubmissionPage
