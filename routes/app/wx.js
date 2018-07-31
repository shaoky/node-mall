import express from 'express'
import Mini from '../../controller/app/wx/mini'
const router = express.Router();

router.post('/wx/mini/login', Mini.login)

export default router