import {useCallback} from 'react'
import {useToast} from '@chakra-ui/react'

export const useNotification = () => {

    const toast = useToast()

    return useCallback((text, status) => {
        if (text) {
            toast({
                title: `${text}`,
                status,
                duration: 9000,
                isClosable: true,
            })
        }
    }, [])
}