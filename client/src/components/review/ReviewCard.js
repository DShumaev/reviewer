import {Box, Badge, VStack, HStack, Flex, VisuallyHidden, Button, useMediaQuery} from '@chakra-ui/react'
import {StarIcon} from '@chakra-ui/icons'
import {BiEdit, IoTrashBinOutline} from 'react-icons/all'
import {useNavigate} from 'react-router-dom'
import {useContext} from 'react'
import {AuthContext} from '../../context/AuthContext'
import {useColorMode} from '@chakra-ui/color-mode'
import ReactMarkdown from 'react-markdown'


export const ReviewCard = (props) => {
    const {colorMode} = useColorMode()
    const isDark = colorMode === 'dark'
    const [isNotSmallerScreen] = useMediaQuery('(min-width: 600px)')
    const navigate = useNavigate()
    const {userData} = useContext(AuthContext)

    const clickCardHandler = () => {
        navigate(`/review/${props.reviewId}`)
    }

    const goToRedactorPageHandler = (e) => {
        e.stopPropagation()
        navigate(`/review/redactor/${props.reviewId}`)
    }

    const deleteReviewBtnHandler = (e) => {
        e.stopPropagation()
        if (!props.deleteReview) {
            return
        }
        props.deleteReview(props.reviewId)
    }

    return (
        <Box
            p={isNotSmallerScreen ? "5" : "1"}
            shadow="md"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            w="inherit"
            onClick={clickCardHandler}
            _hover={isDark
                ?
                {focus: "pointer", backgroundColor: "teal.900"}
                :
                {focus: "pointer", backgroundColor: "teal.50", shadow: "dark-lg"}
            }
        >
            <VStack alignItems="start">
                <HStack>
                    <Box display="flex" alignItems="baseline">
                        {props.new &&
                        <Badge borderRadius="full" px="2" colorScheme="teal"  mr="2">New</Badge>
                        }
                        <Flex
                            color="gray.500"
                            fontWeight="semibold"
                            letterSpacing="wide"
                            fontSize="xs"
                            alignItems={isNotSmallerScreen ? "center": "start"}
                            justifyContent={isNotSmallerScreen ? "start": "center"}
                            direction={isNotSmallerScreen ? "row" : "column"}
                        >
                            <Box mr="3">
                                {props.date}
                            </Box>
                            <Box>
                                {props.author}
                            </Box>
                        </Flex>
                    </Box>
                    {userData && props.deleteReview && ((props.authorId === userData.userId) || (userData.role === 'admin')) &&
                    <Box justifySelf="end">
                        <Button variant="ghost" name="edit" size="sm" onClick={goToRedactorPageHandler}>
                            <VisuallyHidden>edit</VisuallyHidden>
                            <BiEdit />
                        </Button>
                        <Button variant="ghost" name="delete" size="sm" onClick={deleteReviewBtnHandler}>
                            <VisuallyHidden>delete</VisuallyHidden>
                            <IoTrashBinOutline />
                        </Button>
                    </Box>
                    }
                </HStack>

                <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight">
                    category: {props.category.toUpperCase()}
                </Box>
                <Box mt="1" fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
                    {props.title}
                </Box>
                <ReactMarkdown children={props.text.slice(0, 150) + '...'} />

                <Flex
                    wrap="wrap"
                    mt="2"
                    alignItems={isNotSmallerScreen ? "center": "start"}
                    justifyContent={isNotSmallerScreen ? "start": "center"}
                    direction={isNotSmallerScreen ? "row" : "column"}
                >
                    <Box w="80px" shrink="0">
                        {Array(5)
                            .fill("")
                            .map((_, i) => (
                                <StarIcon
                                    key={i}
                                    color={i < Math.round(props.rating)  ? "teal.500" : "gray.300"}
                                />
                            ))
                        }
                    </Box>
                    <Box
                        shrink="0"
                        as="span"
                        ml={isNotSmallerScreen ? "2" : "0"}
                        color="gray.600"
                        fontSize="sm"
                    >
                        {(props.ratingCount === 1) ? `1 evaluation` : `${props.ratingCount} evaluations`}
                    </Box>
                    <Box
                        shrink="0"
                        as="span"
                        ml={isNotSmallerScreen ? "5" : "0"}
                        color="gray.600"
                        fontSize="sm"
                    >
                        {(props.likesCount === 1) ? `1 like` : `${props.likesCount} likes`}
                    </Box>
                </Flex>
            </VStack>
        </Box>
    )
}


