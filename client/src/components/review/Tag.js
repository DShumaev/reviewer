import {Tag as ChakraTag} from '@chakra-ui/react'
import {useHttp} from '../../hooks/http.hook'

export const Tag = (props) => {
// компонент пок нигде не используется
    const {request} = useHttp()
    const tagClickHandler = () => {
        try {
            request(`/review/search_by_tag/${props.child}`)


        } catch (e) {

        }
    }

    return (
        <ChakraTag {...props} onClick={tagClickHandler}>
            {props.child}
        <ChakraTag />
    )
}

