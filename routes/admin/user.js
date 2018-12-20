import express from 'express'
import Coupon from '../../controller/admin/user/coupon'
const router = express.Router()

router.post('/admin/user/coupon/add', Coupon.add)
router.post('/admin/user/coupon/list', Coupon.list)
router.post('/admin/user/coupon/delete', Coupon.delete)
router.post('/admin/user/coupon/update', Coupon.update)

// router.post('/admin/ad/delete', Ad.delete)
// router.post('/admin/ad/update', Ad.update)

export default router