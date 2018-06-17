import express from 'express'
// import Advertising from '../../controller/admin/advertising/index'
import AdvertisingType from '../../controller/admin/advertising/type'
const router = express.Router()

router.post('/api/admin/v1/advertising/type/add', AdvertisingType.index)
// router.post('/api/admin/v1/advertising/getList', Advertising.index)

export default router