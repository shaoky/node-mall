import express from 'express'
import Ad from '../../controller/admin/ad/index'
const router = express.Router()

router.get('/admin/ad/list', Ad.list)
router.post('/admin/ad/add', Ad.add)
// router.post('/admin/ad/delete', Ad.delete)
// router.post('/admin/ad/update', Ad.update)

export default router