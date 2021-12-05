const Sequelize = require('sequelize')
const {Op} = require('sequelize')
const createUserModel = require('./models/User')
const createReviewModel = require('./models/Review')
const createCommentModel = require('./models/Comment')
const createTagModel = require('./models/Tag')
const createReviewsTagsModel = require('./models/ReviewsTags')
const createCategoryReviewsModel = require('./models/ReviewsCategory')
const config = require('config')
const bcrypt = require('bcrypt')

let sequelize = null

if (config.get('isProduction')) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    })
} else {
    sequelize = new Sequelize(config.get('db.dbName'), config.get('db.userName'), config.get('db.password'), {
        dialect: 'postgres',
        host: config.get('db.dbURL')
    })
}

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.')
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err)
    })

const User = createUserModel(sequelize)
const Review = createReviewModel(sequelize)
const Comment = createCommentModel(sequelize)
const Tag = createTagModel(sequelize)
const ReviewsTags = createReviewsTagsModel(sequelize)
const ReviewsCategory = createCategoryReviewsModel(sequelize)

Review.belongsToMany(Tag, {through: ReviewsTags})
Tag.belongsToMany(Review, {through: ReviewsTags})

Review.belongsTo(User, {
    foreignKey: {
        name: 'authorId',
        allowNull: false
    },
    targetKey: 'id'
})

User.hasMany(Review, {
    foreignKey: {
        name: 'authorId',
        allowNull: false
    }
})

Review.belongsTo(ReviewsCategory, {
    foreignKey: {
        name: 'categoryId',
        allowNull: false
    },
    targetKey: 'id',
    as: 'Category'
})

ReviewsCategory.hasMany(Review, {
    foreignKey: {
        name: 'categoryId',
        allowNull: false
    },
    as: 'Review'
})

Comment.belongsTo(User, {
    foreignKey: {
        name: 'authorId',
        allowNull: false
    },
    targetKey: 'id'
})

User.hasMany(Comment, {
    foreignKey: {
        name: 'authorId',
        allowNull: false
    }
})

Comment.belongsTo(Review, {
    foreignKey: {
        name: 'reviewId',
        allowNull: false
    },
    targetKey: 'id'
})

Review.hasMany(Comment, {
    foreignKey: {
        name: 'reviewId',
        allowNull: false
    }
})


sequelize.sync({alter: true})  // {alter: true}{force: true}
    .then(console.log("All models were synchronized successfully."))
    .catch(console.log("Problem with synchronization models"))


async function createAdmin() {
    const hashedPassword = await bcrypt.hash(config.get('admin.password'), config.get('salt'))
    await User.create({
        firstName: config.get('admin.firstName'),
        lastName: config.get('admin.lastName'),
        email: config.get('admin.email'),
        role: 'admin',
        typeAuth: 'mail/password',
        password: hashedPassword
    })
}

const defaultCategoriesList = ['film', 'music', 'travel', 'animal', 'car']

async function createCategory(categoriesName) {
    ReviewsCategory.create({
        text: categoriesName
    })
}

defaultCategoriesList.forEach( async (name) => {
    await createCategory(name)
})

createAdmin()
    .then(() => {console.log('Admin created')})
    .catch(console.log('Problem in process creating account of Administrator'))




class Postgres {

    checkUserInDatabase(email) {
        return User.findOne({where: {email}})
    }

    getUserFromDatabase(email) {
        return User.findOne({where: {email}})
    }

    async createNewUser(email, hashedPassword, firstName, lastName, typeAuth, role = 'user') {
        try {
            const user = await User.create({
                firstName,
                lastName,
                email,
                role,
                typeAuth,
                password: hashedPassword,
                userFTS: sequelize.fn('to_tsvector', firstName + ' ' + lastName)
            })
            return user
        } catch (e) {
            return false
        }
    }

