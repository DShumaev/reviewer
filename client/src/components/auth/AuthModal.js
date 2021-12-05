import {Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Text, Link} from '@chakra-ui/react'
import {useNavigate} from 'react-router-dom'
import {useContext} from 'react'
import {AuthContext} from '../../context/AuthContext'


export const AuthModal = (props) => {

    const {isOpen, onClose} = props
    const navigate = useNavigate()
    const {userData, logout} = useContext(AuthContext)

    const loginPage = () => {
        navigate('/auth/login')
        onClose()
    }

    const registrationPage = () => {
        navigate('/auth/registration')
        onClose()
    }

    const getCurrentUserPage = () => {
        navigate('/user/' + `${userData.firstName}${userData.lastName}`)
        onClose()
    }

    const logoutFromProfile = () => {
        navigate('/')
        logout()
        onClose()
    }

    if (userData) {
        return (
            <>
                <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>You are loged in as</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Link
                                fontWeight="bold"
                                mb="1rem" fontSize="3xl"
                                onClick={getCurrentUserPage}
                            >
                                {`${userData.firstName} ${userData.lastName}`}
                            </Link>
                        </ModalBody>
                        <ModalFooter justifyContent="space-evenly">
                            <Button variant="ghost" onClick={logoutFromProfile}>Log out</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>
        )
    }

    return (
        <>
            <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />

                <ModalContent>
                    <ModalHeader>We are happy to see you!</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text fontWeight="bold" mb="1rem">
                            You can sign in or sign up to our website
                        </Text>
                    </ModalBody>
                    <ModalFooter justifyContent="space-evenly">
                        <Button variant="ghost" onClick={loginPage}>SIGN IN</Button>
                        <Button variant="ghost" ml="10px" onClick={registrationPage}>SIGN UP</Button>
                    </ModalFooter>
                </ModalContent>

            </Modal>
        </>
    )



}