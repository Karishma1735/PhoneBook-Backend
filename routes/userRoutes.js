import express from 'express'
import { createUser, deleteUser, getAllUser, pagination, updateUserOrToggleBookmarkController} from '../controllers/userController.js'
import { upload } from '../middleware/uploads.js'

const router = express.Router()

router.post('/user', upload.single('image'),createUser)
router.get('/allusers', getAllUser);
router.put('/edituser/:id',upload.single('image'),updateUserOrToggleBookmarkController)
router.delete('/deleteusers/:id',deleteUser)
router.get('/paginatedusers',pagination)
export default router;





