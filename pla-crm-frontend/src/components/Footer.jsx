import React, { useEffect } from 'react'

import { Link, useLocation} from 'react-router-dom'

const Footer = () => {

    const { pathname } = useLocation();
    const active = 'active-footer-btn'
    
    return (
        <div className="footer">
            <ul>
                <li className={pathname === '/' ? 'footer-btn active-footer-btn' : 'footer-btn'} target="home-page">
                    <Link to="/"><i className="fas fa-home" aria-hidden="true"></i><p>Home</p></Link>
                </li>
                <li className={pathname === '/notecreate' ? 'footer-btn active-footer-btn' : 'footer-btn'} target="add-note-page">
                    <Link to="/notecreate"><i className="fas fa-pen" aria-hidden="true"></i><p>Note</p></Link>
                </li>
                <li className={pathname === '/reportspage' ? 'footer-btn active-footer-btn' : 'footer-btn'} target="reports-page">
                    <Link to="/reportspage"><i className="fas fa-chart-line" style={{marginTop: '1px'}} aria-hidden="true"></i><p>Reports</p></Link>
                </li>
                <li className={pathname === '/ordercreate' ? 'footer-btn active-footer-btn' : 'footer-btn'} target="add-order-page">
                    <Link to="/ordercreate"><i className="fas fa-file-invoice-dollar" aria-hidden="true"></i><p>Order</p></Link>
                </li>
            </ul>
        </div>
    )
}

export default Footer