    async getAllTags() {
        try {
            const allTagsData = await Tag.findAll()
            if (!allTagsData) {
                return false
            } else if (Array.isArray(allTagsData) && allTagsData.length === 0) {
                return allTagsData
            }
            const allTags = []
            for (let i = 0; i < allTagsData.length; i++) {
                allTags[i] = allTagsData[i].dataValues.text
            }
            return allTags
        } catch (e) {
            return false
        }
    }

    async getAllReviewCategories() {
        try {
            const allCategoriesData = await ReviewsCategory.findAll({
                attributes: ['text']
            })
            if (!allCategoriesData) {
                return false
            } else if (Array.isArray(allCategoriesData) && allCategoriesData.length === 0) {
                return allCategoriesData
            }
            const allCategories = []
            for (let i = 0; i < allCategoriesData.length; i++) {
                allCategories[i] = allCategoriesData[i].dataValues.text
            }
            return allCategories
        } catch (e) {
            return false
        }
    }

    isNewMessage(date) {
        let currentDate = new Date()
        date = date.toString().slice(0, 10)
        currentDate = currentDate.toString().slice(0, 10)
        if (date === currentDate) {
            return true
        } else {
            return false
        }
    }

    async getRecentReviews() {
        try {
            const reviewsData = await Review.findAll({
                include: [{
                    model: User,
                    attributes: ['firstName', 'lastName']
                }, {
                    model: ReviewsCategory,
                    attributes: ['text'],
                    as: 'Category'
                }, {
                    model: Tag,
                    attributes: ['text']
                }],
                order: [['createdAt', 'DESC']],
                limit: 6
            })
            if (!reviewsData) {
                return false
            } else if (Array.isArray(reviewsData) && reviewsData.length === 0) {
                return reviewsData
            }
            const reviews = []
            for (let i = 0; i < reviewsData.length; i++) {
                reviews[i] = {
                    reviewId: reviewsData[i].dataValues.id,
                    authorId: reviewsData[i].dataValues.authorId,
                    title: reviewsData[i].dataValues.title,
                    text: reviewsData[i].dataValues.text,
                    category: reviewsData[i].dataValues.Category.dataValues.text,
                    likesCount: reviewsData[i].dataValues.likesCount,
                    rating: reviewsData[i].dataValues.rating,
                    ratingCount: reviewsData[i].dataValues.ratingCount,
                    date: String(reviewsData[i].dataValues.createdAt).slice(0, 21),
                    author: reviewsData[i].dataValues.User.dataValues.firstName + ' ' + reviewsData[i].dataValues.User.dataValues.lastName,
                    tags: '',
                    new: this.isNewMessage(reviewsData[i].dataValues.createdAt)
                    }
            }
            return reviews
        } catch (e) {
            return false
        }
    }

    async getReviewsWithTopRating() {
        try {
            const reviewsData = await Review.findAll({
                include: [{
                    model: User,
                    attributes: ['firstName', 'lastName']
                }, {
                    model: ReviewsCategory,
                    attributes: ['text'],
                    as: 'Category'
                }, {
                    model: Tag,
                    attributes: ['text']
                }],
                order: [['rating', 'ASC']],
                limit: 6
            })
            if (!reviewsData) {
                return false
            } else if (Array.isArray(reviewsData) && reviewsData.length === 0) {
                return reviewsData
            }
            const reviews = []
            for (let i = 0; i < reviewsData.length; i++) {
                reviews[i] = {
                    reviewId: reviewsData[i].dataValues.id,
                    authorId: reviewsData[i].dataValues.authorId,
                    title: reviewsData[i].dataValues.title,
                    text: reviewsData[i].dataValues.text,
                    category: reviewsData[i].dataValues.Category.dataValues.text,
                    likesCount: reviewsData[i].dataValues.likesCount,
                    rating: reviewsData[i].dataValues.rating,
                    ratingCount: reviewsData[i].dataValues.ratingCount,
                    date: String(reviewsData[i].dataValues.createdAt).slice(0, 21),
                    author: reviewsData[i].dataValues.User.dataValues.firstName + ' ' + reviewsData[i].dataValues.User.dataValues.lastName,
                    tags: '',
                    new: this.isNewMessage(reviewsData[i].dataValues.createdAt)
                }
            }
            return reviews
        } catch (e) {
            return false
        }
    }

