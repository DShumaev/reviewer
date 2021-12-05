import {Box, Flex, Heading, VStack, Image, HStack, Tag, VisuallyHidden, Button, useMediaQuery} from '@chakra-ui/react'
import {useHttp} from '../hooks/http.hook'
import {useParams} from 'react-router-dom'
import {useState, useEffect, useContext} from 'react'
import {useNotification} from '../hooks/notification.hook'
import {Loader} from '../components/Loader'
import {StarIcon} from '@chakra-ui/icons'
import {BiLike, AiFillLike} from 'react-icons/all'
import {NavigateButtons} from '../components/review/NavigateButtons'
import {AuthContext} from '../context/AuthContext'
import {CurrentReviewContext} from '../context/CurrentReviewContext'
import ReactMarkdown from 'react-markdown'


export const ReviewPage = () => {

    const {request} = useHttp()
    let {id} = useParams()
    const [isNotSmallerScreen] = useMediaQuery('(min-width: 600px)')
    const [isNotMobileScreen] = useMediaQuery('(min-width: 350px)')
    const {userData} = useContext(AuthContext)
    const notification = useNotification()
    const {currentReviewData, requestCurrentReviewState, setCurrentReviewState} = useContext(CurrentReviewContext)
    const [isLikeSet, setIsLikeSet] = useState(false)
    const [isRatingSet, setIsRatingSet] = useState(false)
    const [localRating, setLocalRating] = useState(0)
    const [isLoaded, setIsLoaded] = useState(false)
    const [timerId, setTimerId] = useState(null)

    useEffect(async () => {
        await requestCurrentReviewState(id)
    }, [])

    const setRatingHandler = async (rating) => {
        if (!isRatingSet) {
            let newRating
            if (currentReviewData.ratingCount === 0) {
                newRating = rating
            } else {
                newRating = (currentReviewData.rating + rating) / 2
            }
            try {
                const data = await request(`/review/update/${currentReviewData.reviewId}`, 'PUT',
                    {
                        rating: newRating,
                        ratingCount: currentReviewData.ratingCount + 1
                    },
                    {Authorization: `Bearer ${userData.token}`})
                if (data && !data.isUpdated) {
                    return
                }
                setCurrentReviewState({
                    ...currentReviewData,
                    rating: newRating,
                    ratingCount: currentReviewData.ratingCount + 1
                })
                setIsRatingSet(true)
                setLocalRating(rating)
                notification('Your rating is taken into account', 'info')
            } catch (e) {
            }
        }
    }

    const setLikeHandler = async () => {
        let counter
        if (isLikeSet && currentReviewData.likesCount > 0) {
            counter = currentReviewData.likesCount - 1
            setIsLikeSet(false)
        }
        if (!isLikeSet) {
            counter = currentReviewData.likesCount + 1
            setIsLikeSet(true)
        }
        try {
            const data = await request(
                `/review/update/${currentReviewData.reviewId}`,
                'PUT',
                {likesCount: counter},
                {Authorization: `Bearer ${userData.token}`})
            if (data && !data.isUpdated) {
                return
            }
            setCurrentReviewState({
                ...currentReviewData,
                likesCount: counter
            })
        } catch (e) {
        }
    }

    useEffect(() => {
        if (!currentReviewData.reviewId) {
            const id = setTimeout(() => {
                setIsLoaded(true)
            }, 5000)
            setTimerId(id)
        }
    }, [currentReviewData.reviewId])

    useEffect(() => {
        if (!currentReviewData.reviewId) {
            return
        }
        if (timerId) {
            clearTimeout(timerId)
            setIsLoaded(false)
            setTimerId(null)
        }
    }, [currentReviewData.reviewId])

    if (!currentReviewData.reviewId && !isLoaded) {
        return (
            <Loader />
        )
    }

    if (isLoaded) {
        return (
            <VStack mt="120px">
                <Heading>Sorry, we have unexpected problem with server and can't show selected review</Heading>
                <NavigateButtons />
            </VStack>
        )
    }

    return (
        <VStack mt="100">
            <VStack w="70%">
                <VStack alignItems="start" overflow="hidden">
                    <Heading>{currentReviewData.title}</Heading>
                    {isNotMobileScreen ?
                        <Flex pt="10%" direction="row" justifyContent="start">
                            {currentReviewData.images && currentReviewData.images.map((imageLink) =>
                                <Image
                                    borderRadius="full"
                                    boxSize="150px"
                                    src={imageLink}
                                    alt="picture"
                                    mr="5"
                                />
                            )}
                        </Flex>
                        :
                        <Image
                            borderRadius="full"
                            boxSize="150px"
                            src={currentReviewData.images[0]}
                            alt="picture"
                            mr="5"
                        />
                    }

                    <Flex wrap="wrap">
                        {currentReviewData.tags && currentReviewData.tags.map((tag, index) =>
                            <Tag shrink="0" mr="3px" mb="3px" size="md" key={index} variant="solid" colorScheme="teal"
                                 _hover={{background: "teal.700", shadow: "md"}} cursor="pointer">
                                {tag}
                            </Tag>
                        )}
                    </Flex>

                    <Box
                        pt="2%"
                        display="flex"
                        alignItems="baseline"
                        color="gray.500"
                        fontWeight="semibold"
                        letterSpacing="wide"
                        fontSize="xs"
                        textTransform="uppercase"
                    >
                        <Box mr="10px">
                            {currentReviewData.date}
                        </Box>
                        <Box>
                            {currentReviewData.author}
                        </Box>
                    </Box>

                    <Flex
                        wrap="wrap"
                        mt="2"
                        alignItems={isNotSmallerScreen ? "center": "start"}
                        justifyContent={isNotSmallerScreen ? "start": "center"}
                        direction={isNotSmallerScreen ? "row" : "column"}
                    >
                        <Box shrink="0">
                            {Array(5)
                                .fill("")
                                .map((_, i) => (
                                    <StarIcon
                                        key={i}
                                        color={i < Math.round(currentReviewData.rating)  ? "teal.500" : "gray.300"}
                                    />
                                ))}
                        </Box>
                        <Box
                            as="span"
                            ml={isNotSmallerScreen ? "2" : "0"}
                            color="gray.600"
                            fontSize="sm"
                        >
                            {(currentReviewData.ratingCount === 1) ? `1 evaluation` : `${currentReviewData.ratingCount} evaluations`}
                        </Box>
                        <Box
                            as="span"
                            ml={isNotSmallerScreen ? "5" : "0"}
                            color="gray.600"
                            fontSize="sm"
                        >
                            {(currentReviewData.likesCount === 1) ? `1 like` : `${currentReviewData.likesCount} likes`}
                        </Box>
                    </Flex>

                    <Box
                        mt="1"
                        fontWeight="semibold"
                        as="h4"
                        lineHeight="tight"
                    >
                        category: {currentReviewData.category.toUpperCase()}
                    </Box>
                    <Box
                        mt="1"
                        fontWeight="semibold"
                        as="h4"
                        lineHeight="tight"
                        isTruncated
                    >
                        Author's assessment: {currentReviewData.authorsRating} of 10
                    </Box>
                    <ReactMarkdown children={currentReviewData.text} />
                    <Box h="4%"></Box>

                    {userData && (currentReviewData.authorId !== userData.userId) &&
                    <HStack>
                        <Box>
                            {Array(5)
                                .fill("")
                                .map((_, i) => (
                                    <StarIcon
                                        key={i}
                                        color={i < localRating  ? "teal.500" : "gray.300"}
                                        onClick={() => {setRatingHandler(i + 1)}}
                                    />
                                ))}
                        </Box>
                        <Button color="currentColor" variant="outline" name="like" onClick={setLikeHandler}>
                            <VisuallyHidden>Like</VisuallyHidden>
                            {isLikeSet ? <AiFillLike /> : <BiLike />}
                        </Button>
                    </HStack>
                    }

                    <NavigateButtons />
                </VStack>
            </VStack>
        </VStack>
    )
}