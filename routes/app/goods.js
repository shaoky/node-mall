import express from 'express'
import Goods from '../../controller/app/goods/index'
// import Panic from '../../controller/app/goods/panic'
const router = express.Router()

router.post('/goods/list', Goods.goodsList)
router.post('/goods/info', Goods.goodsInfo)
router.post('/goodsAll/list', Goods.goodsAllList)
router.post('/goodsCategory/list', Goods.goodsCategoryList)

// 抢购
// router.post('/goods/panic/add', Goods.add)

export default router