    async getAllReviewsForUser(userId) {
        try {
            const dataReviews = await Review.findAll({
                where: {
                    authorId: userId
                },
                include: [{
                        model: User,
                        attributes: ['firstName', 'lastName']
                }, {
                    model: ReviewsCategory,
                    attributes: ['text'],
                    as: 'Category'
                }]
            })
            if (dataReviews && dataReviews.length === 0) {
                return dataReviews
            }
            const reviews = []
            for (let i = 0; i < dataReviews.length; i++) {
                reviews[i] = {
                    reviewId: dataReviews[i].dataValues.id,
                    authorId: dataReviews[i].dataValues.authorId,
                    title: dataReviews[i].dataValues.title,
                    text: dataReviews[i].dataValues.text,
                    category: dataReviews[i].dataValues.Category.dataValues.text,
                    likesCount: dataReviews[i].dataValues.likesCount,
                    rating: dataReviews[i].dataValues.rating,
                    ratingCount: dataReviews[i].dataValues.ratingCount,
                    date: String(dataReviews[i].dataValues.createdAt).slice(0, 21),
                    firstName: dataReviews[i].dataValues.User.dataValues.firstName,
                    lastName: dataReviews[i].dataValues.User.dataValues.lastName,
                    author: dataReviews[i].dataValues.User.dataValues.firstName + ' ' + dataReviews[i].dataValues.User.dataValues.lastName
                }
            }
            return reviews
        } catch (e) {
            return false
        }
    }

    async getAllReviewsForAdmin() {
        try {
            const dataReviews = await Review.findAll({
                include: [{
                    model: User,
                    attributes: ['firstName', 'lastName']
                }, {
                    model: ReviewsCategory,
                    attributes: ['text'],
                    as: 'Category'
                }]
            })
            if (dataReviews && dataReviews.length === 0) {
                return dataReviews
            }
            const reviews = []
            for (let i = 0; i < dataReviews.length; i++) {
                reviews[i] = {
                    reviewId: dataReviews[i].dataValues.id,
                    authorId: dataReviews[i].dataValues.authorId,
                    title: dataReviews[i].dataValues.title,
                    text: dataReviews[i].dataValues.text,
                    category: dataReviews[i].dataValues.Category.dataValues.text,
                    likesCount: dataReviews[i].dataValues.likesCount,
                    rating: dataReviews[i].dataValues.rating,
                    ratingCount: dataReviews[i].dataValues.ratingCount,
                    date: String(dataReviews[i].dataValues.createdAt).slice(0, 21),
                    firstName: dataReviews[i].dataValues.User.dataValues.firstName,
                    lastName: dataReviews[i].dataValues.User.dataValues.lastName,
                    author: dataReviews[i].dataValues.User.dataValues.firstName + ' ' + dataReviews[i].dataValues.User.dataValues.lastName
                }
            }
            return reviews
        } catch (e) {
            return false
        }
    }

    createTagsArray(tagsData) {
        return tagsData.map((tagData) => tagData.dataValues.text)
    }

    async getReviewData(reviewId) {
        try {
            const dataReview = await Review.findOne({
                where: {
                    id: reviewId
                },
                include: [{
                    model: User,
                    attributes: ['firstName', 'lastName']
                }, {
                    model: ReviewsCategory,
                    attributes: ['text'],
                    as: 'Category'
                }, {
                    model: Tag,
                    attributes: ['text']
                }]
            })
            if (!dataReview) {
                return false
            }
            const review = {
                reviewId: dataReview.dataValues.id,
                authorId: dataReview.dataValues.authorId,
                title: dataReview.dataValues.title,
                text: dataReview.dataValues.text,
                category: dataReview.dataValues.Category.dataValues.text,
                likesCount: dataReview.dataValues.likesCount,
                rating: dataReview.dataValues.rating,
                ratingCount: dataReview.dataValues.ratingCount,
                date: String(dataReview.dataValues.createdAt).slice(0, 21),
                author: dataReview.dataValues.User.dataValues.firstName + ' ' + dataReview.dataValues.User.dataValues.lastName,
                images: dataReview.dataValues.User.dataValues.picture,
                authorsRating: dataReview.dataValues.authorsRating,
                tags: this.createTagsArray(dataReview.dataValues.Tags)
            }
            return review
        } catch (e) {
            return false
        }
    }

