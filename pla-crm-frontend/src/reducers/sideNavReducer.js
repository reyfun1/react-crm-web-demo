// CLOSE OR OPEN SIDE NAV
export const sideNavReducer = (state = false, action) => {
    switch (action.type) {
        // currently fetching
        case "TOGGLE_SIDENAV":
            return !state
        case "HIDE_SIDENAV":
            return false
        case "SHOW_SIDENAV":
            return true
        default:
            return state;
    }
}