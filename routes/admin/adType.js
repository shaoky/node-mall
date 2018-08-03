import express from 'express'
import AdType from '../../controller/admin/ad/type'
const router = express.Router()

router.post('/api/admin/v1/ad/type/add', AdType.index)

export default router