import React from 'react'

const Button = ({typeBtn, onClick, text}) => {

    switch (typeBtn) {
        case 'Submit':
            return (
                    <button type="submit" className="submit"> 
                        <i className="far fa-paper-plane"></i> 
                        &nbsp;&nbsp;Submit
                    </button> 
                    )
        case 'SubmitEscapeForm':
            return (
                    <button type="button" className="submit" onClick={onClick}> 
                        <i className="far fa-paper-plane"></i> 
                        &nbsp;&nbsp;Submit
                    </button> 
                    )
        case 'AddUser':
            return (
                    <button type="button" onClick={onClick} style={{float: 'right'}}> 
                        <i className="fas fa-plus-square"></i>
                        &nbsp;&nbsp;Add User
                    </button> 
                    )
        case 'Edit':
            return (
                    <button type="button" onClick={onClick}> 
                       <i className="fas fa-edit"></i>
                        &nbsp;&nbsp;Edit
                    </button> 
                    )
        case 'Login':
            return (
                    <button type="submit" className="login"> 
                        <i className="far fa-paper-plane"></i> 
                        &nbsp;&nbsp;Login
                    </button> 
                    )
        case 'Clear':
            return (
                    <button type="button" className="clear" onClick={onClick}> 
                        <i className="fas fa-eraser"></i>
                        &nbsp;&nbsp;Clear
                    </button> 
                    )
        case 'Filter':
            return (
                    <button type="button" className="clear" onClick={onClick}> 
                        <i className="fas fa-filter"></i>
                        &nbsp;&nbsp;Filter
                    </button> 
                    )
        case 'Next':
            return (
                    <button type="button" className="clear" onClick={onClick}> 
                        Next&nbsp;&nbsp;
                        <i className="fas fa-angle-right"></i>
                    </button> 
                    )
        case 'Load':
            return (
                    <button type="button" className="clear" onClick={onClick} style={{float: 'right'}}> 
                        {text}&nbsp;&nbsp;
                        <i className="fas fa-angle-right"></i>
                    </button> 
                    )
        case 'Close':
            return (
                    <button type="button" className="clear" onClick={onClick}> 
                        Close&nbsp;&nbsp;
                        <i className="fas fa-times"></i>
                    </button> 
                    )
        case 'Delete':
            return (
                    <button type="button" className="clear" onClick={onClick}> 
                        <i className="fas fa-trash-alt"></i>&nbsp;&nbsp;
                        Delete
                    </button> 
                    )
        case 'Prev':
            return (
                    <button type="button" className="clear" onClick={onClick}> 
                        <i className="fas fa-angle-left"></i>
                        &nbsp;&nbsp;Previous
                    </button> 
                    )
        case 'Yes':
            return (
                    <button type="button" className="submit" onClick={onClick}> 
                        Yes&nbsp;&nbsp;
                        <i className="fas fa-check"></i>
                    </button> 
                    )
        case 'Ok':
            return (
                    <button type="button" onClick={onClick}> 
                        Ok&nbsp;&nbsp;
                        <i className="fas fa-check"></i>
                    </button> 
                    )
        case 'No':
            return (
                    <button type="button" className="clear" onClick={onClick}> 
                        No&nbsp;&nbsp;
                        <i className="fas fa-times"></i>
                    </button> 
                    )
                            case 'No':
            return (
                    <button type="button" className="clear" onClick={onClick}> 
                        No&nbsp;&nbsp;
                        <i className="fas fa-times"></i>
                    </button> 
                    )
                    
        default:
            return (
                <button> 
                    <i className="far fa-paper-plane"></i> 
                    &nbsp;&nbsp;Click Here
                </button> 
                )
    }
}

export default Button
