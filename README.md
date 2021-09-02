# CRM (Customer Relationship Manager) Web APP
> Responsive SPA built with Firebase and React <br>
> Live Demo -> [Live Demo](https://crm-web-demo.web.app "CRM APP")

This is a CRM (Customer Relationship Manager) App built for Plasencia Cigars. They currently use it to manage their accounts. The app contains information about the accounts such as invoices, sales info, contact info. It also has the ability for users to submit orders for these accounts, as well as notes so other sales representatives can follow up and be aware of the current status of an account. This app also communicates with Quickbooks accounting software and transfers data automatically throughout the day.

It was built with React and the Firebase Suite (Firestore, Cloud Functions & Google Auth)
- -  -

![Account Page](/img/accountpage-min.jpg)
**Account Page (Desktop View)** - *Shows data for accounts such as contact info, sales, orders, notes*
- - - 
![Order Form](/img/phone-order-form.png) <br>
**Order Form (Mobile View)** - *Page to submit orders, selecting from an order form*
- - - 
![Notes Feed](/img/notefeed.png) <br>
**Note Feed (Desktop View)** - *Submitted notes will show up here, these notes can be filtered different properties*

# Details
- Single Page App built with React and Redux
- Built using custom SASS/CSS for styling and animations
- Firebase is used as a backend replacement to handle server functions, database and user auth
- 

# Freatures
- User profiles
- Responsive, (Sidebar is hidden on mobile view)
- Searchbox to search for Accounts with autocomplete
- Notes creation and reading, linked to user and account
- Orders creation and reading, linked to user and account
- Converts HTML to PDF for exporting account invoices
- Displays account information:
    - Contact Information 
    - Sales
    - Notes
    - Orders 
    - Sales Orders
    - Invoices

