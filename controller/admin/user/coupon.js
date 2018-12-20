import mongoose from 'mongoose'
import CouponModel from '../../../models/admin/coupon'
import BaseComponent from '../../../prototype/base'

/**
 * @apiDefine appCouponGroup admin-优惠券
 */

/**
 * @api {post} / 0. 优惠券表
 * @apiName coupon
 * @apiGroup appCouponGroup
 * @apiSuccess {Number} couponId 记录id
 * @apiVersion 1.0.0
 */
class Coupon extends BaseComponent {
    constructor () {
        super()
        this.add = this.add.bind(this)
        this.list = this.list.bind(this)
        this.delete = this.delete.bind(this)
    }
    /**
     * @api {post} /admin/user/coupon/list 1. 优惠券列表
     * @apiName couponList
     * @apiGroup appCouponGroup
     * @apiHeader {String} Authorization token
     * @apiParam {Number} page = 0 页面
     * @apiParam {Number} size = 20 数量
     * @apiVersion 1.0.0
     */
    async list (req, res, next) {
        let userId = this.getUserId(req.get('Authorization'), res)
        const {page = 0, size = 20} = req.body
        try {
            let list = await CouponModel.find({}, '-_id').skip(Number(page*size)).limit(Number(size))
            res.send({
                code: 200,
                data: list
            })
        } catch (err) {
            console.log('err', err)
            res.send({
                code: 400,
                message: '获取优惠券列表失败'
            })
        }
    }
    /**
     * @api {post} /admin/user/coupon/add 2. 优惠券新增
     * @apiName couponAdd
     * @apiGroup appAouponGroup
     * @apiHeader {String} Authorization token
     * @apiParam {Number} title 优惠券标题
     * @apiVersion 1.0.0
     */
    async add (req, res, next) {
        let userId = this.getUserId(req.get('Authorization'), res)
        let params = req.body
        try {
            if (!params.title) {
                throw new Error('请输入优惠券名称')
            }
            if (!params.type) {
                throw new Error('请输入优惠券类型')
            }
            if (!params.sendNum) {
                throw new Error('请输入优惠券发放数量')
            }
            if (!params.receiveNum) {
                throw new Error('请输入优惠券类型')
            }
            if (!params.sendStartTime) {
                throw new Error('请输入发放开始时间')
            }
            if (!params.sendEndTime) {
                throw new Error('请输入发放结束时间')
            }
        } catch (err) {
            console.log('前台参数错误:', err.message)
            res.send({
                code: 400,
                message: err.message
            })
            return
        }
        
        try {
            let id = await this.getId('coupon_id')
            params.id = id
        } catch (err) {
            console.log('coupon_id失败')
            throw new Error(err)
        }

        try {
            await CouponModel.create({
                couponId: params.id,
                title: params.title,
                type: params.type,
                desc: params.desc,
                sendNum: params.sendNum,
                receiveNum: params.receiveNum,
                sendStartTime: params.sendStartTime,
                sendEndTime: params.sendEndTime,
                validStartTime: params.validStartTime,
                validEndTime: params.validEndTime,
                createTime: parseInt(new Date() / 1000)
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
    /**
     * @api {post} /admin/user/coupon/delete 3. 优惠券删除
     * @apiName couponDelete
     * @apiGroup appcouponGroup
     * @apiHeader {String} Authorization token
     * @apiParam {Number} couponId 记录id
     * @apiVersion 1.0.0
     */
    async delete (req, res, next) {
        let id = req.body.couponId
        if (!id || !Number(id)) {
            console.log('id参数错误')
            res.send({
                code: 400,
                message: 'id参数错误'
            })
            return
        }

        try {
            let del = await CouponModel.findOneAndRemove({ couponId: id })
            if (del) {
                res.send({
                    code: 200,
                    message: '删除成功'
                })
            } else {
                res.send({
                    code: 400,
                    message: '该记录不存在'
                })
            }
            
        } catch (err) {
            res.send({
                code: 400,
                message: '删除失败'
            })
        }
    }
    /**
     * @api {post} /admin/user/coupon/update 4. 优惠券更新
     * @apiName couponUpdate
     * @apiGroup appCouponGroup
     * @apiHeader {String} Authorization token
     * @apiParam {Number} couponId 记录id
     * @apiParam {String} title 文章标题
     * @apiParam {Boolean} isShow 是否开启
     * @apiVersion 1.0.0
     */
    async update (req, res, next) {
        let params = req.body
        try {
            if (!params.couponId || !Number(params.couponId)) {
                throw new Error('couponId参数错误')
            }
        } catch (err) {
            console.log('前台参数错误:', err.message)
            res.send({
                code: 400,
                message: err.message
            })
            return
        }

        const form = {
            title: params.title,
        }

        for (let item of Object.keys(form)) {
            if (typeof form[item] === 'undefined') {
                delete form[item]
            }
        }

        try {
            await CouponModel.findOneAndUpdate({couponId: params.couponId}, {$set: form})
            res.send({
                code: 200,
                message: '更新成功'
            })
        } catch (err) {
            console.log('err', err)
            res.send({
                code: 400,
                message: '更新失败'
            })
        }
    }
}

export default new Coupon()