import {createContext} from 'react'


export const AuthContext = createContext({
    token: null,
    userId: null,
    firstName: null,
    lastName: null,
    login: null,
    logout: null,
    isAuthenticated: false,
    role: 'user'
})
