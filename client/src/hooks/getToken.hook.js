import {useEffect} from 'react'
import {useHttp} from './http.hook'


export const useGetToken = (login) => {

    const {request} = useHttp()

    useEffect(async () => {
            const data = await request(`/auth/social_network/get_token`)
            if (data && data.token) {
                login(data.token, data.userId, data.firstName, data.lastName, data.role)
            }
    }, [])

}


