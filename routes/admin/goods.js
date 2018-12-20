import express from 'express'
import Goods from '../../controller/admin/goods/index'
import Base from '../../prototype/base'
const BaseHandle = new Base()
const router = express.Router()

router.get('/admin/goods/list', Goods.list)
router.post('/admin/goods/add', Goods.add)
router.post('/admin/goods/delete', Goods.delete)
router.post('/admin/goods/update', Goods.update)
router.post('/admin/goods/upload', BaseHandle.uploadImg)


export default router