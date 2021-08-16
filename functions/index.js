const functions = require('firebase-functions');
const admin = require('firebase-admin');
const FieldValue = require('firebase-admin').firestore.FieldValue;


admin.initializeApp();

const rdb = admin.database()


// Cloud Function to recevie customer list request
exports.getCustomerList = functions.https.onCall(async(data, context) => {

    // Getting info from User that called in 
    //const callerUserRecord = await admin.auth().getUser(context.auth.uid);

    let customerListArr = []

    customerListArr = await getFullCustomerListFromDb()
    
    return {
        customerlist: customerListArr
    }
});

// Cloud Function to Return Sales for a customer 
exports.getCustomerSalesList = functions.https.onCall(async(customerListID, context) => {

    //If user is not loggedin 
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'Not Authorized to view customers'
        )
    }

    const salesForCustomer = {}

    // Get the sales 
    await rdb.child(`salesList/${customerListID}`).get().then(snapshot => {
        if (snapshot.exists()) {
            salesForCustomer = snapshot.val()
        }
    })
    
    return salesForCustomer
});

// Cloud Function to recevie invoice list request
exports.getInvoiceList = functions.https.onCall(async(data, context) => {

    // If user is not loggedin 
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'Not Authorized to view invoices'
        )
        
    }
    // Getting info from User that called in 
    const callerUserRecord = await admin.auth().getUser(context.auth.uid);
    
    if(!callerUserRecord.customClaims){
        throw new functions.https.HttpsError(
            'permission-denied',
            'No user role found, denied permission to view invoices'
            )
        }
        
    const claimsArr = Object.keys(callerUserRecord.customClaims)

    let invoiceListArr = []

    if(claimsArr.includes('admin')){
        console.log('caller : admin')
        invoiceListArr = await getFullInvoiceListFromDb()
    }
    if(claimsArr.includes('office')){
        console.log('caller : office')
        invoiceListArr = await getFullInvoiceListFromDb()
    }
    if(claimsArr.includes('rep')){
        console.log('caller : rep')
        invoiceListArr = await getFilteredInvoiceListFromDb(callerUserRecord.customClaims)
    }
    
    return {
        invoicelist: invoiceListArr
    }
});

// Cloud Function to recevie invoice list request
exports.getSalesOrderList = functions.https.onCall(async(data, context) => {

    // If user is not loggedin 
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'Not Authorized to view sales orders'
        )
        
    }
    // Getting info from User that called in 
    const callerUserRecord = await admin.auth().getUser(context.auth.uid);
    
    if(!callerUserRecord.customClaims){
        throw new functions.https.HttpsError(
            'permission-denied',
            'No user role found, denied permission to view sales orders'
            )
        }
        
    const claimsArr = Object.keys(callerUserRecord.customClaims)

    let salesOrderListArr = []

    if(claimsArr.includes('admin')){
        console.log('caller : admin')
        salesOrderListArr = await getFullSalesOrderListFromDb()
    }
    if(claimsArr.includes('office')){
        console.log('caller : office')
        salesOrderListArr = await getFullSalesOrderListFromDb()
    }
    if(claimsArr.includes('rep')){
        console.log('caller : rep')
        salesOrderListArr = await getFilteredSalesOrderListFromDb(callerUserRecord.customClaims)
    }
    
    return {
        salesorderlist: salesOrderListArr
    }
});


/// Create user only by admin
exports.createUser = functions.https.onCall(async (data, context) => {
    
    try {
        console.log('DATA IS : ')
        console.log(data)

        const {role, email, password, firstname, lastname , restrictions} = data
        const dataNoPass = {role,email,firstname,lastname,restrictions}

        //Checking that the user calling the Cloud Function is authenticated
        if (!context.auth) {
            throw new UnauthenticatedError('The user is not authenticated. Only authenticated Admin users can create new users.');
        }

        //Checking that the user calling the Cloud Function is an Admin user
        const callerUid = context.auth.uid;  //uid of the user calling the Cloud Function

        // Temporiraly create the user
        const userCreationRequest = {
            userDetails: dataNoPass,
            status: 'Pending',
            createdBy: callerUid,
            createdOn: FieldValue.serverTimestamp()
        }
       
        // Save this temp user to special collection in db
        const userCreationRequestRef = await admin.firestore().collection("userCreationRequests").add(userCreationRequest);

        // New user object
        const newUser = {
            email: email,
            emailVerified: false,
            password: password,
            displayName: firstname + ' ' + lastname,
            disabled: false
        }

        // create actual user in databse 
        const userRecord = await admin.auth().createUser(newUser);

        const userId = userRecord.uid;

        const claims = {
            [role] : true,
            restrictions : restrictions
        };

        await admin.auth().setCustomUserClaims(userId, claims);
        await admin.firestore().collection("users").doc(userId).set(dataNoPass);
        await userCreationRequestRef.update({ status: 'Treated' });

        return { result: 'The new user has been successfully created.' };


    } catch (error) {

        if (error.type === 'UnauthenticatedError') {
            throw new functions.https.HttpsError('unauthenticated', error.message);
        } else if (error.type === 'NotAnAdminError' || error.type === 'InvalidRoleError') {
            throw new functions.https.HttpsError('failed-precondition', error.message);
        } else {
            throw new functions.https.HttpsError('internal', error.message);
        }

    }

});


// Method to get Customer List from the Database 
const getFullCustomerListFromDb = async() => {
    let result = [];
        await rdb.ref('/lists/customerlist/').once('value', snapshot => {
            result = Object.keys(snapshot.val())
            .map(customerid => snapshot.val()[customerid] )
        })
    return result;
}

// Method to get Invoice List from the Database 
const getFullInvoiceListFromDb = async() => {
    let result = [];
        await rdb.ref('/lists/invoicelist/').limitToFirst(100).once('value', snapshot => {
            result = Object.keys(snapshot.val())
            .map(invoiceNum => snapshot.val()[invoiceNum] )
        })
    return result;
}
const getFilteredInvoiceListFromDb = async(customClaims) => {
    const states = customClaims.restrictions.states

    let result = []
        await rdb.ref('/lists/invoicelist/').once('value', snapshot => {
            result = Object.keys(snapshot.val())
            .filter(invoiceNum => states.includes(snapshot.val()[invoiceNum]['State']))
            .map(invoiceNum => snapshot.val()[invoiceNum] )
        })
    return result;
}

// Method to get Customer List from the Database 
const getFullSalesOrderListFromDb = async() => {
    let result = [];
        await rdb.ref('/lists/salesorderlist/').once('value', snapshot => {
            result = Object.keys(snapshot.val())
            .map(so => snapshot.val()[so] )
        })
    return result;
}
const getFilteredSalesOrderListFromDb = async(customClaims) => {
    const states = customClaims.restrictions.states

    let result = []
        await rdb.ref('/lists/salesorderlist/').once('value', snapshot => {
            result = Object.keys(snapshot.val())
            .filter(so => states.includes(snapshot.val()[so]['State']))
            .map(so => snapshot.val()[so] )
        })
    return result;
}
