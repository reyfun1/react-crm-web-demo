import React, {useState} from 'react'
import Button from './Button'

const TabSection = ({children, footerbtns, activeTab, setActiveTab}) => {

    const active = activeTab ? activeTab : 0
    const setActive = setActiveTab

    const tabbuttons = children[0].props.children
    const tabpages = children[1].props.children
    const numberOfPages = children[1].props.children.length


    return (
        <div className="tabsection">
            <div className="tabsection-btns">
                {tabbuttons.map( (btn, i) => {

                    if(btn.props.onClick === undefined){
                        return React.cloneElement(btn,{
                            key : i,
                            onClick : () => {setActive(i)},
                            className : active === i ? 'active' : ''
                        })
                    } else{
                        return React.cloneElement(btn,{
                            key : i,
                            onClick : () => {setActive(i); btn.props.onClick()},
                            className : active === i ? 'active' : ''
                        }) 
                    }
                    
                })}
            </div>
            <div className="tabsection-pages">
                {tabpages.map( (page,i) => {
                    return React.cloneElement(page,{
                        key : i,
                        className : active === i ? 'tabsection-page fade active' : 'tabsection-page fade',
                    })
                })}
            </div>

            {footerbtns && (
                <div className="tabsection-footer-btns">
                    {active === 0 ? (
                        <Button typeBtn="Next" onClick={() => setActive(active + 1)}/>
                    ): active === numberOfPages - 1 ? (
                        <Button typeBtn="Prev" onClick={() => setActive(active - 1)}/>
                    ): (
                        <>
                            <Button typeBtn="Prev" onClick={() => {setActive(active - 1)}}/>
                            <Button typeBtn="Next" onClick={() => {setActive(active + 1)}}/>
                        </>
                    ) }
                </div>
                
            )}
        </div>
    )
}

export default TabSection
