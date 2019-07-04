const router = require('express').Router()
var createError = require('http-errors')

router.get('/', function(req, res, next) {
    res.render('admin', {title: 'Search for Steam Friends'})
})

module.exports = router
