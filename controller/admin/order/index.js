import mongoose from 'mongoose'
import config from 'config'
import OrderModel from '../../../models/order/index'
import AddressModel from '../../../models/user/address'
import CartModel from '../../../models/cart/index'
import GoodsModel from '../../../models/goods/index'
import BaseComponent from '../../../prototype/base'

/**
 * @apiDefine appOrderGroup app-订单模块
 */

/**
 * @api {post} / 0. 订单表
 * @apiName order
 * @apiGroup appOrderGroup
 * @apiSuccess {Number} orderId 订单id
 * @apiVersion 1.0.0
 */
class Order extends BaseComponent {
    constructor () {
        super()
        this.config = config.get('Customer.global')
        this.orderGoodsPreview = this.orderGoodsPreview.bind(this)
        this.orderCartPreview = this.orderCartPreview.bind(this)
        this.orderAdd = this.orderAdd.bind(this)
        this.setOrderStatus = this.setOrderStatus.bind(this)
    }
    /**
     * @api {post} /order/goodsPriview 1. 产品详情进入订单预览
     * @apiName goodsPriview
     * @apiGroup appOrderGroup
     * @apiHeader {String} Authorization token
     * @apiParam {Number} goodsId 产品id
     * @apiParam {Number} goodsNum 产品数量
     * @apiSuccess {Array} goodsList 见商品表
     * @apiSuccess {String} totalMoney 商品总金额
     * @apiSuccess {String} payMoney 支付金额
     * @apiSuccess {String} deliverMoney 运费
     * @apiVersion 1.0.0
     */
    async orderGoodsPreview (req, res, next) {
        let userId = this.getUserId(req.get('Authorization'))
        let params = req.body
        // console.log(params.goodsIds)
        try {
            if (!params.goodsId || !Number(params.goodsId)) {
                throw new Error('商品id出错')
            }
            if (params.goodsNum < 1 || !Number(params.goodsNum)) {
                throw new Error('商品数量出错')
            }
        } catch (err) {
            console.log('前台参数错误:', err.message)
            res.send({
                code: 400,
                message: err.message
            })
            return
        }
        let goodsList = []
        let goodsInfo = await GoodsModel.findOne({goodsId: params.goodsId}, '-_id')
        goodsInfo.goodsImageFull = this.config.imageHost + goodsInfo.goodsImage
        let order = {
            goodsNum: params.goodsNum,
            goodsInfo: goodsInfo
        }
        goodsList.push(order)

        let payMoney = 0
        let deliverMoney = 0
        payMoney =  parseInt(goodsInfo.shopPrice) * parseInt(params.goodsNum)
       
        if (payMoney > 100) {
            deliverMoney = 0
        } else {
            deliverMoney = this.systemConfig().deliverMoney
        }

        let orderId
        try {
            orderId = await this.getId('order_id')
        } catch (err) {
            throw new Error(err)
        }

        res.send({
            code: 200,
            data: {
                goodsList: goodsList,
                totalMoney: payMoney,
                payMoney: payMoney + deliverMoney,
                deliverMoney: deliverMoney
            }
        })
    }

    /**
     * @api {post} /order/cartPriview 1. 购物车进入订单预览
     * @apiName cartPriview
     * @apiGroup appOrderGroup
     * @apiHeader {String} Authorization token
     * @apiParam {Number} cartId 购物车id
     * @apiSuccess {Array} goodsList 见商品表
     * @apiSuccess {String} totalMoney 商品总金额
     * @apiSuccess {String} payMoney 支付金额
     * @apiSuccess {String} deliverMoney 运费
     * @apiVersion 1.0.0
     */
    async orderCartPreview (req, res, next) {
        let userId = this.getUserId(req.get('Authorization'))
        let params = req.body

        try {
            if (!params.cartId) {
                throw new Error('商品id出错')
            }
        } catch (err) {
            console.log('前台参数错误:', err.message)
            res.send({
                code: 400,
                message: err.message
            })
            return
        }

        let cartData = await CartModel.findOne({cartId: params.cartId}, '-_id')
        cartData.goodsList = cartData.goodsList.filter(item => {
            return item.selected === true
        })
        
        for (let item of cartData.goodsList) {
            let goodsInfo = await GoodsModel.findOne({goodsId: item.goodsId}, '-_id')
            item.goodsInfo = goodsInfo
        }

        let totalMoney = 0
        let deliverMoney = 0

        for (let item of cartData.goodsList) {
            if (item.goodsSpec.openSpec) {
                totalMoney += parseInt(item.goodsSpec.shopPrice) * parseInt(item.goodsNum)
            } else {
                totalMoney += parseInt(item.goodsInfo.shopPrice) * parseInt(item.goodsNum)
            }
            item.goodsInfo.goodsImageFull = this.config.imageHost + item.goodsInfo.goodsImage
        }
        if (totalMoney > 100) {
            deliverMoney = 0
        } else {
            deliverMoney = this.systemConfig().deliverMoney
        }

        let orderId
        try {
            orderId = await this.getId('order_id')
        } catch (err) {
            throw new Error(err)
        }

        res.send({
            code: 200,
            data: {
                totalMoney: totalMoney,
                goodsList: cartData.goodsList,
                payMoney: totalMoney + deliverMoney,
                deliverMoney: deliverMoney
            }
        })
    }

