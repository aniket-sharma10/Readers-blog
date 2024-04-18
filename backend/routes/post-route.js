const express = require('express')
const router = express.Router()
const auth = require('../middlewares/authentication')
const { create, getposts, deletepost, updatepost } = require('../controllers/post-controller')

router.post('/create', auth, create)
router.get('/getposts', auth, getposts)
router.delete('/deletepost/:postId/:userId', auth, deletepost)
router.put('/updatepost/:postId/:userId', auth, updatepost)

module.exports = router