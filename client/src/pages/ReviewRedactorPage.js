import {Box, Button, Input, Select, Spacer, Text, VStack, HStack, Textarea, NumberInput, NumberInputField,
    NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, useDisclosure, useMediaQuery} from '@chakra-ui/react'
import {useState, useEffect, useContext} from 'react'
import {useNotification} from '../hooks/notification.hook'
import {useParams} from 'react-router-dom'
import {useHttp} from '../hooks/http.hook'
import {CurrentReviewContext} from '../context/CurrentReviewContext'
import {AuthContext} from '../context/AuthContext'
import {NavigateButtons} from '../components/review/NavigateButtons'
import {PreviewModal} from '../components/review/PreviewModal'


export const ReviewRedactorPage = () => {

    const [isNotSmallerScreen] = useMediaQuery('(min-width: 600px)')
    const [isNotBigScreen] = useMediaQuery('(min-width: 1250px)')
    const notification = useNotification()
    const {currentReviewData, setCurrentReviewState, sendCurrentReviewState, requestCurrentReviewState,
        setDefaultCurrentReviewState} = useContext(CurrentReviewContext)
    const {userData} = useContext(AuthContext)
    const {id} = useParams()
    const {request} = useHttp()
    const {isOpen, onOpen, onClose} = useDisclosure()
    const [reviewsCategory, setReviewsCategory] = useState(['film', 'music', 'travel', 'animal', 'car'])
    const [newCategory, setNewCategory] = useState('')
    const [tagsLocal, setTagsLocal] = useState(() => currentReviewData.tags.join(', '))
    const [initialCurrentReviewData, setInitialCurrentReviewData] = useState(null)

    useEffect(() => {
        if (id && (id === 'new_review')) {
            setDefaultCurrentReviewState()
            setTagsLocal(() => '')
            } else if (id) {
                requestCurrentReviewState(id)
            }
        }, [])

    useEffect(() => {
        if (currentReviewData && currentReviewData.reviewId) {
            setInitialCurrentReviewData({...currentReviewData})
        }
    }, [])

    useEffect(() => {
        if (currentReviewData.authorId || !userData) {
            return
        }
        setCurrentReviewState({
            ...currentReviewData,
            authorId: userData.userId
            })
    }, [currentReviewData.title])

    useEffect(async () => {
        try {
            let allCategories = await request('/review/all_categories')
            if (allCategories && (allCategories.length > 0)) {
                setReviewsCategory([
                    ...allCategories
                ])
            }
        } catch (e) {
            console.log(e)
        }
    }, [])

    const inputNewCategoryHandler = (e) => {
        setNewCategory(e.target.value.trim().toLowerCase())
    }

    const addNewCategoryHandler = () => {
        if (newCategory.length > 15)
        {
            notification('entered value of category exceeds limit (15 letters)', 'info')
            return
        }
        setReviewsCategory([
            ...reviewsCategory,
            newCategory
        ])
        setNewCategory('')
    }

    const createReviewHandler = async () => {
        if (!currentReviewData.reviewId) {     // Create new review block
            try {
                if (currentReviewData.title && currentReviewData.text &&
                    currentReviewData.category && currentReviewData.authorsRating) {
                    const isOk = await sendCurrentReviewState({Authorization: `Bearer ${userData.token}`})
                    if (isOk) {
                        notification('Review created successfully', 'success')
                        setDefaultCurrentReviewState()
                        setTagsLocal('')
                    } else {
                        notification('Sorry, review not created. Please try again', 'info')
                    }
                } else {
                    notification('Fill all fields', 'info')
                }
            } catch (e) {
                notification('Sorry, review is not created. Please try again', 'info')
            }
        } else {       // Change existing review block
            let changedReviewsData = {}
            Object.keys(currentReviewData).forEach((property) => {
                if ((currentReviewData[property]) !== initialCurrentReviewData[property]) {
                    changedReviewsData[property] = currentReviewData[property]
                }
            })
            if (Object.keys(changedReviewsData).length === 0) {
                return
            }
            try {
                const isOk = await request(
                    `/review/update/${currentReviewData.reviewId}`,
                    'PUT',
                    changedReviewsData,
                    {Authorization: `Bearer ${userData.token}`})
                if (isOk) {
                    notification('Review changed successfully', 'success')
                    setDefaultCurrentReviewState()
                    setTagsLocal('')
                } else {
                    notification('Sorry, review is not changed. Please try again', 'info')
                }
            } catch (e) {
                notification('Sorry, review is not changed. Please try again', 'info')
            }
        }
    }

    const changeTitleHandler = (e) => {
        if (e.target.value.length > 100) {
            notification('review title is too long (limit 100 character)', 'info')
            return
        }
        setCurrentReviewState({
            ...currentReviewData,
            title: e.target.value
        })
    }

    const changeAuthorRatingHandler = (rating) => {
        let authorsRating
        try {
            authorsRating = Number(rating)
        } catch (e) {
            notification('this field can only be numeric ', 'info')
            return
        }
        if (!((authorsRating >= 1) && (authorsRating <= 10))) {
            notification('the score can take a value in the range from 1 to 10', 'info')
            return
        }
        setCurrentReviewState({
            ...currentReviewData,
            authorsRating
        })
    }

    const changeTagsHandler = (e) => {
        setTagsLocal(e.target.value)
        const tags = e.target.value.trim().split(',')
        tags.forEach((tag) => tag.trim())
        setCurrentReviewState({
            ...currentReviewData,
            tags: tags
        })
    }

    const changeTextHandler = (e) => {
        if (e.target.value.length > 10000) {
            notification('review title is too long (limit 10000 character)', 'info')
            return
        }
        setCurrentReviewState({
            ...currentReviewData,
            text: e.target.value
        })
    }

    const setCategoryHandler = (e) => {
        if (!e.target.value) {
            return
        }
        setCurrentReviewState({
            ...currentReviewData,
            category: e.target.value
        })
    }

    const openPreviewHandler = () => {
        onOpen()
    }

    return (
        <VStack mt="100px" spacing="5px">
            <VStack w={isNotBigScreen ? "70%" : "96%"}>
                <Box
                    p={isNotSmallerScreen ? "5" : "1"}
                    shadow="md"
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    w="inherit"
                    color="gray.500"
                    fontWeight="semibold"
                    letterSpacing="wide"
                    fontSize="md"
                >
                    <VStack alignItems="space-between">
                        <HStack justifyContent="start">
                            <Text flexBasis="200px">
                                Title of review
                            </Text>
                            <Input value={currentReviewData.title} name="title" onChange={changeTitleHandler} />
                        </HStack>
                        <HStack>
                            <Text flexBasis="200px">Tags</Text>
                            <Input
                                value={tagsLocal}
                                name="tags"
                                onChange={changeTagsHandler}
                                placeholder="words or expressions separated by commas"
                            />
                        </HStack>
                        <HStack>
                            <Text flexBasis="200px">Author's rating</Text>
                            <NumberInput
                                defaultValue={5}
                                min={1}
                                max={10}
                                value={currentReviewData.authorsRating}
                                name="authorsRating"
                                onChange={changeAuthorRatingHandler}
                                flexBasis="200px"
                            >
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                            <Spacer />
                        </HStack>
                        <HStack wrap="wrap">
                            <Text flexBasis="200px" mr="0">Сategory</Text>
                            <Select placeholder="none" flexBasis="200px" onChange={setCategoryHandler}>
                                {reviewsCategory.map((param, index) =>
                                    <option key={index} value="param" value={param}>
                                        {param}
                                    </option>
                                )}
                            </Select>
                            <Spacer />
                            <HStack>
                                <Text flexBasis="160px">or add new category:</Text>
                                <Input name="newCategory" placeholder="new category" flexBasis="200px" value={newCategory} onChange={inputNewCategoryHandler} />
                                <Button colorScheme="teal" size="md" variant="solid" w="150px" onClick={addNewCategoryHandler}>Add</Button>
                            </HStack>
                        </HStack>
                        <HStack>
                            <Spacer />
                            <Button colorScheme="teal" size="md" variant="solid" w="150px" onClick={openPreviewHandler}>View mode</Button>
                            <Button colorScheme="teal" size="md" variant="solid" w="150px" onClick={createReviewHandler}>
                                {currentReviewData.reviewId ? 'Save review' : 'Create review'}
                            </Button>
                        </HStack>

                    </VStack>
                </Box>
            </VStack>

            <VStack w={isNotBigScreen ? "70%" : "96%"}>
                <Box
                    p={isNotSmallerScreen ? "5" : "1"}
                    shadow="md"
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    w="inherit"
                >
                    <VStack alignItems="start">
                        <Text color="gray.500" fontWeight="semibold" letterSpacing="wide" fontSize="md">
                            You can write your review here (markdown apply)
                        </Text>
                        <Textarea
                            placeholder="Here may be the text of your review (limit 10000 characters)"
                            size="sm"
                            resize="none"
                            minH="25rem"
                            name="text"
                            value={currentReviewData.text}
                            onChange={changeTextHandler}
                        />
                    </VStack>
                </Box>
                <NavigateButtons />
            </VStack>
            <PreviewModal isOpen={isOpen} onOpen={onOpen} onClose={onClose}/>
        </VStack>
    )
}