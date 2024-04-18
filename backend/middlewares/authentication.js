const User = require('../models/user-model')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const auth = async (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        throw new UnauthenticatedError('Authentication invalid')
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        req.user = { userId: payload.userId, isAdmin: payload.isAdmin }
        next()
    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid')
    }
}

module.exports = auth