    async createReview(authorId, title, text, rating, ratingCount, likesCount, category, images, authorsRating) {
        try {
            if (Array.isArray(images)) {
                images = JSON.stringify(images)
            }
            const categoryData = await ReviewsCategory.findOrCreate({
                where: {
                    text: category
                }
            })
            const review = await Review.create({
                title,
                text,
                categoryId: categoryData[0].dataValues.id,
                picture: images,
                likesCount,
                rating,
                ratingCount,
                authorsRating,
                authorId,
                reviewFTS: sequelize.fn('to_tsvector', title + ' ' + text)
            })
            if (!review) {
                return false
            }
            return review
        } catch (e) {
            console.log(e)
            return false
        }
    }

    async createTag(tagText) {
        try {
            const tagData = await Tag.findOrCreate( {
                where: {
                    text: tagText,
                    textFTS: sequelize.fn('to_tsvector', tagText)
                }
            })
            return tagData[0]
        } catch (e) {
            console.log(e)
            return false
        }
    }

    async bindingReviewWithTag(review, tag) {
        try {
            if (!review && !tag) {
                return
            }
            await ReviewsTags.create({
                ReviewId: review.dataValues.id,
                TagId: tag.dataValues.id
            })
        } catch (e) {
            console.log(e)
        }
    }

    async deleteReview(reviewId) {
        try {
            const deletedReview = await Review.destroy({
                where: {
                    id: reviewId
                }
            })
            return deletedReview
        } catch (e) {
            console.log(e)
            return false
        }
    }

    async updateReview(reviewId, reviewProperties) {
        try {
            const properties = Object.entries(reviewProperties)
            let count = 0
            for (const [key, value] of properties) {
                if (key !== 'tags') {
                    const updated = await Review.update({[key]: value}, {
                        where: {
                            id: reviewId
                        }
                    })
                    if (updated) {
                        count++
                    }
                } else {
                    value.forEach(async (tag) => {
                        try {
                            const tagData = await Tag.findOrCreate({
                                where: {
                                    text: tag
                                }
                            })
                            if (tagData[1]) {
                                await ReviewsTags.create({
                                    ReviewId: reviewId,
                                    TagId: tagData[0].dataValues.id
                                })
                            }
                        } catch (e) {
                            console.log('Problem with adding new tag (update review operation)')
                        }
                    })
                    count++
                }
            }
            if (count === Object.keys(reviewProperties).length) {
                return true
            } else {
                return false
            }
        } catch (e) {
            console.log(e)
            return false
        }
    }

    async getReviewsByTag(tagValue) {
        try {
            const tagsData = await Tag.findOne({
                where: {
                    text: tagValue
                },
                include: [{
                    model: Review,
                    include: [{
                        model: User,
                        attributes: ['firstName', 'lastName']
                    }, {
                        model: ReviewsCategory,
                        attributes: ['text'],
                        as: 'Category'
                    }]
                }]
            })
            if (Array.isArray(tagsData.Reviews) && tagsData.Reviews.length === 0) {
                return []
            }
            const reviews = []
            for (let i = 0; i < tagsData.Reviews.length; i++) {
                reviews[i] = {
                    reviewId: tagsData.Reviews[i].dataValues.id,
                    authorId: tagsData.Reviews[i].dataValues.authorId,
                    title: tagsData.Reviews[i].dataValues.title,
                    text: tagsData.Reviews[i].dataValues.text,
                    category: tagsData.Reviews[i].dataValues.Category.dataValues.text,
                    likesCount: tagsData.Reviews[i].dataValues.likesCount,
                    rating: tagsData.Reviews[i].dataValues.rating,
                    ratingCount: tagsData.Reviews[i].dataValues.ratingCount,
                    date: String(tagsData.Reviews[i].dataValues.createdAt).slice(0, 11),
                    author: tagsData.Reviews[i].dataValues.User.dataValues.firstName + ' ' + tagsData.Reviews[i].dataValues.User.dataValues.lastName
                }
            }
            return reviews
        } catch (e) {
            console.log(e)
            return false
        }
    }

