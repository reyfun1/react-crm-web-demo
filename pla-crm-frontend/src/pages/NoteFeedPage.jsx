import React, { useState , useEffect, useRef} from 'react'
import PageTitle from '../components/PageTitle'
import CustomInput from '../components/CustomInput'
import Loader from '../components/Loader'

import NoteItem from '../components/NoteItem'

import { useDispatch, useSelector} from 'react-redux'

import {dateSelectors, standardDateFormat} from '../utils/DateMethods'

import FeedCSVExporter from '../utils/FeedCSVExporter'


import { getNotes } from '../actions/noteActions'

const NoteFeedPage = React.memo(({ history }) => {
    const dispatch = useDispatch()

    // Redux states 
    const environmentVariables = useSelector(state => state.environmentVariables)
    const { loading, notes, error, disableShowMore } = useSelector(state => state.notesFeed)
    const { lists } = environmentVariables

    // ui comoponent elevel states 
    const [showFilters, setShowFilters] = useState(false)

    // component level states 
    const [typeOfDate, setTypeOfDate] = useState(Object.keys(dateSelectors)[0])
    const [datesToShow, setDatesToShow] = useState(dateSelectors['Today'])

    // filter fields level states 
    const [author, setAuthor] = useState('Any')
    const [noteClass, setNoteClass] = useState('Any')
    const [typeOfNote, setTypeOfNote] = useState('Any')

    const [filterInfo, setFilterInfo] = useState({})

    // on load check if there are dates from session storage
    useEffect(() => {
        const data = sessionStorage.getItem("noteFeedDates")
        const dataFromStorage = JSON.parse(data)
        // if there is data in session storage, then use those dates 
        if(data){
            setTypeOfDate(dataFromStorage.typeOfDate)
            setDatesToShow({
                from : new Date(dataFromStorage.datesToShow.from),
                to : new Date(dataFromStorage.datesToShow.to)
            })
            setAuthor(dataFromStorage.filters.author)
            setNoteClass(dataFromStorage.filters.noteClass)
            setTypeOfNote(dataFromStorage.filters.typeOfNote)

            const newFilters = {
                author : dataFromStorage.filters.author,
                noteClass : dataFromStorage.filters.noteClass,
                typeOfNote : dataFromStorage.filters.typeOfNote}
    
            setFilterInfo(newFilters)
        }
        
        // if notes is empty 
        if(notes && notes.length < 1){
            // if there is data from the session storage then dispatch notes and use those dates
             if(data){
                dispatch(getNotes(dateSelectors[JSON.parse(data).typeOfDate],filterInfo))
            // there no dates on session storage, use current state of the state element
             } else{
                dispatch(getNotes(dateSelectors[typeOfDate],filterInfo))
             }
        }

    }, [])

    // Save the set item on all changes
    useEffect(() => {
        // Saving the state to session storage
        sessionStorage.setItem("noteFeedDates", JSON.stringify({
            typeOfDate : typeOfDate,
            datesToShow: datesToShow,
            filters : {
                author,noteClass, typeOfNote
            }
        }))
    })

    // execute on the switch data type 
    const switchDateHandler = (val) => {
        setTypeOfDate(val)
        setDatesToShow(dateSelectors[val])
        console.log('switchDates handler disaptch notes')
        dispatch(getNotes(dateSelectors[val],filterInfo))
    }

    const handleExportCsvClick = () => {
        const exporter = new FeedCSVExporter(notes, ['Note Id', 'Customer', 'Author', 'Date', 'Note Type', 'Note Subject', 'Note Text'] ,'notesfeed');
        const csvOutput = exporter.convertToCSV();
        const csvBlob = new Blob([csvOutput], { type: "text/csv" });
        const blobUrl = URL.createObjectURL(csvBlob);
        const anchorElement = document.createElement("a");

        anchorElement.href = blobUrl;
        anchorElement.download = "note-feed-export.csv";
        anchorElement.click();

        setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
        }, 500);
    }


    const handleApplyFiltersClick = () => {
        const newFilters = {
            author,
            noteClass,
            typeOfNote}

        setFilterInfo(newFilters)
        setShowFilters(false)
        dispatch(getNotes(datesToShow, {...filterInfo,...newFilters}))
    }
    const handleClearFilter = () => { 
        setFilterInfo({})
        setShowFilters(false)
        setAuthor('Any') 
        setTypeOfNote('Any')
        setNoteClass('Any')
        dispatch(getNotes(datesToShow, {}))}

    const handleLoadMore = () => {
        dispatch(getNotes(datesToShow, filterInfo,  notes[notes.length - 1].TimeStamp))
    }


    return (
        <div id='feed-note-page' className="page page-padding large fade">
            <PageTitle title="Notes Feed" subtitle="Showing the latest Notes" btns={['Filter']} btnFunc={()=> setShowFilters(!showFilters)}/>
            <div className="input-section">
                {showFilters && (
                <div className="filter-setter-container">
                    <div className="info-section">
                        <p className="section-title bold centered">
                            Filter notes
                        </p>
                        <br/>
                        <div className="filter-fields flex">
                            <CustomInput 
                                title="Type of Note" 
                                placeholder=""
                                elName="note-account-type"
                                type="select"
                                options={typeOfNotes}
                                value={typeOfNote}
                                onChange={e => setTypeOfNote(e.target.value)}/>

                                {/* flex divider */}
                                <div style={{width: '5%'}}></div>
                            <CustomInput 
                                title="Note Class" 
                                placeholder=""
                                elName="note-account-class"
                                type="select"
                                options={noteClasses}
                                value={noteClass}
                                onChange={e => setNoteClass(e.target.value)}/>

                        </div>
                        <div className="filter-fields flex">
                            <CustomInput 
                                title="Author" 
                                placeholder=""
                                elName="note-account-class"
                                type="select"
                                options={authorsList}
                                value={author}
                                onChange={e => setAuthor(e.target.value)}/>  
                        </div>

                        <div className="filter-fields flex">
                        <button style={{margin: 'auto'}} onClick={handleApplyFiltersClick}>Apply Filters</button>
                        <div style={{width: '5%'}}></div>
                        <button style={{margin: 'auto'}} onClick={handleClearFilter}>Clear Filters</button>
                        </div>
                    </div>

                    <div className="divider"></div>
                    
                </div>)}
            <CustomInput 
                        title="Date Range" 
                        placeholder=""
                        elName="note-feed-date-selector"
                        type="select"
                        options={Object.keys(dateSelectors)}
                        value={typeOfDate}
                        onChange={e => switchDateHandler(e.target.value)}/>
            
            <p className="feed-result-text">
                <span>
                {datesToShow && standardDateFormat(datesToShow.from)} - {datesToShow && standardDateFormat(datesToShow.to)}
                </span>
                {Object.keys(filterInfo).length > 1 && (
                    <>
                    <br/><br/>
                        <span className={filterInfo.typeOfNote !== 'Any' ? 'highlight' : ''} >NoteType: {filterInfo.typeOfNote}</span>
                        <span className={filterInfo.noteClass !== 'Any' ? 'highlight' : ''}>NoteClass: {filterInfo.noteClass}</span> 
                        <span className={filterInfo.author !== 'Any' ? 'highlight' : ''} >Author: {filterInfo.author} </span> 
                    </>
                )}
            </p>
            </div>
            <div className="feed notes-feed">
                {loading ? (<Loader/>) : (
                    notes && notes.length > 0 ? (
                        <>

                        <div className="info-section flex">
                            <p className="section-title">{typeOfDate}, {notes?.length} notes </p>
                            <br/>
                            <button onClick={handleExportCsvClick}> Export <i className="fas fa-file-csv"></i> </button>
                        </div>
                        
                        <br/>
                        {notes
                        .sort((a,b) => b.TimeStamp.toDate() - a.TimeStamp.toDate())
                        .map(note => <NoteItem note={note} key={note.id} />)}

                            <br/>
                            <div className="info-section flex">
                                {disableShowMore ? (
                                    <button className={disableShowMore ? 'disabled' : ''} style={{margin: 'auto'}} onClick={handleLoadMore}>
                                    No more notes
                                </button>
                                ) : (
                                    <button style={{margin: 'auto'}} onClick={handleLoadMore}>
                                    Load more
                                </button>
                                )}
                                
                            </div>
                        
                        </>
                    ) : (
                        <p className="feed-result-text"> <i className="fas fa-exclamation-circle"></i> No notes were found for this time-period</p>
                    )
                )} 
            </div>

        </div>
    )
})

// ppulating the note type section 
const typeOfNotes = ['Any','Call','Email','Text', 'Visit','Event', 'Error-Shipping', 'Error', 'Complaint', 'Training']

const noteClasses = ['Any','Personal-Note', 'standard']
const authorsList = ['Any']

export default NoteFeedPage
