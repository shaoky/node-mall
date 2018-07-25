import express from 'express'
import Login from '../../controller/admin/login/index'
const router = express.Router();

router.post('/admin/login', Login.index)
router.post('/admin/register', Login.register)

export default router