import {useState, useCallback} from 'react'
import {useAuth} from './auth.hook'
import {useNavigate} from 'react-router-dom'
import {useNotification} from './notification.hook'


export const useHttp = () => {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const {logout} = useAuth()
    const navigate = useNavigate()
    const notification = useNotification()

    const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {

        setLoading(true)
        try {
            if (body) {
                body = JSON.stringify(body)
                headers['Content-Type'] = 'application/json'
            }
            const response = await fetch(url, {method, body, headers})
            if (response.status === 401) {
                navigate('/')
                notification('Your token expired, please relogin', 'info')
                logout()
            }
            const data = await response.json()
            if (!response.ok) {
                throw new Error(data.message || 'Something problem with http request')
            }
            setLoading(false)
            return data
        } catch (e) {
            setLoading(false)
            setError(e.message)
            throw e
        }
    }, [])

    const clearError = useCallback(() => {
        setError(null)
    }, [])

    return {request, loading, error, clearError}
}