import {Flex, VStack, Input, InputGroup, InputLeftElement, useDisclosure} from '@chakra-ui/react'
import {IconButton} from '@chakra-ui/button'
import {FaSun, FaMoon, FaUserCircle, FaSearch} from 'react-icons/fa'
import {useColorMode} from '@chakra-ui/color-mode'
import {AuthModal} from './auth/AuthModal'
import {SearchModal} from './review/SearchModal'
import Flags from 'country-flag-icons/react/3x2'
import {useState} from 'react'
import {useNotification} from '../hooks/notification.hook'
import {useHttp} from '../hooks/http.hook'


export const Header = () => {

    const [language, setLanguage] = useState('rus')
    const {colorMode, toggleColorMode} = useColorMode()
    const isDark = colorMode === 'dark'
    const notification = useNotification()
    const {request} = useHttp()
    const {isOpen: isAuthModalOpen, onOpen: onAuthModalOpen, onClose: onAuthModalClose} = useDisclosure()
    const {isOpen: isSearchModalOpen, onOpen: onSearchModalOpen, onClose: onSearchModalClose} = useDisclosure()
    const [reviewsBySearch, setReviewsBySearch] = useState(null)

    const openAuthModal = () => {
        onAuthModalOpen()
    }

    const changeLanguageHandler = () => {
        if (language === 'rus') {
            setLanguage('eng')
        } else {
            setLanguage('rus')
        }
    }

    const searchQueryHandler = async (e) => {
        if (e.key !== 'Enter') {
            return
        }
        const queryString = e.target.value.trim()
        if (queryString.length < 3) {
            notification('Incorrect search query (at least 3 characters)', 'info')
            return
        }
        try {
            const data = await request(`/review/fts?query_string=${queryString}`)
            if (!Array.isArray(data) && !(data.length > 0)) {
                return
            }
            setReviewsBySearch(data)
            onSearchModalOpen()
        } catch (e) {
            notification('Sorry, unexpected problem with receiving reviews', 'info')
        }
    }

    return (
            <VStack>
                <Flex
                    p={5}
                    w="100%"
                    position="fixed"
                    as="header"
                    backgroundColor={isDark ? "#1a202c" : "white"}
                    w="100%"
                    zIndex="500"
                    shadow="md"
                >
                    <InputGroup>
                        <InputLeftElement
                            pointerEvents="none"
                            children={<FaSearch color="gray.300" />}
                        />
                        <Input placeholder="Search" size="md" onKeyDown={searchQueryHandler} />
                    </InputGroup>
                    <IconButton
                        ml={2}
                        icon={language === 'rus' ? <Flags.RU width="25px" opacity="0.5" /> : <Flags.US width="25px" opacity="0.5" />}
                        isRound="true" onClick={changeLanguageHandler}>
                    </IconButton>
                    <IconButton
                        ml={2}
                        icon={<FaUserCircle />}
                        isRound="true"
                        onClick={openAuthModal}>
                    </IconButton>
                    <IconButton
                        ml={8}
                        icon={isDark ? <FaSun /> : <FaMoon />}
                        isRound="true"
                        onClick={toggleColorMode}>
                    </IconButton>

                </Flex>
                <AuthModal isOpen={isAuthModalOpen} onOpen={onAuthModalOpen} onClose={onAuthModalClose} />
                <SearchModal isOpen={isSearchModalOpen} onOpen={onSearchModalOpen} onClose={onSearchModalClose} loadedData={reviewsBySearch} />
            </VStack>
    )
}