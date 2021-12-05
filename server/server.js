const express = require('express')
const config = require('config')
const cors = require('cors')
const passport = require('passport')
const createPassportStrategies = require('./passport')
const authRouter = require('./routers/auth.routes')
const reviewRouter = require('./routers/review.router')
const path = require('path')


const PORT = process.env.PORT || config.get('port')

const app = express()

app.use(cors({
    origin: config.get('reactUrl'),
    credentials: true
}))

app.use(express.json({extended:true}))

createPassportStrategies(passport)
app.use(passport.initialize())

if (process.env.PROD === 'production') {
    app.use(express.static(path.resolve(__dirname + '/public')))
    const getMainPage = (req, res) => {
        res.sendFile(path.resolve(__dirname + '/public/index.html'))
    }
    app.get('/', getMainPage)
}

app.use('/auth', authRouter)
app.use('/review', reviewRouter)

async function start() {
    try {
        app.listen(PORT, () => {
            console.log(`server started on port ${PORT}`)
        })
    } catch (e) {
        console.log('Problem with starting HTTP server')
        process.exit(1)
    }
}


start()