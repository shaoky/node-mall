import mongoose from 'mongoose'
import config from 'config'
import CartModel from '../../../models/cart/index'
import GoodsModel from '../../../models/goods/index'
import BaseComponent from '../../../prototype/base'

class Cart extends BaseComponent {
    constructor () {
        super()
        this.dbConfig = config.get('Customer.global')
        this.cartList = this.cartList.bind(this)
        this.cartAdd = this.cartAdd.bind(this)
    }
    /*
    *
    */
    async cartList (req, res, next) {
        let userId = this.getUserId(req.get('Authorization'))
        const {page = 0, size = 20} = req.body
        try {
            let list = await CartModel.findOne({userId: userId}, '-_id')
            for (let item of list.goodsList) {
                item.goodsInfo = await GoodsModel.findOne({id: item.goodsId}, '-_id')
            }
            res.send({
                code: 200,
                data: list
            })
        } catch (err) {
            console.log('err', err)
            res.send({
                code: 400,
                message: '获取商品列表失败'
            })
        }
    }

    async cartAdd (req, res, next) {
        let userId = this.getUserId(req.get('Authorization'))
        let params = req.body
        params.goodsId = parseInt(params.goodsId)
        params.goodsNum = parseInt(params.goodsNum)
        try {
            if (!params.goodsId) {
                throw new Error('无效的商品');
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

        let cartId
        try {
            cartId = await this.getId('cart_id')
        } catch (err) {
            throw new Error(err)
        }

        let cartInfo = await CartModel.findOne({userId: userId}, '-_id')
        
        // console.log(cartInfo)
        if (cartInfo) {
            // 判断购物车里，是否有商品了
            let isAdd = true
            cartInfo.goodsList.forEach(item => {
                if (item.goodsId == params.goodsId) {
                    item.goodsNum = item.goodsNum + params.goodsNum
                    isAdd = false
                }
            })

            if (isAdd) {
                try {
                    let goods = {
                        goodsId: params.goodsId,
                        goodsNum: params.goodsNum
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
                let goodsList = []
                let goods = {
                    goodsId: params.goodsId,
                    goodsNum: params.goodsNum
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
}

export default new Cart()
