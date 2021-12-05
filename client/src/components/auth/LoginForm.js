import { Button, chakra, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react'
import { PasswordField } from './Password'
import {useState, useContext} from "react"
import {useHttp} from '../../hooks/http.hook'
import {useNotification} from '../../hooks/notification.hook'
import {AuthContext} from '../../context/AuthContext'
import userEvent from "@testing-library/user-event"
import {useNavigate} from 'react-router-dom'


export const LoginForm = () => {

    const [loginData, setLoginData] = useState({})
    const {request} = useHttp()
    const {login} = useContext(AuthContext)
    const navigate = useNavigate()
    const notification = useNotification()

    const loginRequest = async (e) => {
        e.preventDefault()
        try {
            const data = await request('/auth/login', 'POST', {...loginData})
            login(data.token, data.userId, data.firstName, data.lastName, data.role)
            if (userEvent) {
                navigate('/')
            }
        } catch (e) {
            notification(e, 'info')
        }
    }

    const fillLoginData = (e) => {
        setLoginData({
                ...loginData,
                [e.target.name]: e.target.value
            })
    }

    return (
        <chakra.form onSubmit={loginRequest}>
            <Stack spacing="6">
                <FormControl id="email">
                    <FormLabel>Email address</FormLabel>
                    <Input
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        onChange={fillLoginData}
                    />
                </FormControl>
                <PasswordField fillPassword={fillLoginData} />
                <Button
                    type="submit"
                    colorScheme="blue"
                    size="lg"
                    fontSize="md"
                >
                    Sign in
                </Button>
            </Stack>
        </chakra.form>
    )
}
