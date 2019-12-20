const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const appUserSchema = mongoose.Schema({
    steamApiKey: String,
    password: {
        type: String,
        required: true
    },
    email: { 
        type: String, 
        index: true,
        required: true,
        validate: (value) => {
            if (!validator.isEmail(value))
                throw new Error(`${value} is not a valid email address`)
        } 
    }
})

appUserSchema.pre('save', async function(next) {
    const appUser = this
    if (appUser.isModified('password')) {
        appUser.password = await bcrypt.hash(appUser.password, 8)
    }
    next()
})

const AppUser = mongoose.model('AppUser', appUserSchema)

module.exports = AppUser