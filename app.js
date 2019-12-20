var createError = require('http-errors')
var express = require('express')
var cookieParser = require('cookie-parser')
var cors = require('cors')

var indexRouter = require('./routes/index')
var gamesApiRouter = require('./routes/api/games')
var usersApiRouter = require('./routes/api/users')

var app = express()

//Why did this fix the issue with the fe posting and getting the user resources? 
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/', indexRouter)
app.use('/api/games', gamesApiRouter)
app.use('/api/users', usersApiRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	res.status(err.status || 500)
	res.send({error: 'unable to retrieve resource'})
})

module.exports = app
