import React, {useEffect, useState} from 'react'
import { useSelector} from 'react-redux'

import PageTitle from '../components/PageTitle'
import ModalContainer from '../components/ModalContainer';
import TransactionTable from '../components/TransactionTable'


const HomePage = ({history}) => {

    const [showModal,setShowModal] = useState(false)

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin;

    const environmentVariables = useSelector(state => state.environmentVariables)
    const { lists } = environmentVariables;
    
    const inventoryItems = lists?.itemList?.inventoryItems
    const standardItems = lists?.orderForms?.standard?.products

    const [inventoryToPass, setIntentoryToPass] = useState([])

    const filterOutItems = () => {
        if(inventoryItems && standardItems){
            const standardItemsArr =  Object.keys(standardItems).map(o => o )
            setIntentoryToPass(
                Object.keys(inventoryItems)
                .filter(o =>  standardItemsArr.includes(o) )
                .map(o => inventoryItems[o] )
            )
        }
    }


    const createNote = e => {
        console.log('note created')
        setShowModal(false)
    }

    if(userInfo ){
        // say hello to client
    } else{
        history.push('/login')
    }
    const handleBtn = () => {
        setShowModal(true)
    }

    useEffect(() => {
        filterOutItems()
    }, [environmentVariables])
    

    return (
        <div className="page-padding extra-large fade">
         {showModal && <ModalContainer modalType='question' msg='Are you sure you want to submit the note?' acceptMethod={createNote} />}

        <PageTitle title='Home Page' subtitle='Welcome!' btns={[]} showCurrentDate={true}></PageTitle>
        <br/><br/><br/>

        <br/><br/><br/>

        <TransactionTable data={inventoryToPass} type="lists-inventory-status"/>

        </div>
    )
}

export default HomePage


