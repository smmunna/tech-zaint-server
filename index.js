const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const cors = require('cors')
require('./db/connection')
require('dotenv').config()
const userRouter = require('./router/user/userRouter')
const coursesRouter = require('./router/courses/coursesRouter')

app.use(cors())
app.use(express.json({ limit: '50mb' })); //Payload size 50mb , per request it send 50mb

app.use('/uploads',express.static('uploads'))

// using router;
app.use('/user',userRouter)
app.use('/courses',coursesRouter)

app.get('/', (req, res) => res.send('Welcome to TechZaint..!'))
app.listen(port, () => console.log(`TechZaint app is listening on port ${port}!`))