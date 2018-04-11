import express from 'express'
import Login from '../../controller/admin/login/index'
const router = express.Router();

router.post('/api/admin/v1/login', Login.index)
router.post('/api/admin/v1/register', Login.register)

export default router