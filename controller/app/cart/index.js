import mongoose from 'mongoose'
import config from 'config'
import CartModel from '../../../models/cart/index'
import GoodsModel from '../../../models/goods/index'
import BaseComponent from '../../../prototype/base'
/**
 * @apiDefine appCartGroup app-购物车模块
 */

/**
 * @api {post} / 0. 购物车表
 * @apiName cart
 * @apiGroup appCartGroup
 * @apiSuccess {Number} adId 广告id
 * @apiSuccess {title} adId 广告标题
 * @apiSuccess {Number} adTypeId 广告类型
 * @apiVersion 1.0.0
 */
class Cart extends BaseComponent {
    constructor () {
        super()
        this.global = config.get('Customer.global')
        this.cartList = this.cartList.bind(this)
        this.cartAdd = this.cartAdd.bind(this)
        this.cartDelete = this.cartDelete.bind(this)
        this.cartUpdate = this.cartUpdate.bind(this)
        this.cartSelectedUpdate = this.cartSelectedUpdate.bind(this)
        this.cartSelectedAllUpdate = this.cartSelectedAllUpdate.bind(this)
    }
    /*
    *
    */
    async cartList (req, res, next) {
        let userId = this.getUserId(req.get('Authorization'))
        const {page = 0, size = 20} = req.body
        try {
            let list = await CartModel.findOne({userId: userId}, ['-_id', '-createTime', '-userId'])

            if (list) {
                for (let item of list.goodsList) {
                    item.goodsInfo = await GoodsModel.findOne({goodsId: item.goodsId}, '-_id')
                    if (item.goodsSpec.list) {
                        item.openSpec = true
                    }
                    item.goodsInfo.goodsImage = this.global.imageHost + item.goodsInfo.goodsImage
                }
                list.freightMoney = this.global.freightMoney
                list.freeFreightMoney = this.global.freeFreightMoney
            }
           
            res.send({
                code: 200,
                data: list || []
            })
        } catch (err) {
            console.log('err', err)
            res.send({
                code: 400,
                message: '获取购物车列表失败'
            })
        }
    }

