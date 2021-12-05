import {useState, useEffect, useCallback} from 'react'

const storageName = 'userData'

export const useAuth = () => {

    const [userData, setUserData] = useState(null)

    const login = useCallback((jwtToken, userId, firstName, lastName, role) => {
        setUserData({
            ...userData,
            'token': jwtToken,
            userId,
            firstName,
            lastName,
            role
        })
        try {
            localStorage.setItem(storageName, JSON.stringify({token: jwtToken, userId, firstName, lastName, role}))
        } catch (e) {
            if (e == window.QUOTA_EXCEEDED_ERR) {
                alert('Limit of data is exceeded for Local Storage')
            }
        }
    }, [])

    const logout = useCallback(() => {
        setUserData(null)
        localStorage.removeItem(storageName)
    }, [login])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName))

        if (data && data.token) {
            login(data.token, data.userId, data.firstName, data.lastName, data.role)
        }
        //setReady(true)
    }, [login])

    return {login, logout, userData}
}