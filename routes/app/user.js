import express from 'express'
import User from '../../controller/app/user/index'
import Address from '../../controller/app/user/address'
import Browse from '../../controller/app/user/browse'
import Collection from '../../controller/app/user/Collection'
import Coupon from '../../controller/app/user/coupon'

const router = express.Router();

// 注册登陆
router.post('/user/login', User.index)
router.post('/user/register', User.register)
// 地址
router.post('/address/list', Address.list)
router.post('/address/add', Address.add)
router.post('/address/delete', Address.delete)
router.post('/address/default', Address.getAddressDefault)
router.post('/address/setDefault', Address.setAddressDefault)
// 浏览记录
router.post('/user/browse/list', Browse.list)
router.post('/user/browse/add', Browse.add)
router.post('/user/browse/delete', Browse.delete)
// 收藏
router.post('/user/collection/list', Collection.list)
router.post('/user/collection/add', Collection.add)
router.post('/user/collection/delete', Collection.delete)
// 优惠券
router.post('/user/coupon/list', Coupon.list)
router.post('/user/coupon/add', Coupon.add)

export default router