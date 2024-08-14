const Post = require('../models/post-model')
const { StatusCodes } = require('http-status-codes')
const { UnauthenticatedError, BadRequestError } = require('../errors')

const create = async (req, res) => {
    if (!req.user.userId) {
        throw new UnauthenticatedError('Please login to create a post!')
    }
    if (!req.body.title || !req.body.content) {
        throw new BadRequestError('Please provide all required fields')
    }
    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
    const newPost = await Post.create({ ...req.body, slug, userId: req.user.userId })
    res.status(StatusCodes.OK).json(newPost)
}

const getposts = async (req, res) => {
    const startIndex = parseInt(req.query.start || 0)
    const limit = parseInt(req.query.limit || 9)
    const sortDirection = req.query.sort === 'asc' ? 1 : -1
    const posts = await Post.find({
        ...(req.query.userId && { userId: req.query.userId }),
        ...(req.query.category && { category: req.query.category }),
        ...(req.query.slug && { slug: req.query.slug }),
        ...(req.query.postId && { _id: req.query.postId }),
        ...(req.query.search && {
            $or: [
                { title: { $regex: req.query.search, $options: 'i' } },
                { content: { $regex: req.query.search, $options: 'i' } }
            ]
        })
    }).sort({updatedAt: sortDirection}).skip(startIndex).limit(limit)

    const totalPosts = await Post.countDocuments()

    const now = new Date()
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth()-1, now.getDate())
    const lastMonthPosts = await Post.countDocuments({createdAt: {$gte: oneMonthAgo}})

    res.status(StatusCodes.OK).json({posts, totalPosts, lastMonthPosts})
}

const getDashboardPosts = async (req, res) => {
    if (!req.user) {
        throw new UnauthenticatedError('Authentication required');
    }

    const startIndex = parseInt(req.query.start || 0);
    const limit = parseInt(req.query.limit || 9);
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const query = {
        ...(req.query.category && { category: req.query.category }),
        ...(req.query.slug && { slug: req.query.slug }),
        ...(req.query.search && {
            $or: [
                { title: { $regex: req.query.search, $options: 'i' } },
                { content: { $regex: req.query.search, $options: 'i' } }
            ]
        })
    };

    if (!req.user.isAdmin) {
        query.userId = req.query.userId;  // Non-admins see only their posts
    }

    const posts = await Post.find(query)
        .sort({ updatedAt: sortDirection })
        .skip(startIndex)
        .limit(limit);

    const totalPosts = await Post.countDocuments(query);

    res.status(StatusCodes.OK).json({ posts, totalPosts });
};


const deletepost = async(req, res) => {
    if(!req.user.isAdmin && req.user.userId !== req.params.userId){
        throw new UnauthenticatedError('You are not authorized to delete this post')
    }
    await Post.findByIdAndDelete(req.params.postId)
    res.status(StatusCodes.OK).json('This post has been deleted')
}

const updatepost = async(req, res) => {
    if(!req.user.isAdmin && req.user.userId !== req.params.userId){
        throw new UnauthenticatedError('You are not authorized to edit this post')
    }

    if (!req.body.title || !req.body.content) {
        throw new BadRequestError('Please provide all required fields')
    }
    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');

    const updatedPost = await Post.findByIdAndUpdate(req.params.postId, {...req.body, slug}, {new: true, runValidators: true})
    res.status(StatusCodes.OK).json(updatedPost)
}

module.exports = { create, getposts, getDashboardPosts,deletepost, updatepost }