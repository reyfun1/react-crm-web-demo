import {
    NOTE_CREATE_REQUEST,
    NOTE_CREATE_SUCCESS,
    NOTE_CREATE_FAIL,

    NOTE_FEED_REQUEST,
    NOTE_FEED_SUCCESS,
    NOTE_FEED_FAIL,
    NOTE_FEED_DISABLE_SHOW_MORE,

    NOTE_DETAILS_REQUEST,
    NOTE_DETAILS_SUCCESS,
    NOTE_DETAILS_FAIL,

    NOTE_CUSTOMER_FEED_REQUEST,
    NOTE_CUSTOMER_FEED_SUCCESS,
    NOTE_CUSTOMER_FEED_FAIL,

} from '../constants/noteConstants'

import {db} from '../firebase'
import {auth} from '../firebase'

export const createNote = note => async (dispatch) => {
    try{
        // set status to loading 
        dispatch({
            type: NOTE_CREATE_REQUEST,
        })

        db.collection('notes').add(note)
        .then(doc => {
            dispatch({
                type: NOTE_CREATE_SUCCESS,
                payload: {...note,id: doc.id}
            })
            // reset the note session storage so notes feed resets
            //sessionStorage.setItem("noteFeedDates", '')
        })
        .catch(err =>{
            dispatch({
                type: NOTE_CREATE_FAIL,
                payload: err,
            })
        })

    } catch(error){
        console.log(error)
        dispatch({
            type: NOTE_CREATE_FAIL,
            payload: error,
        })

    }
}


export const getNotes = (dates, filterInfo, lastDate) => async (dispatch, getState) => {

    let isRep = false

    // get previous notes stattes
    const { notesFeed } = getState()
    const notesFromPrevState = notesFeed.notes

    // if it comes from showmore do not dispatch to load
    if(!lastDate){
        dispatch({
            type: NOTE_FEED_REQUEST,
        })
    }

    // await to recevie the current user before proceeding
    await getCurrentUser(auth)

    // get the claims from the user
    const {claims} = await auth.currentUser?.getIdTokenResult()

    // query to be performed
    let query = db.collection('notes')
    let query2 = db.collection('notes')

    //if query has state restrictions 
    if(claims?.restrictions?.states?.length > 0) {
        isRep = true
        query = query.where('CustomerRef.State', 'in', claims.restrictions.states )
        query2 = query2.where('NoteClass', '==', "Personal-Note" )
    }

    // add time-frame filters 
    query = query.where('TimeStamp', '>=', dates.from)
    query = query.where('TimeStamp', '<=', dates.to)

    query2 = query2.where('TimeStamp', '>=', dates.from)
    query2 = query2.where('TimeStamp', '<=', dates.to)


    // add extra-filters
    if(filterInfo){
        Object.keys(filterInfo).forEach(filterField => {
            if(filterInfo[filterField] !== 'Any'){
                switch (filterField) {
                    case 'author':
                        query = query.where('AuthorRef.displayName', '==',filterInfo[filterField] )
                        query2 = query2.where('AuthorRef.displayName', '==',filterInfo[filterField] )
                        break;
                    case 'noteClass':
                        query = query.where('NoteClass', '==',filterInfo[filterField] )
                        break;
                    case 'typeOfNote':
                        query = query.where('NoteType', '==',filterInfo[filterField] )
                        query2 = query2.where('NoteType', '==',filterInfo[filterField] )
                        break;
                    
                    default:
                        break;
                }
            }
        })
    }

    // add limits
    query = query.limit(50)
    query2 = query2.limit(50)

    // add sorting
    query = query.orderBy("TimeStamp", "desc")
    query2 = query2.orderBy("TimeStamp", "desc")

    // add pagination
    if(lastDate){
        query = query.startAfter(lastDate)
        query2 = query2.startAfter(lastDate)
    }


    // request the query 
    query.get()
        .then(async snap => {
            let result = []
            snap.forEach(doc => result.push({...doc.data(), id : doc.id }))

            if(isRep){
                await query2.get().then( snap2 => {
                    snap2.forEach(doc2 => { 
                        console.log(doc2.data())
                        result.push({...doc2.data(), id : doc2.id })
                    })
                })
            }

            // if it is a query to load more, add to current array
            if(lastDate){
                // if result is empty, disable load more 
                if(result.length < 1){
                    dispatch({
                        type: NOTE_FEED_DISABLE_SHOW_MORE,
                        payload: true
                    })
                }
                result = [...result, ...notesFromPrevState ]
            }

            dispatch({
                type: NOTE_FEED_SUCCESS,
                payload: result
            })
    
        })
        .catch(err => {
            console.log(err)
            dispatch({
                type: NOTE_FEED_FAIL,
                payload: err
            })   
        })

    // query.onSnapshot(snap => {
    //     let result = []
    //         snap.forEach(doc => result.push({...doc.data(), id : doc.id }))

    //         // if it is a query to load more, add to current array
    //         if(notesLength){
    //             console.log(result)
    //             console.log(notesFromPrevState)
    //             result = [...result, ...notesFromPrevState ]
    //         }

    //         dispatch({
    //             type: NOTE_FEED_SUCCESS,
    //             payload: result
    //         })
    // })

}

export const getNotesForCustomerPage = () => async (dispatch, getState) => {
    dispatch({
        type: NOTE_CUSTOMER_FEED_REQUEST,
    })

    // get the customer details
    const {customerDetails: {customerInfo}} = getState();

    // await to recevie the current user before proceeding
    await getCurrentUser(auth)

    // get the claims from the user
    const {claims} = await auth.currentUser?.getIdTokenResult()

    // query to be performed
    let query = db.collection('notes')

    //if query has state restrictions 
    if(claims?.restrictions?.states?.length > 0) {
        query = query.where('CustomerRef.State', 'in', claims.restrictions.states )
    }

    // add the customer filter
    query = query.where('CustomerRef.ListID', '==', customerInfo.ListID)


    
    // make the actual query
    query.onSnapshot(snap=> {
        let result = []
        snap.forEach(doc => result.push({...doc.data(), id : doc.id }))
        dispatch({
            type: NOTE_CUSTOMER_FEED_SUCCESS,
            payload: result
        })
    }, error => {
        dispatch({
            type: NOTE_CUSTOMER_FEED_FAIL,
            payload: error
        })   
    })
}

export const getNoteDetails = (noteId) => async (dispatch, getState) => {
    // check if note is already on the notes feed list 
    dispatch({
        type: NOTE_DETAILS_REQUEST
    })

    // extract info of the logeed in user and of the note list 
    const {userLogin: {userInfo}} = getState();
    const {notesFeed: {notes}} = getState();

    if(notes) {
        const foundNote = notes.find(note => note.id === noteId)

        if(foundNote){
            dispatch({
                type: NOTE_DETAILS_SUCCESS,
                payload: foundNote
            })
            return
    }
    }

     // make the actual query
     db.collection('notes').doc(noteId).get()
        .then(doc => {
            dispatch({
                type: NOTE_DETAILS_SUCCESS,
                payload: {...doc.data(), id: doc.id}
            })
        })
        .catch(err => {
            dispatch({
                type: NOTE_DETAILS_FAIL,
                payload:err
            })
        })

}

function getCurrentUser(auth) {
    return new Promise((resolve, reject) => {
       const unsubscribe = auth.onAuthStateChanged(user => {
          unsubscribe();
          resolve(user);
       }, reject);
    });
  }

