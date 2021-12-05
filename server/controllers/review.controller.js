const database = require('../database/postgres')


function checkRequestParams(request, response, param = 'id') {
    let paramValue = null
    try {
        paramValue = request.params[param]
        if (!paramValue) {
            response.status(500).json({
                message: 'Incorrect data from user'
            })
            return false
        }
        return paramValue
    } catch (e) {
        return false
    }
}


class ReviewController {

    async getAllReviewCategories(req, res) {
        const review = await database.getAllReviewCategories()
        if (!review) {
            res.status(500).json({message: 'database error'})
        }
        res.status(200).json(review)
    }

    async getAllTags(req, res) {
        const tags = await database.getAllTags()
        if (!tags) {
            res.status(500).json({message: 'database error'})
        }
        res.status(200).json(tags)
    }

    async getRecentReviews(req, res) {
        const review = await database.getRecentReviews()
        if (!review) {
            res.status(500).json({message: 'database error'})
        }
        res.status(200).json(review)
    }

    async getTopRatingReviews(req, res) {
        const review = await database.getReviewsWithTopRating()
        if (!review) {
            res.status(500).json({message: 'database error'})
        }
        res.status(200).json(review)
    }

    async getAllReviewsForUser(req, res) {
        const userId = req.user.userId
        const userRole = req.user.userRole
        if (!userId && !userRole) {
            res.status(400).json({message: 'incorrect data from user'})
            return
        }
        let reviews = null
        if (userRole === 'user') {
            reviews = await database.getAllReviewsForUser(userId)
        } else if (userRole === 'admin') {
            reviews = await database.getAllReviewsForAdmin()
        }
        if (Array.isArray(reviews) && reviews.length === 0) {
            res.status(200).json({message: 'User has not reviews yet'})
            return
        } else if (!reviews) {
            res.status(500).json({message: 'database error'})
            return
        }
        res.status(200).json(reviews)
    }

    async setReviewData(req, res) {
        const {reviewId, authorId, title, text, rating, ratingCount, likesCount, category, tags, images, authorsRating} = req.body
        if (!reviewId) {
            try {
                if (!authorId) {
                    res.status(400).json({
                        message: 'Incorrect data from user'
                    })
                    return
                }
                const createdReview = await database.createReview(authorId, title, text, rating, ratingCount, likesCount, category, images, authorsRating)
                if (!createdReview) {
                    res.status(501).json({
                        message: 'Sorry, failed to save review (server error)'
                    })
                    return
                }
                if (tags && Array.isArray(tags) && (tags.length > 0)) {
                    for (let tag of tags) {
                        if (!tag) {
                            continue
                        }
                        const createdTag = await database.createTag(tag)
                        if (!createdTag) {
                            continue
                        }
                        await database.bindingReviewWithTag(createdReview, createdTag)
                    }
                }
                res.status(200).json({
                    message: 'Review created successfully'
                })
            } catch (e) {
                res.status(500).json({
                    message: 'Sorry, failed to save review (server error)'
                })
            }
        }
    }

    async getReviewData(req, res) {
        const reviewId = Number(req.params.id)
        if (!reviewId) {
            res.status(400)
        }
        const review = await database.getReviewData(reviewId)
        if (!review) {
            res.status(500)
        }
        res.status(200).json(review)
    }

    async deleteReview(req, res) {
        try {
            if (req.body && !Object.keys(req.body).includes('reviewId')) {
                res.status(500).json({
                    isDeleted: false,
                    message: 'Incorrect data from user'
                })
                return
            }
            const {reviewId} = req.body
            if (!reviewId) {
                res.status(400).json({message: 'Incorrect data from user'})
                return
            }
            const review = await database.deleteReview(reviewId)
            if (!review) {
                res.status(500).json({
                    isDeleted: false,
                    message: 'Database error'
                })
                return
            }
            res.status(200).json({
                isDeleted: true,
                message: 'Review was successfully deleted'
            })
        } catch (e) {
            res.status(500).json({
                isDeleted: false,
                message: 'Unexpected server error'
            })
        }
    }

    async updateReviewsProperty(req, res) {
        try {
            const reviewId = req.params.reviewId
            if (!reviewId) {
                res.status(500).json({
                    isUpdated: false,
                    message: 'Incorrect data from user'
                })
                return
            }
            const reviewProperties = req.body
            if (req.body && Object.keys(reviewProperties).length === 0) {
                res.status(500).json({
                    isUpdated: false,
                    message: 'Incorrect data from user'
                })
                return
            }
            const isUpdated = await database.updateReview(reviewId, reviewProperties)
            if (!isUpdated) {
                res.status(500).json({
                    isUpdated: false,
                    message: 'Database error'
                })
                return
            }
            res.status(200).json({
                isUpdated: true,
                message: 'Review was successfully changed'
            })
        } catch (e) {
            res.status(500).json({
                isUpdated: false,
                message: 'Unexpected server error'
            })
        }
    }

    async getReviewsByTag(req, res) {
        try {
            const tag = checkRequestParams(req, res, 'tag')
            if (!tag)
            {
                return
            }
            const reviews = await database.getReviewsByTag(tag)
            if (!reviews) {
                res.status(500).json({message: 'Database error'})
                return
            }
            res.status(200).json(reviews)
        } catch (e) {
            res.status(500).json({message: 'Unexpected server error'})
        }
    }

    async getReviewsByFTS(req, res) {
        try {
            if (!(req.query && Object.keys(req.query).includes('query_string'))) {
                res.status(500).json({
                    isDeleted: false,
                    message: 'Incorrect data from user'
                })
                return
            }
            const searchString = req.query['query_string']
            const reviews = await database.getReviewsByFTS(searchString)
            if (!reviews) {
                res.status(500).json({message: 'Database error'})
                return
            }
            res.status(200).json(reviews)
        } catch (e) {
            res.status(500).json({message: 'Unexpected server error'})
        }
    }
}


module.exports = new ReviewController()
