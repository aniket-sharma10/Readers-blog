const express = require('express')
const router = express.Router()
const { updateUser, deleteUser, signout, getusers, getUser} = require('../controllers/user-controller')
const auth = require('../middlewares/authentication')

router.put('/update/:userId', auth, updateUser)
router.delete('/delete/:userId', auth, deleteUser)
router.post('/signout', signout)
router.get('/getusers', auth, getusers)
router.get('/:userId', getUser)

module.exports = router