import express from 'express'
import { createUser, deleteUser, getAllUser, getUserbyId, updateuser} from '../controllers/userController.js'
import { imgUpload } from '../auth.js/uploads.js'

const router = express.Router()

router.post('/user',imgUpload.single('file'),createUser)
router.get('/allusers',getAllUser)
router.get('/allusers/:id',getUserbyId)
router.put('/edituser/:id',updateuser)
router.delete('/deleteusers/:id',deleteUser)
export default router;





