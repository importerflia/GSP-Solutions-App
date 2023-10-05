import { Router } from "express"
import multer from "multer"
import { uploadFile } from "../controllers/uploadCtrl"
import { storage, fileFilter } from "../controllers/uploadCtrl"
import { confirmUser } from "../controllers/usersCtrl"

const router = Router()
const upload = multer({storage, fileFilter}).single('file')

router.post('/upload/:type', upload, uploadFile)
router.get('/users/confirm/:operationToken', confirmUser)

export default router