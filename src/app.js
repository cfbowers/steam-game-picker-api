require('./data/mongoose')
const express = require('express')
const cors = require('cors')
const gameRouter = require('./routes/game')
const steamUserRouter = require('./routes/steamUser')
const userRouter = require('./routes/user')
const authRouter = require('./routes/auth')


const app = express()
const port = process.env.PORT || 3001

app.use(cors()) //Why did this fix the issue with the fe posting and getting the user resources? 
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/games', gameRouter)
app.use('/steam-users', steamUserRouter)
app.use('/users', userRouter)
app.use('/auth', authRouter)

app.listen(port, () => console.log('Server is running on port: ', port))