    async getReviewsByFTS(searchString) {
        try {
            const reviewsId = new Set()
            let dataReviews = await Review.findAll({
                where: {
                    reviewFTS: {[Op.match]: sequelize.fn('to_tsquery', searchString)}
                },
                attributes: ['id']
            })
            for (let i = 0; i < dataReviews.length; i++) {
                reviewsId.add(dataReviews[i].dataValues.id)
            }
            const dataTags = await Tag.findOne({
                where: {
                    textFTS: {[Op.match]: sequelize.fn('to_tsquery', searchString)}
                },
                include: [{
                    model: Review,
                    attributes: ['id']
                }]
            })
            if (dataTags && Array.isArray(dataTags.Reviews)) {
                for (let i = 0; i < dataTags.Reviews.length; i++) {
                    reviewsId.add(dataTags.Reviews[i].dataValues.id)
                }
            } else if (dataTags) {
                reviewsId.add(dataTags.Reviews.dataValues.id)
            }
            const dataCategory = await Tag.findOne({
                where: {
                    textFTS: {[Op.match]: sequelize.fn('to_tsquery', searchString)}
                },
                include: [{
                    model: Review,
                    attributes: ['id']
                }]
            })
            if (dataCategory && Array.isArray(dataCategory.Reviews)) {
                for (let i = 0; i < dataCategory.Reviews.length; i++) {
                    reviewsId.add(dataCategory.Reviews[i].dataValues.id)
                }
            } else if (dataCategory) {
                reviewsId.add(dataCategory.Reviews.dataValues.id)
            }
            const dataUser = await User.findOne({
                where: {
                    userFTS: {[Op.match]: sequelize.fn('to_tsquery', searchString)}
                },
                include: [{
                    model: Review,
                    attributes: ['id']
                }]
            })
            if (dataUser && Array.isArray(dataUser.Reviews)) {
                for (let i = 0; i < dataUser.Reviews.length; i++) {
                    reviewsId.add(dataUser.Reviews[i].dataValues.id)
                }
            } else if (dataUser) {
                reviewsId.add(dataUser.Reviews.dataValues.id)
            }
            if (reviewsId.size === 0) {
                return []
            }
            const dataReviewsAll = await Review.findAll({
                where: {
                    id: {[Op.in]: Array.from(reviewsId)}
                },
                include: [{
                    model: User,
                    attributes: ['firstName', 'lastName']
                }, {
                    model: ReviewsCategory,
                    attributes: ['text'],
                    as: 'Category'
                }]
            })
            const reviews = []
            for (let i = 0; i < dataReviewsAll.length; i++) {
                reviews[i] = {
                    reviewId: dataReviewsAll[i].dataValues.id,
                    authorId: dataReviewsAll[i].dataValues.authorId,
                    title: dataReviewsAll[i].dataValues.title,
                    text: dataReviewsAll[i].dataValues.text,
                    category: dataReviewsAll[i].dataValues.Category.dataValues.text,
                    likesCount: dataReviewsAll[i].dataValues.likesCount,
                    rating: dataReviewsAll[i].dataValues.rating,
                    ratingCount: dataReviewsAll[i].dataValues.ratingCount,
                    date: String(dataReviewsAll[i].dataValues.createdAt).slice(0, 21),
                    author: dataReviewsAll[i].dataValues.User.dataValues.firstName + ' ' + dataReviewsAll[i].dataValues.User.dataValues.lastName
                }
            }
            return reviews
        } catch (e) {
            return false
        }
    }
}

module.exports = new Postgres()