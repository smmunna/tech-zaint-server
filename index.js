const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const cors = require('cors')
require('./db/connection')
const userRouter = require('./router/user/userRouter')

app.use(cors())
app.use(express.json())

app.use('/uploads',express.static('uploads'))

// using router;
app.use('/user',userRouter)

app.get('/', (req, res) => res.send('Welcome to TechZaint..!'))
app.listen(port, () => console.log(`TechZaint app is listening on port ${port}!`))