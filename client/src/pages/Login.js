import {Box, Heading, Text, Link, useColorModeValue} from '@chakra-ui/react'
import {Card} from '../components/auth/Card'
import {DividerWithText} from '../components/auth/DividerWithText'
import {LoginForm} from '../components/auth/LoginForm'
import {useNavigate} from 'react-router-dom'
import {SocialLinksAuth} from '../components/auth/SocialLinksAuth'


export const Login = () => {

    const navigate = useNavigate()

    const goToRegistrationPage = (e) => {
        e.preventDefault()
        navigate('/auth/registration')
    }

    const goToMainPage = (e) => {
        e.preventDefault()
        navigate('/')
    }

    return (
        <Box
            mt="90px"
            bg={useColorModeValue('gray.50', 'inherit')}
            minH="100vh"
            py="12"
            px={{
                base: '4',
                lg: '8',
            }}
        >
            <Box maxW="md" mx="auto">
                <Heading textAlign="center" size="xl" fontWeight="extrabold">
                    Sign in to your account
                </Heading>
                <Text mt="4" mb="8" align="center" maxW="md" fontWeight="medium">
                    <Text as="span">Don&apos;t have an account? </Text>
                    <Link
                        onClick={goToRegistrationPage}
                        color={useColorModeValue('blue.500', 'blue.200')}
                        _hover={{color: useColorModeValue('blue.600', 'blue.300')}}
                    >
                        Let's create it!
                    </Link>
                    <Box>
                        <Link
                            onClick={goToMainPage}
                            color={useColorModeValue('blue.500', 'blue.200')}
                            _hover={{color: useColorModeValue('blue.600', 'blue.300')}}
                        >
                            Or continue as unauthorized user
                        </Link>
                    </Box>
                </Text>
                <Card>
                    <LoginForm />
                    <DividerWithText mt="6">or continue with</DividerWithText>
                    <SocialLinksAuth />
                </Card>
            </Box>
        </Box>
    )
}
