const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    steamid: {
        type: String,
        default: ''
    }
    , steamApiKey: { 
        type: String,
        default: ''
    }
    , password: {
        type: String,
        required: true
    }
    , email: { 
        type: String, 
        index: true,
        required: true,
        validate: (value) => {
            if (!validator.isEmail(value))
                throw new Error(`${value} is not a valid email address`)
        }
    }
    , tokens: [{
      token: { type: String, required: true }  
    }]
})

userSchema.methods.generateAuthToken = async function() {
    const user = this 
    const token = jwt.sign({ _id: user.id }, 'jwttotrot')

    user.tokens.push({ token })
    await user.save()
    
    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne( { email: email } )

    if (!user)
        throw new Error('unable to login')

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch)
        throw new Error('unable to login')

    return user
}

userSchema.pre('save', async function(next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User