    async cartAdd (req, res, next) {
        let userId = this.getUserId(req.get('Authorization'), res)
        let params = req.body
        params.goodsId = parseInt(params.goodsId)
        params.goodsNum = parseInt(params.goodsNum)
        if (params.goodsSpec.list) {
            params.goodsSpec.openSpec = true
        } else {
            params.goodsSpec.openSpec = false
        }
        try {
            if (!params.goodsId) {
                throw new Error('商品id不存在');
            }
            if (params.goodsNum < 1) {
                throw new Error('商品数量不能低于1');
            }
        } catch (err) {
            console.log('前台参数错误:', err.message)
            res.send({
                code: 400,
                message: err.message
            })
            return
        }
        
        let cartInfo = await CartModel.findOne({userId: userId}, '-_id')
        
        // console.log('cartInfo', cartInfo)
        if (cartInfo) {
            // 判断购物车里，是否有商品了
            let isAdd = true
            cartInfo.goodsList.forEach(item => {
                if (item.goodsId == params.goodsId && JSON.stringify(item.goodsSpec.list.sort()) === JSON.stringify(params.goodsSpec.list.sort())) {
                    item.goodsNum = item.goodsNum + params.goodsNum
                    isAdd = false
                }
            })

            if (isAdd) {
                try {
                    let cartGoodsId
                    try {
                        cartGoodsId = await this.getId('cart_goods_id')
                    } catch (err) {
                        throw new Error(err)
                    }
                    let goods = {
                        cartGoodsId: cartGoodsId,
                        goodsId: params.goodsId,
                        goodsNum: params.goodsNum,
                        goodsSpec: params.goodsSpec,
                        selected: false
                    }
                    cartInfo.goodsList.push(goods)
                    await CartModel.findOneAndUpdate({userId: userId}, {$set: {goodsList: cartInfo.goodsList}})
                } catch (err) {
                    throw new Error(err)
                }
            } else {
                try {
                    await CartModel.findOneAndUpdate({userId: userId}, {$set: {goodsList: cartInfo.goodsList}})
                } catch (err) {
                    throw new Error(err)
                }
            }
            res.send({
                code: 200,
                message: '添加成功'
            })
        } else {
            try {
                let cartId
                try {
                    cartId = await this.getId('cart_id')
                } catch (err) {
                    throw new Error(err)
                }

                let cartGoodsId
                try {
                    cartGoodsId = await this.getId('cart_goods_id')
                } catch (err) {
                    throw new Error(err)
                }
                let goodsList = []
                let goods = {
                    cartGoodsId: cartGoodsId,
                    goodsId: params.goodsId,
                    goodsNum: params.goodsNum,
                    goodsSpec: params.goodsSpec,
                    selected: false
                }
                goodsList.push(goods)
                await CartModel.create({
                    cartId: cartId,
                    userId: userId,
                    goodsList: goodsList,
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
    }

    async cartDelete (req, res, next) {
        let userId = this.getUserId(req.get('Authorization'))
        let cartGoodsId = req.body.cartGoodsId

        if (!cartGoodsId || !Number(cartGoodsId)) {
            console.log('cartGoodsId参数错误')
            res.send({
                code: 400,
                message: 'Id参数错误'
            })
            return
        }

        try {
            let cartInfo = await CartModel.findOne({userId: userId}, '-_id')
            
            let list = new Set(cartInfo.goodsList)
            for (let item of list) {
                if (item.cartGoodsId === cartGoodsId) {
                    list.delete(item)
                }
            }
            await CartModel.findOneAndUpdate({userId: userId}, {$set: {goodsList: [...list]}})
            res.send({
                code: 200,
                message: '删除成功'
            })
        } catch (err) {
            res.send({
                code: 400,
                message: '删除失败'
            })
        }
    }

    async cartUpdate (req, res, next) {
        let userId = this.getUserId(req.get('Authorization'))
        let params = req.body
        
        try {
            if (!params.cartGoodsId || !Number(params.cartGoodsId)) {
                throw new Error('cartGoodsId参数错误');
            }
            if (params.goodsNum < 1 || !Number(params.goodsNum)) {
                throw new Error('商品数量不能低于1');
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
            let cartInfo = await CartModel.findOne({userId: userId}, '-_id')
            console.log(cartInfo)
            // let list = new Set(cartInfo.goodsList)
            for (let item of cartInfo.goodsList) {
                if (item.cartGoodsId === params.cartGoodsId) {
                    item.goodsNum = params.goodsNum
                }
            }
            console.log(cartInfo.goodsList)
            await CartModel.findOneAndUpdate({userId: userId}, {$set: {goodsList: cartInfo.goodsList}})
            res.send({
                code: 200,
                message: '修改成功'
            })
        } catch (err) {
            res.send({
                code: 400,
                message: '修改失败'
            })
        }
    }

    async cartSelectedUpdate (req, res, next) {
        let userId = this.getUserId(req.get('Authorization'))
        let cartGoodsId = req.body.cartGoodsId
        let selected = req.body.selected
        try {
            if (!cartGoodsId || !Number(cartGoodsId)) {
                throw new Error('cartGoodsId参数错误')
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
            let cartInfo = await CartModel.findOne({userId: userId}, '-_id')
            for (let item of cartInfo.goodsList) {
                if (item.cartGoodsId === cartGoodsId) {
                    item.selected = selected
                }
            }
            await CartModel.findOneAndUpdate({userId: userId}, {$set: {goodsList: cartInfo.goodsList}})
            res.send({
                code: 200,
                message: '修改成功'
            })
        } catch (err) {
            console.log('err:', err)
            res.send({
                code: 400,
                message: '修改失败'
            })
        }
    }

    async cartSelectedAllUpdate (req, res, next) {
        let userId = this.getUserId(req.get('Authorization'))
        let selected = req.body.selected
        
        try {
            let cartInfo = await CartModel.findOne({userId: userId}, '-_id')
            for (let item of cartInfo.goodsList) {
                    item.selected = selected
            }
            await CartModel.findOneAndUpdate({userId: userId}, {$set: {goodsList: cartInfo.goodsList}})
            res.send({
                code: 200,
                message: '修改成功'
            })
        } catch (err) {
            res.send({
                code: 400,
                message: '修改失败'
            })
        }
    }
}

export default new Cart()
