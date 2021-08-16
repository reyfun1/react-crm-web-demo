import React, { useEffect } from 'react'
import Button from '../components/Button'

import PropTypes from 'prop-types'

const PageTitle = ({subtitle,title, btns, showCurrentDate, btnFunc}) => {
    const {dayName,monthName,day,year} = getCurrentDate()

    return (
        <>
        <div className='page-title'>
            <div className='title'>
                <h2>{title}</h2>
                <p>{subtitle}</p>
            </div>
            {btns && (
                <div className='btn-container'>
                    {btns.map(btn => (
                        <Button key={btn} typeBtn={btn} onClick={btnFunc} />
                    ))} 
                </div>
            )}
            {showCurrentDate && (
                <div className="date-container">
                    <h2>{dayName}</h2>
                    <p>{monthName} {day}, {year}</p>
                </div>
            )}
        </div>
        </>
    )
}

const getCurrentDate = () => {
    const obj = {}

    const date = new Date()
    obj.year = date.getFullYear()
    obj.monthName = date.toLocaleString('default',{month: 'long'})
    obj.dayName = date.toLocaleString('default',{weekday: 'long'})
    obj.day = date.getDate()

    return obj
}

PageTitle.propTypes = {
    subtitle : PropTypes.string,
    title : PropTypes.string,
    type : PropTypes.string,
    btns : PropTypes.array,
    showCurrentDate : PropTypes.bool,
}
PageTitle.defaultProps = {
    subtitle : '',
    title : 'Page Title',
    type : 'left',
    btns: [],
    showCurrentDate: false
}

export default PageTitle

// BTN TYPE 

// Edit , Delete, Clear, Filter, Filter, Sort

