const database = require('../database/postgres')
const bcrypt = require('bcrypt')
const {validationResult} = require('express-validator')
const config = require('config')
const getToken = require('../token')


const socialUserAuth = {
    token: null,
    userId: null,
    firstName: null,
    lastName: null,
    role: null,
}

class authController {

    async register(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect registration information'
                })
            }
            const {email, password, firstName, lastName} = req.body
            const candidate = await database.checkUserInDatabase(email)
            if (candidate) {
                return res.status(400).json({message: 'User with this name created already'})
            }
            const hashedPassword = await bcrypt.hash(password, config.get('salt'))
            const typeAuth = 'login/pswd'
            const user = await database.createNewUser(email, hashedPassword, firstName, lastName, typeAuth)
            if (!user) {
                console.log("Problem with adding new user to database")
                res.status(500).json({message: 'Unsuccessful procedure of registration'})
            }
            res.status(201).json({message: 'User created'})
        } catch (e) {
            console.log(e)
            res.status(500).json({message: 'Common error (procedure of registration)'})
        }
    }

    async login(req, res) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'You entered incorrect data'
                })
            }
            const {email, password} = req.body
            const user = await database.getUserFromDatabase(email)
            if (!user) {
                return res.status(400).json({message: 'User with this email did not find'})
            }
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(400).json({message: 'Password incorrect, try again'})
            }
            const token = getToken(user.id, user.role)
            res.json(
                {
                    token,
                    userId: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role
                }
            )
        } catch (e) {
            console.log(e)
            res.status(500).json({message: 'Common error (procedure of login)'})
        }
    }

    async socialNetworkLoginSuccessful(req, res) {
        try {
            const email = req.user?.emails[0]?.value
            const typeAuth = req.user.provider
            const firstName = req.user._json.first_name
            const lastName = req.user._json.last_name
            const hashedPassword = 'empty'
            const candidate = await database.checkUserInDatabase(email)
            if (!candidate) {
                const user = await database.createNewUser(email, hashedPassword, firstName, lastName, typeAuth)
                if (!user) {
                    console.log("Problem with adding new user to database")
                    res.status(500).json({message: 'Unsuccessful procedure of registration'})
                    return
                }
            }
            const user = await database.getUserFromDatabase(email)
            if (user) {
                const token = getToken(user.id, user.role)
                socialUserAuth.token = token
                socialUserAuth.userId = user.id
                socialUserAuth.firstName = firstName
                socialUserAuth.lastName = lastName
                socialUserAuth.role = user.role
            }
        } catch (e) {
            console.log(e)
        } finally {
            if (!config.get('isProduction')) {
                res.redirect(`${config.get('reactUrl')}`)
            } else {
                res.redirect(`${config.get('baseUrl')}`)
            }
        }
    }

    sendTokenSocialNetworkAuth(req, res) {
        res.json(socialUserAuth)
        socialUserAuth.token = null
        socialUserAuth.userId = null
        socialUserAuth.firstName = null
        socialUserAuth.lastName = null
        socialUserAuth.role = null
    }

    socialNetworkLoginUnsuccessful(req, res) {
        console.log("Unsuccessful login with social network")
        if (!config.get('isProduction')) {
            res.redirect(`${config.get('reactUrl')}`)
        } else {
            res.redirect(`${config.get('baseUrl')}`)
        }
    }

}

module.exports = new authController()