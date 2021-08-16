import React from 'react'

const Loader = ({type}) => {

    switch (type) {
        case 'page-loader':
            return (
                <div className="loading-spinner page-loader">
                    <i className="fas fa-spinner"></i>   
                </div>
            )    
        default:
            return (
                <div className="loading-spinner page-loader">
                    <i className="fas fa-spinner"></i>   
                </div>
            ) 
    }

}

export default Loader
