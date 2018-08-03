import express from 'express'
import Cart from '../../controller/app/Cart/index'
const router = express.Router()

router.post('/cart/list', Cart.cartList)
router.post('/cart/add', Cart.cartAdd)
router.post('/cart/delete', Cart.cartDelete)
router.post('/cart/update', Cart.cartUpdate)

export default router
