import mongoose from 'mongoose'
import config from 'config'
import PanicGoodsModel from '../../../models/panic/goods'
import BaseComponent from '../../../prototype/base'

class PanicGoods extends BaseComponent {
    constructor () {
        super()
        this.add = this.add.bind(this)
    }
    async list (req, res, next) {
        const dbConfig = config.get('Customer.dbConfig')
        const {page = 0, size = 20} = req.query
        let search = {
            isOpen: true
        }
        try {
            let list = await PanicGoodsModel.find(search, '-_id').sort({order: -1}).skip(Number(page*size)).limit(Number(size))
            list.forEach(item => {
                item.goodsImage = dbConfig.host + item.goodsImage
            })
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

    async add (req, res, next) {
        let params = req.body
        try {
            if (!params.goodsId) {
                throw new Error('请选择商品')
            }
            if (!params.panicMoney) {
                throw new Error('请输入抢购价')
            }
            if (!params.panicMoney) {
                throw new Error('请输入抢购价')
            }
            if (!params.goodsStock) {
                throw new Error('请输入商品库存')
            }
        } catch (err) {
            console.log('前台参数错误:', err.message)
            res.send({
                code: 403,
                message: err.message
            })
            return
        }

        let panicGoodsId
        try {
            panicGoodsId = await this.getId('panic_goods_id')
        } catch (err) {
            console.log('panicGoodsId失败')
            throw new Error(err)
        }

        try {
            await PanicGoodsModel.create({
                panicGoodsId: panicGoodsId,
                goodsId: params.goodsId,
                panicMoney: params.panicMoney,
                goodsStock: params.goodsStock,
                goodsSales: params.goodsSales,
                goodsVirtualSales: params.goodsVirtualSales || 0,
                isOpen: params.isOpen,
                order: params.order || 100,
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
    
    async delete (req, res, next) {
        let goodsId = req.body.id
        if (!goodsId || !Number(goodsId)) {
            console.log('goodsId参数错误')
            res.send({
                code: 400,
                message: 'id参数错误'
            })
            return
        }

        try {
            let del = await GoodsModel.findOneAndRemove({ id: goodsId })
            if (del) {
                res.send({
                    code: 200,
                    message: '删除成功'
                })
            } else {
                res.send({
                    code: 400,
                    message: '该商品不存在'
                })
            }
            
        } catch (err) {
            res.send({
                code: 400,
                message: '删除失败'
            })
        }
    }

    async update (req, res, next) {
        let params = req.body
        if (!params.id || !Number(params.id)) {
            console.log('goodsId参数错误')
            res.send({
                code: 400,
                message: 'id参数错误'
            })
            return
        }

        const form = {
            goodsName: params.goodsName,
            goodsThums: params.goodsThums,
            marketPrice: params.marketPrice,
            shopPrice: params.shopPrice,
            goodsStock: params.goodsStock,
            goodsDesc: params.goodsDesc,
            isSale: params.isSale,
            isHot: params.isHot,
            goodsFlag: params.goodsFlag,
            order: params.order
        }

        for (let item of Object.keys(form)) {
            if (typeof form[item] === 'undefined') {
                delete form[item]
            }
        }

        try {
            await GoodsModel.findOneAndUpdate({goodsId: req.body.id}, {$set: form})
            res.send({
                code: 200,
                message: '更新成功'
            })
        } catch (err) {
            res.send({
                code: 400,
                message: '更新失败'
            })
        }
    }

    set (req, res, next) {
        console.log(req.body)
    }

}

export default new PanicGoods()