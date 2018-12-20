import express from 'express'
import Panic from '../../controller/admin/panic/index'
import PanicGoods from '../../controller/admin/panic/goods'
import Base from '../../prototype/base'
const BaseHandle = new Base()
const router = express.Router()

// 抢购活动
router.post('/admin/panic/add', Panic.add)
router.post('/admin/panic/list', Panic.list)

// 抢购商品
router.post('/admin/panic/goods/add', PanicGoods.add)
router.post('/admin/panic/goods/list', PanicGoods.list)

export default router