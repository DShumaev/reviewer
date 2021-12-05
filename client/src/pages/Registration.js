import {Box, Heading, Text, Link, useColorModeValue} from '@chakra-ui/react'
import {Card} from '../components/auth/Card'
import {DividerWithText} from '../components/auth/DividerWithText'
import {RegistrationForm} from '../components/auth/RegistrationForm'
import {useNavigate} from "react-router-dom"
import {SocialLinksAuth} from '../components/auth/SocialLinksAuth'

export const Registration = () => {

    const navigate = useNavigate()

    const goToLoginPage = (e) => {
        e.preventDefault()
        navigate('/auth/login')
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
                    Create your account
                </Heading>
                <Text mt="4" mb="8" align="center" maxW="md" fontWeight="medium">
                    <Text as="span">You already have an account? </Text>
                    <Link
                        onClick={goToLoginPage}
                        color={useColorModeValue('blue.500', 'blue.200')}
                        _hover={{color: useColorModeValue('blue.600', 'blue.300')}}
                    >
                        Sign in
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
                    <RegistrationForm />
                    <DividerWithText mt="6">or continue with</DividerWithText>
                    <SocialLinksAuth />
                </Card>
            </Box>
        </Box>
    )
}
