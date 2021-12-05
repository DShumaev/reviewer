const jwt = require('jsonwebtoken')
const config = require('config')



module.exports = (userId, userRole) => {
    return jwt.sign(
        {
            userRole,
            userId
        },
        config.get('jwtSecret'),
        {
            expiresIn: '24h'
        }
    )
}