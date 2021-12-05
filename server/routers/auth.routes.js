const {Router} = require('express')
const {check} = require('express-validator')
const passport = require('passport')
const authController = require('../controllers/auth.controller')


const router = Router()

router.post(
    '/register',
    [
        check('firstName').not().isEmpty(),
        check('lastName').not().isEmpty(),
        check('email', 'Email incorrect').isEmail(),
        check('password', 'Password cannot contain less 6 characters').isLength({min: 6})
    ],
    authController.register
)

router.post(
    '/login',
    [
        check('email', 'Enter email').normalizeEmail().isEmail(),
        check('password', 'Enter password').exists()
    ],
    authController.login
)

const networks = ['google', 'facebook', 'vkontakte']
networks.forEach(network => {

    router.get(
        `/${network}/login`,
        passport.authenticate(network,{
            scope: 'email'
        }))

    router.get(
        `/${network}/callback`,
        passport.authenticate(network, {
            session: false,
            failureRedirect: '/auth/social-error'
        }),
        authController.socialNetworkLoginSuccessful
    )
})

router.get('/social_network/get_token', authController.sendTokenSocialNetworkAuth)

router.get('/social-error', authController.socialNetworkLoginUnsuccessful)

module.exports = router









