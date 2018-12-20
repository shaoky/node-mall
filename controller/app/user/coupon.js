import mongoose from 'mongoose'
import CouponModel from '../../../models/admin/coupon'
import UserCouponModel from '../../../models/user/coupon'
import BaseComponent from '../../../prototype/base'

/**
 * @apiDefine appUserCouponGroup app-用户浏览记录
 */

/**
 * @api {post} / 0. 浏览记录表
 * @apiName userCoupon
 * @apiGroup appUserCouponGroup
 * @apiSuccess {Number} userCouponId 记录id
 * @apiVersion 1.0.0
 */
class UserCoupon extends BaseComponent {
    constructor () {
        super()
        this.add = this.add.bind(this)
        this.list = this.list.bind(this)
        this.delete = this.delete.bind(this)
    }
    /**
     * @api {post} /user/coupon/list 1. 优惠券列表
     * @apiName userCouponList
     * @apiGroup appUserCouponGroup
     * @apiHeader {String} Authorization token
     * @apiParam {Number} page = 0 页面
     * @apiParam {Number} size = 20 数量
     * @apiVersion 1.0.0
     */
    async list (req, res, next) {
        let userId = this.getUserId(req.get('Authorization'))
        const {page = 0, size = 20} = req.body
        try {
            let list = await UserCouponModel.find({userId: userId}, '-_id').skip(Number(page*size)).limit(Number(size))
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
     * @api {post} /user/coupon/add 2. 优惠券新增
     * @apiName userCouponAdd
     * @apiGroup appUserCouponGroup
     * @apiHeader {String} Authorization token
     * @apiParam {Number} couponId 优惠券id
     * @apiVersion 1.0.0
     */
    async add (req, res, next) {
        let userId = this.getUserId(req.get('Authorization'), res)
        let params = req.body
        try {
            if (!params.couponId) {
                throw new Error('couponId不存在')
            }
        } catch (err) {
            console.log('前台参数错误:', err.message)
            res.send({
                code: 400,
                message: err.message
            })
            return
        }

        let couponInfo
        try {
            couponInfo = await CouponModel.findOne({couponId: params.couponId}, '-_id')
            if (couponInfo.sendNum === 0) {
                res.send({
                    code: 400,
                    message: '优惠券已经领完了'
                })
                return
            }
        } catch (err) {
            res.send({
                code: 400,
                message: '优惠券不存在'
            })
        }

        try {
            let id = await this.getId('user_coupon_id')
            params.id = id
        } catch (err) {
            console.log('user_coupon_id失败')
            throw new Error(err)
        }

        try {
            await UserCouponModel.create({
                userCouponId: params.id,
                userId: userId,
                couponId: params.couponId,
                couponStatus: 1,
                createTime: parseInt(new Date() / 1000)
            })

            if (couponInfo.sendNum > 0) {
                couponInfo.sendNum--
            }
            await CouponModel.findOneAndUpdate({couponId: params.couponId}, {$set: {sendNum: couponInfo.sendNum}})
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
     * @api {post} /user/collection/delete 3. 浏览记录删除
     * @apiName collectionDelete
     * @apiGroup appCollectionGroup
     * @apiHeader {String} Authorization token
     * @apiParam {Number} collectionId 记录id
     * @apiVersion 1.0.0
     */
    async delete (req, res, next) {
        let id = req.body.collectionId
        if (!id || !Number(id)) {
            console.log('id参数错误')
            res.send({
                code: 400,
                message: 'id参数错误'
            })
            return
        }

        try {
            let del = await CouponModel.findOneAndRemove({ collectionId: id })
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
}

export default new UserCoupon()