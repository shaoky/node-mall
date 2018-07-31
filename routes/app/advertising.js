import express from 'express'
import Advertising from '../../controller/app/advertising/index'
const router = express.Router()

router.post('/advertising/list', Advertising.list)
router.post('/advertising/add', Advertising.add)
router.post('/advertising/delete', Advertising.delete)
router.post('/advertising/update', Advertising.update)

export default router