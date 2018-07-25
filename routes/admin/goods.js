import express from 'express'
import goods from '../../controller/admin/goods/index'
const router = express.Router()

router.get('/admin/goods/list', goods.list)
router.post('/admin/goods/add', goods.add)
router.post('/admin/goods/delete', goods.delete)
router.post('/admin/goods/update', goods.update)

export default router