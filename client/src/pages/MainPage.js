import {useEffect, useState} from 'react'
import {useGetToken} from '../hooks/getToken.hook'
import {AuthContext} from '../context/AuthContext'
import {useContext} from 'react'
import {Box, SimpleGrid, Heading, Flex, Tag, Text, useDisclosure} from '@chakra-ui/react'
import {ReviewCard} from '../components/review/ReviewCard'
import {useHttp} from '../hooks/http.hook'
import {SearchModal} from '../components/review/SearchModal'
import {useNotification} from '../hooks/notification.hook'
import {Loader} from '../components/Loader'



export const MainPage = () => {
    const {login} = useContext(AuthContext)
    useGetToken(login)
    const {request: requestTopReview, error: getTopReviewError, loading: loadingTopReview} = useHttp()
    const {request: requestRecentReview, error: getRecentReviewError, loading: loadingRecentReview} = useHttp()
    const {request: requestAllTags, error: getAllTagsError, loading: loadingAllTags} = useHttp()
    const {request} = useHttp()
    const notification = useNotification()
    const [recentReviews, setRecentReviews] = useState(null)
    const [topRatingReviews, setTopRatingReviews] = useState(null)
    const [allTags, setAllTags] = useState(null)
    const {isOpen, onOpen, onClose} = useDisclosure()
    const [reviewsByTag, setReviewsByTag] = useState(null)

    useEffect(async () => {
        try {
            const data = await requestRecentReview('/review/recent_reviews')
            if (!data) {
                return
            } else if (Array.isArray(data) && data.length === 0) {
                return
            }
            setRecentReviews([...data])
        } catch (e) {
            notification('Sorry, unexpected problem with receiving recent reviews', 'info')
        }
    }, [])

    useEffect(async () => {
        try {
            const data = await requestTopReview('/review/top_rating_reviews')
            if (!data) {
                return
            } else if (Array.isArray(data) && data.length === 0) {
                return
            }
            setTopRatingReviews([...data])
        } catch (e) {
            notification('Sorry, unexpected problem with receiving top-rating reviews', 'info')
        }
    }, [])

    useEffect(async () => {
        try {
            const data = await requestAllTags('/review/all_tags')
            if (!data) {
                return
            } else if (Array.isArray(data) && data.length === 0) {
                return
            }
            setAllTags([...data])
        } catch (e) {
        }
    }, [])

    const clickTagHandler = async (e) => {
        if (e.target.getAttribute('name') === 'tag') {
            try {
                const tagsName = e.target.getAttribute('value')
                const data = await request(`/review/search_by_tag/${tagsName}`)
                if (!Array.isArray(data) && !(data.length > 0)) {
                    return
                }
                setReviewsByTag(data)
                onOpen()
            } catch (e) {
                notification('Sorry, unexpected problem with receiving reviews', 'info')
            }
        }
    }


    function displayTags() {
        if (loadingAllTags && !getAllTagsError) {
            return (
                <Loader size='md' top='5%' />
            )
        } else if (allTags) {
            return (
                <Flex wrap="wrap" justify-content="space-around" mt="5px" mb="20px" onClick={clickTagHandler} minH="10%">
                    {allTags && allTags.map((tag, index) =>
                        <Tag shrink="0" mr="3px" mb="3px" size="lg" key={index} variant="solid" colorScheme="teal"
                             name="tag" value={tag} _hover={{background: "teal.700", shadow: "xl"}} cursor="pointer">
                            {tag}
                        </Tag>
                    )}
                </Flex>
            )
        }
    }

    function displayRecentReview() {
        if (loadingRecentReview && !getRecentReviewError) {
            return (
                <Loader size="xl" top="5%" />
            )
        }
        if (!loadingRecentReview && !recentReviews) {
            return (
                <Text textAlign="center">No reviews yet</Text>
            )
        }
        if (recentReviews) {
            return (
                <SimpleGrid columns={[1, null, 2, 3]} spacing="40px" minH="30%">
                    {recentReviews.map((card) => <ReviewCard key={card.reviewId} {...card} />)}
                </SimpleGrid>
            )
        }
    }

    function displayTopReview() {
        if (loadingTopReview && !getTopReviewError) {
            return (
                <Loader size="xl" top="5%" />
            )
        }
        if (!loadingTopReview && !topRatingReviews) {
            return (
                <Text textAlign="center">No reviews yet</Text>
            )
        }
        if (topRatingReviews) {
            return (
                <SimpleGrid mb="20" columns={[1, null, 2, 3]} spacing="40px" minH="30%">
                    {topRatingReviews.map((card) => <ReviewCard key={card.reviewId} {...card} />)}
                </SimpleGrid>
                )
        }
    }

    return (
        <Box m="90px 5% 5% 5%" w="90%" justifyContent="center">
            {displayTags()}
            <Heading mb="20px" size="lg" textAlign="center">
                Recent reviews
            </Heading>
            {displayRecentReview()}
            <Heading mt="40px" mb="20px" size="lg" textAlign="center">
                Top-rated reviews
            </Heading>
            {displayTopReview()}
            <SearchModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} loadedData={reviewsByTag}/>
        </Box>
    )
}