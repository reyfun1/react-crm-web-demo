import React from 'react'

import { Link, useLocation} from 'react-router-dom'

import { formatDateTime} from '../utils/DateMethods'

const NoteItem = ({note}) => {
    const {AuthorRef, CustomerRef, NoteClass, NoteType, Subject, Text, TimeStamp, id} = note

    return (
        <div className="note">
        <Link to={`/noteview/${id}`}>
            <div className="note-header">
                {NoteClass === 'personal' ? (
                    <p>Personal Note <i className="fas fa-chevron-right"></i></p>
                ) : (
                    <p>{CustomerRef.CompanyName} <i className="fas fa-chevron-right"></i></p>
                )}
            </div>
            <div className="note-body">
                <p>{Subject}</p>
                <p>{Text}</p>
            </div>
            <div className="note-footer">
                <p>{formatDateTime(TimeStamp.toDate())}</p>
                <p>{NoteType}</p>
                <p>{AuthorRef.displayName ? AuthorRef.displayName : 'Anonymous'}</p>
            </div>
        </Link>
        </div>
    )
}





export default NoteItem
