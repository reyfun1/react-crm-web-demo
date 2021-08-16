import Reac, {useEffect} from 'react'

import Loader from './Loader'

import accounting from 'accounting-js'

const TableForm = ({form, list, onInput, id, pricingLevel}) => {
    let productsArr = []

    if(form){
        productsArr = mixFormAndItemsList(form.products, list.inventoryItems)
    }
    
    return (
        <div className="tableform" id={id}>
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Qty</th>
                    </tr>
                </thead>
                {!form ? <></> : (
                    <tbody>
                    {productsArr.sort((a,b) => a.Name.localeCompare(b.Name)).map( (product, index, arr) => {

                        //separate sections in the order form 
                        let isDiffFromPrev = false
                        if(index > 0 && arr[index - 1].FullName.substring(0,4) !== product.FullName.substring(0,4)){
                            isDiffFromPrev = true
                        }
                        
                        return (
                            <tr key={product.ListID} className={isDiffFromPrev ? "with-spacer" : ""}>
                                <td>{product.SalesDesc}</td>
                                <td>{
                                    accounting.formatMoney(
                                    pricingLevel > 0 ? product.SalesPrice -  (product.SalesPrice * (pricingLevel / 100)) : product.SalesPrice 
                                    )}
                                </td>
                                <td>
                                    <input type='tel' onChange={(e) => onInput(
                                        {
                                        productListID: product.ListID,
                                        qty: e.target.value * 1,
                                        price: pricingLevel > 0 ? product.SalesPrice -  (product.SalesPrice * (pricingLevel / 100)) : product.SalesPrice,
                                        name: product.SalesDesc,
                                        productCode: product.FullName
                                         })}/>
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                )}
            
            </table>
        </div>
    )

    
}

export default TableForm


const convertJsonToArr = (jsonObj) => {
    let result = []

    for(let item in jsonObj){
        result.push(jsonObj[item])
    }

    return result
}


const mixFormAndItemsList = (formProductsJson, inventoryItemsJson) => {
    const formProductsArr = convertJsonToArr(formProductsJson)

    const result = formProductsArr.map(item => inventoryItemsJson[item.ListID] ).sort( (a,b) => {
        return a.Name - b.Name
    })
    

    return result
}
