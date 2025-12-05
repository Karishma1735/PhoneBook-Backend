import express from 'express'
import { createUser, deleteUser, filterBylabel, getAllUser, pagination, searchUser, toggleBookmark, updateuser} from '../controllers/userController.js'
import { upload } from '../middleware/uploads.js'

const router = express.Router()

router.post('/user', upload.single('image'),createUser)
// router.get('/allusers', getAllUser);
router.get('/allusers/:id?', getAllUser);
// router.get('/allusers/:id',getUserbyId)
router.put('/edituser/:id',upload.single('image'),updateuser)
router.delete('/deleteusers/:id',deleteUser)
router.put('/bookmark/:id',toggleBookmark)
router.get('/search',searchUser)
router.get('/filter' , filterBylabel)
router.get('/paginatedusers',pagination)
export default router;





