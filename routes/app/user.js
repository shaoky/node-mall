import express from 'express'
import User from '../../controller/app/user/index'
import Address from '../../controller/app/user/address'
const router = express.Router();

router.post('/user/login', User.index)
router.post('/user/register', User.register)
router.post('/address/list', Address.list)
router.post('/address/add', Address.add)
router.post('/address/delete', Address.delete)
router.post('/address/default', Address.getAddressDefault)
router.post('/address/setDefault', Address.setAddressDefault)

export default router