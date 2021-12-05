import {useState, useCallback, useEffect} from 'react'
import {useHttp} from './http.hook'


export const useCurrentReviewState = () => {

    const {request} = useHttp()
    const initialState = {
        reviewId: null,    // default = null
        authorId: null,    // user = author
        title: '',
        text: '',
        rating: null,      // default = null
        ratingCount: 0,    // default = 0
        likesCount: 0,     // default val
        category: '',
        tags: [],          // default val = []
        images: [],        //  default val = []
        authorsRating: 1,  // default val = 1
    }

    const [currentReviewData, setCurrentReviewData] = useState(initialState)

    const requestCurrentReviewState = useCallback(async (reviewId) => {
        try {
            const newState = await request(`/review/current_review/${reviewId}`)
            setCurrentReviewData({
                ...newState
            })
        } catch (e) {
            console.log('Problem with getting data of selected review from server')
        }
    }, [])

    const setCurrentReviewState = useCallback((changedState) => {
        setCurrentReviewData({
            ...changedState
        })
    }, [])

    const setDefaultCurrentReviewState = useCallback(() => {
        setCurrentReviewData({
            ...initialState
        })
    }, [currentReviewData])

    const sendCurrentReviewState = useCallback(async (headers) => {
        try {
            const response = await request('/review/save_review', 'POST', {...currentReviewData}, headers)
            if (response && response.message) {
                setCurrentReviewData({...initialState})
                return true
            }
        } catch (e) {
            return false
        }
    }, [currentReviewData])

    return {currentReviewData, requestCurrentReviewState, setCurrentReviewState, sendCurrentReviewState, setDefaultCurrentReviewState}
}