require('./data/mongoose')
const express = require('express')
const cors = require('cors')


const app = express()
const port = process.env.PORT || 3001
 
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/games', require('./routes/game'))
app.use('/steam-users', require('./routes/steamUser'))
app.use('/users', require('./routes/user'))
app.use('/profile', require('./routes/profile'))
app.use('/auth', require('./routes/auth'))


app.listen(port, () => console.log('Server is running on port: ', port))