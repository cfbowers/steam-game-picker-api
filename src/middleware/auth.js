const User = require('../data/models/user')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decodedToken = jwt.verify(token, 'jwttotrot')
        const user = await User.findOne( { _id: decodedToken._id, 'tokens.token': token } )
        if (!user)
            throw new Error()

        req.user = user
        req.token = token

        next()
        
    } catch (e) {
        res.status(401).send( { error: 'you shall not pass!' } )
    }
}

module.exports = auth