    /**
     * api: /order/add
     * @param {Int} addressId
     * @param {Array} goodsList
     * @param {Int} payType
     * @param {Int} orderFrom
     */
    async orderAdd (req, res, next) {
        let userId = this.getUserId(req.get('Authorization'))
        let params = req.body
        params.goodsId = parseInt(params.goodsId)
        params.goodsNum = parseInt(params.goodsNum)
        try {
            if (!params.addressId) {
                throw new Error('请填写地址')
            }
            if (params.goodsList.length < 0) {
                throw new Error('没有添加商品')
            }
        } catch (err) {
            console.log('前台参数错误:', err.message)
            res.send({
                code: 400,
                message: err.message
            })
            return
        }

        let orderId
        try {
            orderId = await this.getId('order_id')
        } catch (err) {
            throw new Error(err)
        }

        try {
            // 订单编号
            let time =  parseInt(new Date().getTime() / 1000)
            let orderNo = time.toString() + orderId.toString()
            //  查询地址
            let addressInfo = await AddressModel.findOne({userId: userId, addressId: params.addressId}, '-_id')
            // 订单计算价格
            let totalMoney = 0
            for (let item of params.goodsList) {
                if (item.goodsSpec.openSpec) {
                    totalMoney += parseInt(item.goodsSpec.shopPrice) * parseInt(item.goodsNum)
                } else {
                    totalMoney += parseInt(item.goodsInfo.shopPrice) * parseInt(item.goodsNum)
                }
            }
            let deliverMoney = this.systemConfig().deliverMoney
            let payMoney = totalMoney + deliverMoney
            
            await OrderModel.create({
                orderId: orderId,
                userId: userId,
                orderNo: orderNo,
                goodsList: params.goodsList,
                userAddress: addressInfo,
                deliverMoney: deliverMoney,
                totalMoney: totalMoney,
                payMoney: payMoney,
                orderRemarks: params.orderRemarks,
                createTime: parseInt(new Date() / 1000),
            })

            // 添加成功删除购物车
            await CartModel.findOneAndRemove({ userId: userId })
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
     * 编辑订单状态
     */
    async setOrderStatus (req, res, next) {
        let userId = this.getUserId(req.get('Authorization'), res)
        let params = req.body
        
        try {
            if (!params.orderId) {
                throw new Error('订单id出错了')
            }
            if (!params.orderStatus) {
                throw new Error('订单状态出错了')
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
            await OrderModel.findOneAndUpdate({userId: userId, orderId: params.orderId}, {$set: { orderStatus: params.orderStatus }})
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

    async userOrderInfo (req, res, next) {
        let userId = this.getUserId(req.get('Authorization'))
        let orderId = req.body.orderId

        if (!orderId || !Number(orderId)) {
            console.log('orderId参数错误')
            res.send({
                code: 400,
                message: '订单id参数错误'
            })
            return
        }
        
        try {
            let orderInfo = await OrderModel.findOne({userId: userId, orderId: orderId }, '-_id')
            // console.log(orderInfo)
            res.send({
                code: 200,
                data: orderInfo
            })
        } catch (err) { 
            console.log('err', err)
            res.send({
                code: 400,
                message: '获取订单详情失败'
            })
        }
    }
}

export default new Order()
