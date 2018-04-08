import express from 'express'
import Login from '../../controller/admin/login/index'
const router = express.Router();

router.post('/login', Login.index)
router.post('/admin/v1/register', Login.register)

export default router