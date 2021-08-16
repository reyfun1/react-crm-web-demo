import React from 'react'
import { BrowserRouter as Router, Route} from 'react-router-dom'
import {useSelector} from 'react-redux'
import './index.css';

// Component imports
import Header from './components/Header'
import Footer from './components/Footer'

// Page Imports
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage';
import NoteCreatePage from './pages/NoteCreatePage';
import NoteFeedPage from './pages/NoteFeedPage'
import NoteViewPage from './pages/NoteViewPage'
import OrderCreatePage from './pages/OrderCreatePage';
import ReportsPage from './pages/ReportsPage';
import CustomerPage from './pages/CustomerPage';
import AdminPage from './pages/AdminPage'
import OrderSubmissionPage from './pages/OrderSubmissionPage'
import NoteSubmissionPage from './pages/NoteSubmissionPage'
import OrderFeedPage from './pages/OrderFeedPage'
import OrderViewPage from './pages/OrderViewPage'
import InvoicePage from './pages/InvoicePage'
import SalesOrderPage from './pages/SalesOrderPage';
import SideNav from './components/SideNav';
import ListsPageRenewed from './pages/ListPageRenewed';



const App = () => {
  const userState = useSelector(state => state.userLogin)
  const { userInfo } = userState

  return (
    <div className={`App`}>
    <Router>
        {userInfo ? (
          <>
            <Header/>
            <SideNav/>
          </>
        ) : (<></>)}
        <main>
          <div className='container'>
            <Route path='/login' component={LoginPage} exact/>
            <Route path='/notecreate' component={NoteCreatePage} exact/>
            <Route path='/notefeed' component={NoteFeedPage} exact/>
            <Route path='/noteview/:id' component={NoteViewPage} exact/>
            <Route path='/orderview/:id' component={OrderViewPage} exact/>
            <Route path='/ordercreate' component={OrderCreatePage} exact/>
            <Route path='/orderfeed' component={OrderFeedPage} exact/>
            <Route path='/lists' component={ListsPageRenewed} exact/>
            <Route path='/reportspage' component={ReportsPage} exact/>
            <Route path='/submitorder' component={OrderSubmissionPage} exact/>
            <Route path='/submitnote' component={NoteSubmissionPage} exact/>
            <Route path='/invoiceview/:id' component={InvoicePage} exact/>
            <Route path='/salesorderview/:id' component={SalesOrderPage} exact/>
            <Route path='/customerpage/:id' component={CustomerPage} exact/>
            <Route path='/admin/' component={AdminPage} exact/>
            <Route path='/' component={HomePage} exact/>
          </div>
        </main> 
        {userInfo ? (
          <Footer/>
        ) : (<></>)}      
    </Router>
    </div>
  );
}



export default App;
