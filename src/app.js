const express = require('express')
const cors = require('cors')
const gamesApiRouter = require('./routes/api/games')
const usersApiRouter = require('./routes/api/users')


const app = express()
const port = process.env.PORT || 3001

app.use(cors()) //Why did this fix the issue with the fe posting and getting the user resources? 
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/games', gamesApiRouter)
app.use('/api/users', usersApiRouter)

app.listen(port, () => console.log('Server is running on port: ', port))