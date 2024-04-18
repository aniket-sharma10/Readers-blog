const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide title'],
        unique: true
    },
    content: {
        type: String,
        required: [true, 'Please provide content'],
    },
    userId: {
        type: String,
        required: [true, 'Please provide userId'],
    },
    image: {
        type: String,
        default: 'https://th.bing.com/th/id/OIP.yg9K7_Uf9-FcRAgWVG93MAHaD0?rs=1&pid=ImgDetMain',
    },
    category: {
        type: String,
        default: 'uncategorized'
    },
    slug: {
        type: String,
        required: [true, 'Please provide slug'],
        unique: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Post', postSchema)