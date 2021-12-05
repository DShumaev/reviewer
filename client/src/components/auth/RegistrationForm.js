import { Button, chakra, FormControl, FormLabel, Input, Stack } from '@chakra-ui/react'
import {PasswordField} from './Password'
import {useState} from 'react'
import {useHttp} from '../../hooks/http.hook'
import {useNotification} from "../../hooks/notification.hook"
import {useNavigate} from 'react-router-dom'


export const RegistrationForm = () => {

    const [registrationData, setRegistrationData] = useState({})
    const {request} = useHttp()
    const navigate = useNavigate()
    const notification = useNotification()

    const registration = async (e) => {
        e.preventDefault()
        try {
            const data = await request('/auth/register', 'POST', {...registrationData})
            if (data) {
                notification(data.message, 'success')
                navigate('/auth/login')
            }
        } catch (e) {
            notification(e, 'info')
        }
    }

    const fillRegistrationData = (e) => {
        setRegistrationData({
                ...registrationData,
                [e.target.name]: e.target.value
            })
    }

    return (
        <chakra.form onSubmit={registration}>
            <Stack spacing="6">
                <FormControl id="firstName">
                    <FormLabel>First name</FormLabel>
                    <Input
                        name="firstName"
                        required
                        onChange={fillRegistrationData}
                    />
                </FormControl>
                <FormControl id="lastName">
                    <FormLabel>Last Name</FormLabel>
                    <Input
                        name="lastName"
                        required
                        onChange={fillRegistrationData}
                    />
                </FormControl>
                <FormControl id="email">
                    <FormLabel>Email address</FormLabel>
                    <Input
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        onChange={fillRegistrationData}
                    />
                </FormControl>
                <PasswordField fillPassword={fillRegistrationData}/>
                <Button type="submit" colorScheme="blue" size="lg" fontSize="md">
                    Sign up
                </Button>
            </Stack>
        </chakra.form>
    )

}


