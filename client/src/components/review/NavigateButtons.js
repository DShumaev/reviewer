import {useNavigate} from 'react-router-dom'
import {Button, HStack, VisuallyHidden} from '@chakra-ui/react'
import {AiOutlineHome, BiArrowBack} from 'react-icons/all'
import {useContext} from 'react'
import {AuthContext} from '../../context/AuthContext'


export const NavigateButtons = () => {

    const navigate = useNavigate()
    const {userData} = useContext(AuthContext)

    const goHomePage = () => {
        navigate('/')
    }

    const goUserPage = () => {
        navigate('/user/*')
    }

    return (
        <HStack alignSelf="end">
            {userData && userData.userId &&
            <Button color="currentColor" variant="outline" name="back" onClick={goUserPage}>
                <VisuallyHidden>Back</VisuallyHidden>
                <BiArrowBack />
            </Button>
            }
            <Button color="currentColor" variant="outline" name="home" onClick={goHomePage}>
                <VisuallyHidden>Home</VisuallyHidden>
                <AiOutlineHome />
            </Button>
        </HStack>
    )
}




