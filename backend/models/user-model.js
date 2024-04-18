const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide username'],
        unique: true
    },
    email: {
        type: String,
        required:  [true, 'Please provide username'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide valid email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
    },
    profilePicture: {
        type: String,
        default: "https://www.pngall.com/wp-content/uploads/5/Profile-PNG-File.png"
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

userSchema.pre('save',  function(next){
    this.password = bcrypt.hashSync(this.password, 10)
    next()
})

userSchema.methods.createJWT = function(){
    return jwt.sign({userId: this._id, isAdmin: this.isAdmin}, process.env.JWT_SECRET)
}
    
userSchema.methods.comparePassword = async function(password){
    const isMatch = await bcrypt.compare(password, this.password)
    return isMatch
}


module.exports = mongoose.model('User', userSchema)