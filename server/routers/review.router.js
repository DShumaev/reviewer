const {Router} = require('express')
const reviewController = require('../controllers/review.controller')
const passport = require('passport')


const router = Router()

router.get('/all_categories', reviewController.getAllReviewCategories)

router.get('/all_tags', reviewController.getAllTags)

router.get('/recent_reviews', reviewController.getRecentReviews)

router.get('/top_rating_reviews', reviewController.getTopRatingReviews)

router.get(
    '/reviews_for_user',
    passport.authenticate('jwt', {session: false}),
    reviewController.getAllReviewsForUser
)

router.get(
    '/current_review/:id',
    reviewController.getReviewData
)

router.post(
    '/save_review',
    passport.authenticate('jwt', {session: false}),
    reviewController.setReviewData
)

router.delete(
    '/delete_review',
    passport.authenticate('jwt', {session: false}),
    reviewController.deleteReview
)

router.put(
    '/update/:reviewId',
    passport.authenticate('jwt', {session: false}),
    reviewController.updateReviewsProperty
)

router.get(
    '/search_by_tag/:tag',
    reviewController.getReviewsByTag
)

router.get (
    '/fts',
    reviewController.getReviewsByFTS
)



module.exports = router