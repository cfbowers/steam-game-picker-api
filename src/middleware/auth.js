const AppUser = require('../data/models/appUser')
const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decodedToken = jwt.verify(token, 'jwttotrot')
        const user = await AppUser.findOne( { _id: decodedToken._id, 'tokens.token': token } )

        if (!user)
            throw new Error()

        req.user = user
        next()
        
    } catch (e) {
        res.status(401).send( { error: 'you shall not pass!' } )
    }
}

module.exports = auth