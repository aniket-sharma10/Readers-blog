const Comment = require('../models/comment-model')
const { UnauthenticatedError, NotFoundError } = require('../errors/')
const {StatusCodes} = require('http-status-codes')

const createComment = async (req, res) => {
    const {content, postId, userId} = req.body

    if(userId != req.user.userId){
        throw new UnauthenticatedError('You are not allowed to comment')
    }
    const comment = await Comment.create({content, postId, userId})
    res.status(StatusCodes.OK).json(comment)
}

const getComments = async (req, res) => {
    const {postId} = req.params
    const allComments = await Comment.find({postId}).sort({createdAt: -1})
    res.status(StatusCodes.OK).json(allComments)
}

const likeComment = async(req, res) => {
    const comment = await Comment.findById(req.params.commentId)
    if(!comment){
        throw new NotFoundError('Comment not found')
    }
    const userIndex = comment.likes.indexOf(req.user.userId)
    if(userIndex === -1){
        comment.likes.push(req.user.userId)
        comment.numberOfLikes += 1
    }
    else{
        comment.likes.splice(userIndex, 1)
        comment.numberOfLikes -= 1
    }
    await comment.save()
    res.status(StatusCodes.OK).json(comment)
}

const editComment = async(req, res) => {
    const comment = await Comment.findById(req.params.commentId)
    if(!comment){
        throw new NotFoundError('Comment not found')
    }
    if(comment.userId !== req.user.userId){
        throw new UnauthenticatedError('You are not allowed to edit this comment')
    }
    const updatedComment = await Comment.findByIdAndUpdate(req.params.commentId, {content: req.body.content}, {new: true})
    res.status(StatusCodes.OK).json(updatedComment)
}

const deleteComment = async(req, res) => {
    const comment = await Comment.findById(req.params.commentId)
    if(!comment){
        throw new NotFoundError('Comment not found')
    }
    if(comment.userId !== req.user.userId && !req.user.isAdmin){
        throw new UnauthenticatedError('You are not allowed to delete this comment')
    }
    await Comment.findByIdAndDelete(req.params.commentId)
    res.status(StatusCodes.OK).json('Comment has been deleted')
}

const getAllComments = async(req, res)=> {
    if(!req.user.isAdmin){
        throw new UnauthenticatedError('You are not allowed to get all comments')
    }
    const startIndex = parseInt(req.query.start || 0)
    const limit = parseInt(req.query.limit || 9)
    const sortDirection = req.query.order === 'desc' ? -1 : 1
    const comments = await Comment.find().sort({createdAt: sortDirection}).skip(startIndex).limit(limit)

    const totalComments = await Comment.countDocuments()
    const now = new Date()
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth()-1, now.getDate())
    const lastMonthComments = await Comment.countDocuments({createdAt: {$gte: oneMonthAgo}})

    res.status(StatusCodes.OK).json({comments, totalComments, lastMonthComments})
}

module.exports = {createComment, getComments, likeComment, editComment, deleteComment, getAllComments}