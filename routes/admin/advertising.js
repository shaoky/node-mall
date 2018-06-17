import express from 'express'
import Advertising from '../../controller/admin/advertising/index'
const router = express.Router()

// router.post('/api/admin/v1/advertising/getList', (req, res, next) => {
//     res.send({
//         error_no: 0,
//         status: 1
//     })
//     return
// })
router.post('/api/admin/v1/advertising/getList', Advertising.add)

export default router