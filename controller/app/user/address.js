import mongoose from 'mongoose'
import AddressModel from '../../../models/user/address'
import Base from '../../../prototype/base'

class Address extends Base {
    constructor () {
        super()
        this.add = this.add.bind(this)
        this.setAddressDefault = this.setAddressDefault.bind(this)
    }
    /*
    *
    */
    async list (req, res, next) {
        const {page = 0, size = 20} = req.body
        try {
            let list = await AddressModel.find({}, '-_id').skip(Number(page*size)).limit(Number(size))
            res.send({
                code: 200,
                data: list
            })
        } catch (err) {
            console.log('err', err)
            res.send({
                code: 400,
                message: '获取地址列表失败'
            })
        }
    }

    async add (req, res, next) {
        let form = req.body
        // try {
        //     if (!form.title) {
        //         throw new Error('请输入标题');
        //     }
        // } catch (err) {
        //     console.log('前台参数错误:', err.message)
        //     res.send({
        //         code: 400,
        //         type: 'ERROR_PARAMS',
        //         message: err.message
        //     })
        //     return
        // }
        let userId = this.getUserId(req.get('Authorization'))

        try {
            let id = await this.getId('address_id')
            form.id = id
        } catch (err) {
            console.log('address_id失败')
            throw new Error(err)
        }

        try {
            form.createTime = parseInt(new Date() / 1000)
            await AddressModel.create({
                id: form.id,
                userId: userId,
                userName: form.userName,
                userPhone: form.telNumber,
                provinceName: form.provinceName,
                cityName: form.cityName,
                countyName: form.countyName,
                detailInfo: form.detailInfo,
                postalCode: form.postalCode,
                isDefault: false
            })
            res.send({
                code: 200,
                message: '添加成功'
            })
        } catch (err) {
            console.log(err)
            res.send({
                code: 400,
                message: '添加失败'
            })
        }
    }

    async delete (req, res, next) {
        let addressId = req.body.id
        if (!addressId || !Number(addressId)) {
            console.log('goodsId参数错误')
            res.send({
                code: 400,
                message: 'id参数错误'
            })
            return
        }

        try {
            let del = await AddressModel.findOneAndRemove({ id: addressId })
            if (del) {
                res.send({
                    code: 200,
                    message: '删除成功'
                })
            } else {
                res.send({
                    code: 400,
                    message: '该地址不存在'
                })
            }
            
        } catch (err) {
            res.send({
                code: 400,
                message: '删除失败'
            })
        }
    }

    async setAddressDefault (req, res, next) {
        // let token = req.get('Authorization')
        // let tokenKey = config.get('Customer.global.tokenKey')
        // let decoded = jwt.verify(token, tokenKey)
        // let user_id = decoded.id
        let userId = this.getUserId(req.get('Authorization'))
        try {
            await AddressModel.update({userId: userId}, {isDefault: false}, {multi: true})
            await AddressModel.findOneAndUpdate({id: req.body.id, userId: userId}, {$set: {isDefault: true}})
            res.send({
                code: 200,
                message: '操作成功'
            })
        } catch (err) {
            res.send({
                code: 400,
                message: '更新失败'
            })
        }
    }
}

export default new Address()