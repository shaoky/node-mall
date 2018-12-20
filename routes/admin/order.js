import express from 'express'
import Order from '../../controller/admin/order/index'
const router = express.Router()

router.post('/admin/order/status/update', Order.setOrderStatus)
// router.post('/admin/order/delete', Goods.delete)
// router.post('/admin/order/update', Goods.update)
// router.post('/admin/order/upload', BaseHandle.uploadImg)

export default router