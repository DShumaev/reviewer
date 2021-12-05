import {createContext} from 'react'


export const CurrentReviewContext = createContext({
    reviewId: null,
    userId: null,  // user = author
    title: '',
    text: '',
    rating: null,
    ratingCount: null,
    likesCount: null,
    group: '',
    tags: [],
    images: [],
    authorsRating: null,
})








