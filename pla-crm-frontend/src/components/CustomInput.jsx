import React, {useState} from 'react'
import Button from './Button'

// to delete alll
const CustomInput = ({title,placeholder,elName,type, options, value, onChange, required, maxLength}) => {

  const [textarearows, setTextAreaRows] = useState(8)

  const handleTextArea = (elem) => {
    if (elem.clientHeight < elem.scrollHeight){
      //The element has a vertical scrollbar
      setTextAreaRows(textarearows + 1)
    }
    //The element doesn't have a vertical scrollbar
  }

  switch (type) {
    case 'text':
      return (<div className='text-input-container'>
                  <div><label htmlFor={elName} required={required && required} >{title}</label> </div>
                  <div className="input-box">
                    <input type="text" name={elName} placeholder={placeholder} value={value} onChange={onChange} required={required && required} maxLength={maxLength && maxLength}/> 
                    {value?.length > 1 && <button onClick={onChange} type="button" className="input-clear" tabIndex="-1"></button>}
                    <br/>
                    {value?.length > 1 && <p className='input-size'>{value.length}/{maxLength}</p>}
                  </div>
                  
                </div>)
    
    case 'email':
      return (<div className='text-input-container'>
                  <div><label htmlFor={elName} required={required && required} >{title}</label> </div>
                  <div className="input-box">
                    <input type="email" name={elName} placeholder={placeholder} value={value} onChange={onChange} required={required && required} maxLength={maxLength && maxLength}/> 
                    {value.length > 1 && <button onClick={onChange} type="button" className="input-clear" tabIndex="-1"></button>}
                    <br/>
                    {value.length > 1 && <p className='input-size'>{value.length}/{maxLength}</p>}
                  </div>
                </div>) 

    case 'number':
      return (<div className='text-input-container'>
                  <div><label htmlFor={elName} required={required && required}>{title}</label> </div>
                  <div className="input-box">
                    <input type="number" min="0" max="100" name={elName} placeholder={placeholder} value={value} onChange={onChange} required={required && required}/> 
                  </div>
                </div>)  

    case 'text-selected':
      return (<div className='text-input-container selected'>
                <div><label htmlFor={elName} required={required && required}>{title} <i style={{color: '#F9C784'}}className="fas fa-check-square"></i></label></div>
                <div className="input-box">
                  <input disabled type="text" name={elName} placeholder={placeholder} value={value} onChange={onChange} required={required && required} />
                  <button onClick={onChange} type="button" className="input-clear" tabIndex="-1"></button>
                </div>
              </div>) 
    case 'select':
      return (<div className='text-input-container select-container'>
                  <label htmlFor={elName}>{title} {required ? <span style={{color: 'red'}}>*</span> : "" }</label> 
                  <select name={elName} placeholder={placeholder} value={value} onChange={onChange}>
                    {options && options.map( option => <option key={option} value={option}>{option}</option>)}
                    </select>
                </div>)

    case 'yesno':
      return (<div className='text-input-container select-container'>
                  <label htmlFor={elName}>{title}</label> 
                  <select name={elName} placeholder={placeholder} value={value} onChange={onChange}>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                    </select>
                </div>)
    case 'textarea':
      return (<div className='text-input-container'>
                  <label htmlFor={elName} required={required && required} >{title}</label> 
                  <textarea name={elName} placeholder={placeholder} required={required && required} maxLength={maxLength && maxLength} rows={textarearows} value={value} onChange={(e) => {handleTextArea(e.target); onChange(e) }}/> 
                  <br/>
                    {value.length > 1 && <p className='input-size textarea'>{value.length}/{maxLength}</p>}
                </div>)
    case 'password':
      return ( <div className='text-input-container'>
                    <label htmlFor={elName}>{title || 'Password'}</label> 
                    <input type='password' name={elName} placeholder={placeholder} value={value} onChange={onChange} maxLength={maxLength && maxLength}/> 
                </div>)
    default:
      return (<div className='text-input-container'>
                  <label htmlFor={elName}>{title}</label> 
                  <input type={type} name={elName} placeholder={placeholder}/> 
                </div>)
  }
}

export default CustomInput
