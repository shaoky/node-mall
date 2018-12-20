import express from 'express'
import Order from '../../controller/app/order/index'
const router = express.Router()

router.post('/order/goodsPreview', Order.orderGoodsPreview)
router.post('/order/cartPreview', Order.orderCartPreview)
router.post('/order/add', Order.orderAdd)

/* 用户 */
router.post('/user/order/list', Order.userOrderList)
router.post('/user/order/info', Order.userOrderInfo)
// router.post('/order/delete', Order.cartDelete)
router.post('/user/order/status/update', Order.userOrderStatusUpdate)

export default router
