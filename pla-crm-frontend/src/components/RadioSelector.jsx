import React, {useState} from 'react'

const RadioSelector = ({name, options, handleChange, selectedValue}) => {  

    // default state to first option
    const [selected,setSelected] = useState(selectedValue)
    
    return (
            <div className="input-radio-container">
                {options.map( (option, i) => {
                    
                    return (<div className="radio-input" key={i}>
                            <input  type="radio" 
                                    id={`custom-ratio-${name}-${i}`} 
                                    name={name} 
                                    checked={selected === option.value} 
                                    onChange={e => {setSelected(option.value); handleChange(option.value)}}
                                    value={option.value}/>
                                
                            <label htmlFor={`custom-ratio-${name}-${i}`}>{option.title}</label> 
                </div>)
                })}
            </div>  
    )
}

export default RadioSelector
