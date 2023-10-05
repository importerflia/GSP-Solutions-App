import { useReducer, createContext } from "react"
import jwtDecode from "jwt-decode"

const initialState = {
    user: null,
    isAdmin: false,
    isModerator: false
}

if (localStorage.getItem('token')) {
    const decodedToken = jwtDecode(localStorage.getItem('token')) as any
    if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem('token')
    }else{
        const adminRole = decodedToken.userRoles.filter((role) => role.name === 'admin')
        const moderatorRole = decodedToken.userRoles.filter((role) => role.name === 'moderator')
        initialState.user = decodedToken
        initialState.isAdmin = adminRole.length > 0 ? true : false,
        initialState.isModerator = moderatorRole.length > 0 ? true : false
    }
}

const AuthContext = createContext({
    user: null,
    isAdmin: false,
    isModerator: false,
    signIn: (userData) => {},
    signOut: () => {}
})

const authReducer = (state, action) => {
    switch(action.type){
        case 'LOGIN':
            const adminRole = action.payload.userRoles.filter((role) => role.name === 'admin')
            const moderatorRole = action.payload.userRoles.filter((role) => role.name === 'moderator')
            return {
                ...state,
                user: action.payload,
                isAdmin: adminRole.length > 0 ? true : false,
                isModerator: moderatorRole.length > 0 ? true : false
            }
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                isAdmin: false,
                isModerator: false
            }
        default:
            return state
    }
}

const AuthProvider = (props) => {
    const [state, dispatch] = useReducer(authReducer, initialState)

    const signIn = (token) => {
        localStorage.setItem('token', token)
        dispatch({
            type: 'LOGIN',
            payload: token ? jwtDecode(token) : token
        })
    }

    const signOut = () => {
        localStorage.removeItem('token')
        dispatch({ type: 'LOGOUT' })
    }

    return (
        <AuthContext.Provider
            value={{ user: state.user, isAdmin: state.isAdmin, isModerator: state.isModerator, signIn, signOut }}
            { ...props }
        />
    )
}

export { AuthContext, AuthProvider }
