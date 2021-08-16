import React, {useState} from 'react'
import Button from './Button'


import {useDispatch, useSelector} from 'react-redux'


const ModalContainer = ({modalType, msg, acceptMethod=()=>(null), declineMethod =()=>(null)}) => {
    const dispatch = useDispatch()

    const handleDecline = () => {
        declineMethod()
    }

    const handleAccept = () => {
        acceptMethod()
    }

    switch (modalType) {
        case 'question':
            return (
                <div className='modal-container'>
                    <div className="modal-content">
                        <p className="modal-question-text">{msg}</p>
                        <br/>
                        <div className="modal-footer">
                            <Button typeBtn="No" onClick={handleDecline}/>
                            <Button typeBtn="Yes" onClick={handleAccept}/>
                        </div>
                    </div>
                    
                </div>
            )
        case 'alert':
            return (
                <div className='modal-container'>
                    <div className="modal-content">
                        
                        <p className="modal-question-text">
                        <i className="fas fa-exclamation-circle bigIcon"></i>
                            <br/><br/>&nbsp;&nbsp;{(msg.split("\n")).map( (line,i) => {
                            return (<span key={i}>{line}<br/></span>)
                            })}
                        </p>
                        <div className="modal-footer">
                            <Button typeBtn="Close" onClick={handleAccept}/>
                        </div>
                    </div>
                    
                </div>
            )
        case 'warning':
            return (
                <div className='modal-container'>
                    <div className="modal-content">
                        <p className="modal-question-text">{msg}</p>
                        <div className="modal-footer">
                            <Button typeBtn="No"/>
                            <Button typeBtn="Yes"/>
                        </div>
                    </div>
                    
                </div>
            )
        case 'error':
            return (
                <div className='modal-container'>
                    <div className="modal-content">
                        <p className="modal-question-text">{msg}</p>
                        <div className="modal-footer">
                            <Button typeBtn="No"/>
                            <Button typeBtn="Yes"/>
                        </div>
                    </div>
                    
                </div>
            )
        default:
            return (
                <div className='modal-container'>
                    <div className="modal-content">
                        <p className="modal-question-text">{msg}</p>
                        <div className="modal-footer">
                            <Button typeBtn="No"/>
                            <Button typeBtn="Yes"/>
                        </div>
                    </div>
                    
                </div>
            )
    }
    
}

export default ModalContainer
