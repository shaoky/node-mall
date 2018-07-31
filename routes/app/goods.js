import express from 'express'
import Goods from '../../controller/app/goods/index'
const router = express.Router()

router.post('/goods/list', Goods.goodsList)
router.post('/goods/info', Goods.goodsInfo)
router.post('/goodsAll/list', Goods.goodsAllList)
router.post('/goodsCategory/list', Goods.goodsCategoryList)

export default router