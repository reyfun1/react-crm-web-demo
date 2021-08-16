// Import date methods for date handling 
import { startOfDay ,startOfYesterday,startOfWeek, startOfMonth, startOfYear } from 'date-fns'
import { endOfDay,endOfYesterday, endOfWeek, endOfMonth, endOfYear} from 'date-fns'
import { subMonths , subWeeks } from 'date-fns'


export const standardDateFormatFromQb = (date) => {
    const dateArr = date.split("-")
    return `${dateArr[1]}/${dateArr[2]}/${dateArr[0]}`
}

export const standardDateFormat = (date) => {
    date = new Date(date)
   return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
}

export const formatDateTime  = (date) => {
    let dateString =  `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
    let timeString = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' })

    return dateString + ' ' +  timeString
}

export const dateSelectors = {
    Today : {
        from : startOfDay(new Date()),
        to : endOfDay(new Date())
    },
    Yesterday : {
        from :startOfYesterday(new Date()),
        to : endOfYesterday(new Date())
    },
    ['This Week'] : {
        from : startOfWeek(new Date(), {weekStartsOn: 1}),
        to: endOfWeek(new Date(), {weekStartsOn: 1})
    },
    ['Last Week'] : { 
        from : subWeeks(startOfWeek(new Date(), {weekStartsOn: 1}),1),
        to: subWeeks(endOfWeek(new Date(), {weekStartsOn: 1}),1)
    },
    ['This Month'] : {
        from : startOfMonth(new Date()),
        to: endOfMonth(new Date())
    },
    ['Last Month'] : {
        from : subMonths(startOfMonth(new Date()), 1),
        to: subMonths(endOfMonth(new Date()), 1)
    },
    ['This Year'] : {
        from : startOfYear(new Date()),
        to: endOfYear(new Date())
    },
    ['Last Year'] : {
        from : startOfYear(new Date(new Date().setFullYear(new Date().getFullYear() - 1))),
        to: endOfYear(new Date(new Date().setFullYear(new Date().getFullYear() - 1)))
    }
}