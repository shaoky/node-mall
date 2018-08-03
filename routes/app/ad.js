import express from 'express'
import Ad from '../../controller/app/ad/index'
const router = express.Router()

router.post('/ad/list', Ad.list)
router.post('/ad/add', Ad.add)
router.post('/ad/delete', Ad.delete)
router.post('/ad/update', Ad.update)

export default router