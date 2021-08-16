
import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
import "firebase/functions"
import "firebase/database"


const app = firebase.initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
})

export const auth = app.auth()
export const db = app.firestore()
export const rdb = app.database()
export const functions = app.functions()
export const Timestamp = firebase.firestore.Timestamp
export default app