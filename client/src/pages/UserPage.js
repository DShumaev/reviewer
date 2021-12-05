import {Box, VStack, Flex, Spacer, Select, Input, Button, Heading, useMediaQuery} from '@chakra-ui/react'
import {ReviewCard} from '../components/review/ReviewCard'
import {useContext, useState, useEffect} from 'react'
import {AuthContext} from '../context/AuthContext'
import {useNavigate} from 'react-router-dom'
import {Loader} from '../components/Loader'
import {useHttp} from '../hooks/http.hook'
import {useNotification} from '../hooks/notification.hook'

export const UserPage = () => {

    const {userData} = useContext(AuthContext)
    const [isNotSmallerScreen] = useMediaQuery('(min-width: 600px)')
    const [isNotBigScreen] = useMediaQuery('(min-width: 1250px)')
    const navigate = useNavigate()
    const notification = useNotification()
    const {request, loading, error, clearError} = useHttp()
    const [initialReviewsData, setInitialReviewsData] = useState([])
    const [reviewsData, setReviewsData] = useState(null)
    const [categories, setCategories] = useState(['date', 'firstName', 'lastName', 'rating', 'category'])
    const [filterValue, setFilterValue] = useState('')
    const [filterCategory, setFilterCategory] = useState(null)
    const [sortingCategory, setSortingCategory] = useState(null)

    useEffect(async () => {
        try {
            const data = await request('/review/all_categories')
            if (data.allCategories && (data.allCategories.length > 0)) {
                setCategories([
                    ...data.allCategories
                ])
            }
        } catch (e) {
            console.log('problem with receiving list of categories')
        }
    }, [])

    useEffect(async () => {
        clearError()
        try {
            const data = await request('/review/reviews_for_user', 'GET', null, {Authorization: `Bearer ${userData.token}`})
            if (Array.isArray(data) && data.length === 0) {
                return
            }
            setReviewsData([
                ...data
            ])
            setInitialReviewsData([...data])
        } catch (e) {
            console.log('problem with receiving list of reviews for user')
        }
    }, [])

    const toMainPage = () => {
        navigate('/')
    }

    const toReviewRedactorPage = () => {
        navigate('/review/redactor/new_review')
    }

    const setValueFilterHandler = (e) => {
        if (e.key === 'Enter') {
            setFilterValue(e.target.value.trim())
        }
    }

    const setCategoryFilterHandler = (e) => {
        setFilterCategory(e.target.value)
    }

    useEffect(() => {
        if (!(filterCategory && filterValue)) {
            return
        }
        if (!(reviewsData && Array.isArray(reviewsData) && (reviewsData.length !== 0))) {
            return
        }
        let filteredReviewsData
        if (filterCategory === 'rating') {
            try {
                filteredReviewsData = reviewsData.filter((dataReview) =>
                    Math.round(Number(dataReview[filterCategory])) === Math.round(Number(filterValue)))
            } catch (e) {
                console.log(e)
                return
            }
        } else {
            filteredReviewsData = reviewsData.filter((dataReview) => dataReview[filterCategory] === filterValue)
        }
        setReviewsData([...filteredReviewsData])
    }, [filterValue, filterCategory])

    useEffect(() => {
        if (filterValue && filterCategory) {
            return
        }
        if (initialReviewsData.length === 0) {
            return
        }
        setReviewsData([...initialReviewsData])
    }, [filterValue, filterCategory])

    const setCategorySortingHandler = (e) => {
        setSortingCategory(e.target.value)
    }

    useEffect(() => {
        if (!(reviewsData && Array.isArray(reviewsData) && (reviewsData.length !== 0))) {
            return
        }
        if (!sortingCategory && initialReviewsData.length !== 0) {
            setReviewsData([
                ...initialReviewsData
            ])
            return
        }
        const sortedReviews = [...reviewsData]
        if (sortingCategory === 'rating') {
            sortedReviews.sort((a, b) => {
                return (a[sortingCategory] - b[sortingCategory])
            })
        } else {
            sortedReviews.sort((a, b) => {
                return ((a[sortingCategory] > b[sortingCategory]) ? 1 : ((a[sortingCategory] < b[sortingCategory]) ? -1 : 0))
            })
        }
        setReviewsData([...sortedReviews])
    }, [sortingCategory])

    const deleteReview = async (reviewId) => {
        try {
            const data = await request('/review/delete_review', 'DELETE', {reviewId}, {Authorization: `Bearer ${userData.token}`})
            if (data && data.isDeleted) {
                notification(data.message, 'success')
                const filteredReviewsData = reviewsData.filter((dataReview) => dataReview.reviewId !== reviewId)
                setReviewsData([...filteredReviewsData])
                setInitialReviewsData([...filteredReviewsData])
            }
        } catch (e) {
            notification(e.message)
            return
        }
    }

    if (!reviewsData && loading && !error) {
        return (
            <Loader />
        )
    }
    if (!reviewsData && !loading && error) {
        return (
            <Heading>Sorry, we have some problem with getting data from the server</Heading>
        )
    }

    return (
        <VStack mt="90px">
            <VStack
                spacing={isNotSmallerScreen ? 8 : 2}
                w={isNotBigScreen ? "70%" : "96%"}
                mb="20px"
            >
                <Box
                    p={isNotSmallerScreen ? "5" : "1"}
                    shadow="md"
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    w="inherit"
                >
                    <Flex wrap="wrap">
                        <Button shrink="0" colorScheme="teal" size="md" variant="outline" w="150" onClick={toMainPage}>
                            Home
                        </Button>
                        <Spacer />
                        <Select shrink="0" mr="3" minW="100px" maxW="150px" placeholder="Sort by" onChange={setCategorySortingHandler}>
                            {categories.map((param, index) =>
                                <option key={index} value={param}>
                                    {(param === 'firstName') ? 'author name' : ((param === 'lastName') ? 'author surname' : param)}
                                </option>
                            )}
                        </Select>
                        <Select shrink="0" mr="1" minW="100px" maxW="150px" placeholder="Filter by" onChange={setCategoryFilterHandler}>
                            {categories.map((param, index) =>
                                <option key={index} value={param}>
                                    {(param === 'firstName') ? 'author name' : ((param === 'lastName') ? 'author surname' : param)}
                                </option>
                            )}
                        </Select>
                        <Input mr="3" minW="100px" maxW="200px" placeholder="Enter filter value" onKeyDown={setValueFilterHandler}/>
                        <Button shrink="0" colorScheme="teal" size="md" variant="solid" w="150" onClick={toReviewRedactorPage}>
                            Create new
                        </Button>
                    </Flex>
                </Box>
            </VStack>

            {reviewsData && (reviewsData.length > 0) ?
                <VStack
                    spacing={isNotSmallerScreen ? 8 : 2}
                    w={isNotBigScreen ? "70%" : "96%"}
                >
                    {reviewsData.map((card) => <ReviewCard key={card.reviewId} {...card} deleteReview={deleteReview} />)}
                </VStack>
                :
                (initialReviewsData.length === 0 ? <Heading>There are nothing reviews yet</Heading>
                    :
                    <Heading>There are nothing reviews with applied filters parameter</Heading>)
            }
        </VStack>
    )
}


