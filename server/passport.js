const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const VKontakteStrategy = require('passport-vkontakte').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const config = require('config')


module.exports = passport => {

    // ============ GOOGLE ============
    passport.use('google', new GoogleStrategy({
            clientID: config.get('oauth.googleAuth.clientID'),
            clientSecret: config.get('oauth.googleAuth.clientSecret'),
            callbackURL: config.get('oauth.googleAuth.callbackURL')
        },
        function(request, accessToken, refreshToken, profile, done) {
            process.nextTick(() => {
                done(null, profile)
            })
        }))

    // ============ FACEBOOK ============
    passport.use('facebook', new FacebookStrategy({
            clientID: config.get('oauth.facebookAuth.clientID'),
            clientSecret: config.get('oauth.facebookAuth.clientSecret'),
            callbackURL: config.get('oauth.facebookAuth.callbackURL'),
            profileFields: ['id', 'displayName', 'name', 'photos', 'emails']
        },
        function(accessToken, refreshToken, profile, done) {
            process.nextTick(() => {
                console.log(profile)
                done(null, profile)
            })
        }))

    // ============ VK ============
    passport.use('vkontakte', new VKontakteStrategy({
            clientID: config.get('oauth.vkontakteAuth.clientID'),
            clientSecret: config.get('oauth.vkontakteAuth.clientSecret'),
            callbackURL: config.get('oauth.vkontakteAuth.callbackURL')
        },
        function(accessToken, refreshToken, params, profile, done) {
            const _profile = JSON.parse(JSON.stringify(profile))
            _profile.emails = [{value: params.email}]
            process.nextTick(() => {
                done(null, _profile)
            })
        }))

    // ============ JWT ============
    passport.use('jwt', new JwtStrategy({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('jwtSecret')
        },
        function(jwt_payload, done) {
            process.nextTick(() => {
                done(null, jwt_payload)
            })
        }))
}

