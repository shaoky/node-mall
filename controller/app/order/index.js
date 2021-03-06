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
        this.userOrderList = this.userOrderList.bind(this)
        this.userOrderInfo = this.userOrderInfo.bind(this)
        this.userOrderStatusUpdate = this.userOrderStatusUpdate.bind(this)
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
        let userId = this.getUserId(req.get('Authorization'), res)
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
        let freightMoney = 0

        if (params.goodsSpec) {
            payMoney =  parseInt(params.goodsSpec.shopPrice) * parseInt(params.goodsNum)
        } else {
            payMoney =  parseInt(goodsInfo.shopPrice) * parseInt(params.goodsNum)
        }
        
       
        if (payMoney > this.config.freeFreightMoney) {
            freightMoney = 0
        } else {
            freightMoney = this.config.freightMoney
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
                payMoney: payMoney + freightMoney,
                freightMoney: freightMoney
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
        let userId = this.getUserId(req.get('Authorization'), res)
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
        let freightMoney = 0

        for (let item of cartData.goodsList) {
            if (item.goodsSpec.openSpec) {
                totalMoney += parseInt(item.goodsSpec.shopPrice) * parseInt(item.goodsNum)
            } else {
                totalMoney += parseInt(item.goodsInfo.shopPrice) * parseInt(item.goodsNum)
            }
            item.goodsInfo.goodsImageFull = this.config.imageHost + item.goodsInfo.goodsImage
        }

        // 运费
        if (totalMoney > this.config.freeFreightMoney) {
            freightMoney = 0
        } else {
            freightMoney = this.config.freightMoney
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
                payMoney: totalMoney + freightMoney,
                freightMoney: freightMoney
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
            let freightMoney
            // 运费
            if (totalMoney > this.config.freeFreightMoney) {
                freightMoney = 0
            } else {
                freightMoney = this.config.freightMoney
            }
            // let deliverMoney = this.systemConfig().deliverMoney
            let payMoney = totalMoney + freightMoney
            
            await OrderModel.create({
                orderId: orderId,
                userId: userId,
                orderNo: orderNo,
                goodsList: params.goodsList,
                userAddress: addressInfo,
                freightMoney: freightMoney,
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
     * 用户订单
     */
    async userOrderList (req, res, next) {
        let userId = this.getUserId(req.get('Authorization'), res)
        let { page = 0, size = 20, orderStatus = 0 } = req.body
        let params = {
            userId: userId,
            orderStatus: orderStatus
        }
        if (orderStatus === 0) {
            delete params.orderStatus
        }
        let list = await OrderModel.find(params, '-_id').sort({_id: -1}).skip(Number(page*size)).limit(Number(size))
        // console.log(list)

        let orderList = new Set(list)
        // let orderList = list.map(item => {
        //     console.log(typeof item.goodsList)
        //     item.goodsList.goodsInfo.goodsImage = this.config.imageHost + item.goodsList.goodsInfo.goodsImage
        //     return item
        // })
        for (let item of orderList) {
            for (let item1 of item.goodsList) {
                // console.log(item1)
                item1.goodsInfo.goodsImage = this.config.imageHost + item1.goodsInfo.goodsImage
            }
            switch (item.orderStatus) {
                case 1:
                    item.orderStatusName = '待付款'
                    break
                case 2:
                    item.orderStatusName = '待发货'
                    break
                case 3:
                    item.orderStatusName = '待收货'
                    break
                case 7:
                    item.orderStatusName = '已取消'
                    break
            }
        }
        res.send({
            code: 200,
            data: [...orderList]
        })
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
            orderInfo.goodsImage = this.config.imageHost + orderInfo.goodsImage
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

    /**
     * 编辑订单状态
     */
    async userOrderStatusUpdate (req, res, next) {
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
        console.log(1)

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
}

export default new Order()
