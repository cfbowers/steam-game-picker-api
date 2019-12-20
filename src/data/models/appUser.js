const mongoose = require('mongoose')
const validator = require('validator')

const AppUser = mongoose.model('AppUser', {
    steamApiKey: String,
    password: {
        type: String,
        required: true
    },
    email: { 
        type: String, 
        required: true,
        validate: (value) => {
            if (!validator.isEmail(value))
                throw new Error(`${value} is not a valid email address`)
        } 
    }
})

module.exports = AppUser