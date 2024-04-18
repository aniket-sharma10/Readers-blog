const User = require('../models/user-model')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const signup = async (req, res) => {
    const { username, email, password } = req.body
    if (!username || !email || !password || username === '' || email === '' || password === '') {
        throw new BadRequestError('All fields are required')
    }
    const user = await User.create({ username, email, password })
    res.status(StatusCodes.CREATED).json({ user })
}

const signin = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password || email === '' || password === '') {
        throw new BadRequestError('Please provide email and password')
    }
    // check if user exists
    const user = await User.findOne({ email })
    if (!user) {
        throw new UnauthenticatedError('Invalid credentials')
    }
    // compare password
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid credentials')
    }
    // Seperating password from other details
    const { password: pass, ...rest } = user._doc;

    const token = user.createJWT()
    res.status(StatusCodes.OK).cookie('access_token', token, { httpOnly: true }).json(rest)
}

const google = async (req, res) => {
    const { name, email, googlePhotoUrl } = req.body;

    if (!email || !name || !googlePhotoUrl) {
        throw new BadRequestError('Invalid credentials')
    }

    const user = await User.findOne({ email })
    // If user exists
    if (user) {
        const { password: pass, ...rest } = user._doc;
        const token = user.createJWT()
        res.status(StatusCodes.OK).cookie('access_token', token, { httpOnly: true }).json(rest)
    }
    // creating new user if already doesnt exits
    else {
        const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

        const user = await User.create({ 
            username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
            email,
            password,
            profilePicture: googlePhotoUrl
        })

        const { password: pass, ...rest } = user._doc;
        const token = user.createJWT()
        res.status(StatusCodes.OK).cookie('access_token', token, { httpOnly: true }).json(rest)
    }
}

module.exports = { signup, signin, google }