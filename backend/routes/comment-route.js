const express = require('express')
const auth = require('../middlewares/authentication')
const { createComment, getComments, likeComment, editComment, deleteComment, getAllComments } = require('../controllers/comment-controller')
const router = express.Router()

router.post('/create', auth, createComment)
router.get('/getComments/:postId', getComments)
router.put('/like/:commentId', auth, likeComment)
router.put('/edit/:commentId', auth, editComment)
router.delete('/delete/:commentId', auth, deleteComment)
router.get('/getAllComments', auth, getAllComments)

module.exports = router