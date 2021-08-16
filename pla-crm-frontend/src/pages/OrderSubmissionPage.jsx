import React from 'react'
import { useSelector} from 'react-redux'
import { Link} from 'react-router-dom'
import Loader from '../components/Loader'


const OrderSubmissionPage = () => {

    const orderCreate = useSelector(state => state.orderCreate)
    const { loading, success, order} = orderCreate

    return (
        <div className="page-padding large page-animated">
            {loading ? (<Loader/>) : (
                <>
                {success ? (
                    <div className="message-div">
                        <i className="fas fa-check-circle"></i>
                        <p>Your order for {order.CustomerRef.CompanyName} was submitted successfully</p>
                            <Link to={`/orderview/${order.id}`} className="link-button">Go to Order</Link>
                            {order.CustomerRef.ListID && <Link to={`/customerpage/${order.CustomerRef.ListID}`} className="link-button" >Go to Customer</Link>}
                            
                    </div>
                ) : (
                    <div className="message-div">
                        <i className="fas fa-times-circle"></i>
                        <p> There was a problem submitting the order, try again later</p>
                    </div>
                )}
                </>
            )}
        </div>
    )
}

export default OrderSubmissionPage
