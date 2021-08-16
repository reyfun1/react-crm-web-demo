import React, {useState} from 'react'

const OptionSelector = ({dataArr, title, state, setState}) => {
    

    const onChange = e => {
        const clickedOption = e.target.value
        const checkedOption = e.target.checked

        setState({...state, [clickedOption] : checkedOption})
    }

    
    return (
        <div className='option-selector'>
            <h3>{title}</h3>
            <div className='option-selector-options-container'>
                {dataArr.map(option => 
                <div key={`${option}-checkbox`}>
                    <label htmlFor="option">
                        <input onChange={e => onChange(e)} type="checkbox" name={option} value={option}/> 
                        <span>{option}</span>
                    </label>
                </div>)}
                <p className='option-selector-results'>{Object.keys(state).map(option => state[option] ? <span key={`${option}-option-result`}>{option} </span> : <span></span>)}</p>
            </div>
        </div>
    )
}

export default OptionSelector

const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max))
