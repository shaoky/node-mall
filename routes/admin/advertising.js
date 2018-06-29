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
router.get('/admin/advertising/list', Advertising.list)
router.post('/admin/advertising/add', Advertising.add)

export default router