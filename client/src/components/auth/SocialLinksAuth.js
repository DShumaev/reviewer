import {Button, SimpleGrid, VisuallyHidden} from '@chakra-ui/react'
import {FaFacebook, FaGoogle} from 'react-icons/fa'
import {Icon28LogoVkOutline} from '@vkontakte/icons'


export const SocialLinksAuth = () => {

    const socialBtnHandler = (e) => {
        if (e.target.getAttribute('name')) {
            window.location.href=`https://goodreviewer.herokuapp.com/auth/${e.target.name}/login`
        }
    }

    return (
        <SimpleGrid mt="6" columns={3} spacing="3">
            <Button
                color="currentColor"
                variant="outline"
                name="facebook"
                onClick={socialBtnHandler}
            >
                <VisuallyHidden>Login with Facebook</VisuallyHidden>
                <FaFacebook />
            </Button>
            <Button
                color="currentColor"
                variant="outline"
                name="google"
                onClick={socialBtnHandler}
            >
                <VisuallyHidden>Login with Google</VisuallyHidden>
                <FaGoogle />
            </Button>
            <Button
                color="currentColor"
                variant="outline"
                name="vkontakte"
                onClick={socialBtnHandler}
            >
                <VisuallyHidden>Login with VKontakte</VisuallyHidden>
                <Icon28LogoVkOutline color="#eeeff0"/>
            </Button>
        </SimpleGrid>
    )
}