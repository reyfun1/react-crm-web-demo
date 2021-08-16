
import { formatDateTime} from '../utils/DateMethods'

export default class FeedCSVExporter {
    constructor (data, headersArr, type ) {

        // create the header row
        const headerRow = document.createElement('tr')
        headerRow.innerHTML = headersArr.map(header => {
            return `<th>${header}</th>`
        })


        // Convert Data to HTML Table
        switch (type) {
            case 'notesfeed':
                this.rows = data.map(note => {
                    const newRow = document.createElement('tr')
                    newRow.innerHTML += `
                        <td>${note.id ? note.id : 'No id'}</td>
                        <td>${note.CustomerRef ? note.CustomerRef.CompanyName : 'Personal Note'}</td>
                        <td>${note.AuthorRef.displayName ? note.AuthorRef.displayName : note.AuthorRef.email}</td>
                        <td>${note.TimeStamp ? formatDateTime(note.TimeStamp.toDate()) : ''}</td>
                        <td>${note.NoteType ? note.NoteType : ''}</td>
                        <td>${note.Subject ? note.Subject : 'No subject'}</td>
                        <td>${note.Text ? note.Text : 'Empty Note'}</td>`
                        return newRow
                })
                break;
            case 'ordersfeed':
                this.rows = data.map(order => {
                    const newRow = document.createElement('tr')
                    newRow.innerHTML += `
                        <td>${order.id ? order.id : 'No id'}</td>
                        <td>${order.NewCustomer ? order.NewCustomerRef.CompanyName : order.CustomerRef.CompanyName}</td>
                        <td>${order.AuthorRef.displayName ? order.AuthorRef.displayName : order.AuthorRef.email}</td>
                        <td>${order.TimeStamp ? formatDateTime(order.TimeStamp.toDate()) : ''}</td>
                        <td>${order.PriceLevel ? order.PriceLevel : ''}</td>
                        <td>${order.Terms ? order.Terms : ''}</td>
                        <td>${order.OrderTotals ? order.OrderTotals.facings : ''}</td>
                        <td>${order.OrderTotals ? order.OrderTotals.qty : ''}</td>
                        <td>${order.OrderTotals ? order.OrderTotals.amount : ''}</td>
                        <td>${order.NewCustomer ? 'New Customer' : ''}</td>
                        <td>${order.OrderInstructions ? order.OrderInstructions : ''}</td>
                        <td>${order.OrderFormType ? order.OrderFormType : ''}</td>`
                        return newRow
                })
                
                break;
        
            default:
                break;
        }
        // attach the header 
        this.rows.unshift(headerRow)

    }

    convertToCSV () {
        const lines = [];
        const numCols = this._findLongestRowLength();

        for (const row of this.rows) {
            let line = "";

            for (let i = 0; i < numCols; i++) {
                if (row.children[i] !== undefined) {
                    line += FeedCSVExporter.parseCell(row.children[i]);
                }

                line += (i !== (numCols - 1)) ? "," : "";
            }

            lines.push(line);
        }

        return lines.join("\n");
    }

    _findLongestRowLength () {
        return this.rows.reduce((l, row) => row.childElementCount > l ? row.childElementCount : l, 0);
    }

    static parseCell (tableCell) {
        
        let parsedValue = tableCell.textContent;

        // Replace all double quotes with two double quotes
        parsedValue = parsedValue.replace(/"/g, `""`);

        // If value contains comma, new-line or double-quote, enclose in double quotes
        parsedValue = /[",\n]/.test(parsedValue) ? `"${parsedValue}"` : parsedValue;

        return parsedValue;
    }
}


