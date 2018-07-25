import express from 'express'
import Advertising from '../../controller/admin/advertising/index'
const router = express.Router()

router.get('/admin/advertising/list', Advertising.list)
router.post('/admin/advertising/add', Advertising.add)
router.post('/admin/advertising/delete', Advertising.delete)
router.post('/admin/advertising/update', Advertising.update)

export default router