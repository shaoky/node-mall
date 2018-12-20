import mongoose from 'mongoose'
import config from 'config'
import PanicModel from '../../../models/panic/index'
import BaseComponent from '../../../prototype/base'

class Panic extends BaseComponent {
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
            let list = await PanicModel.find(search, '-_id').sort({order: -1}).skip(Number(page*size)).limit(Number(size))
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
        console.log(req.body)
        let params = req.body
        try {
            if (!params.title) {
                throw new Error('请输入抢购活动标题')
            }
        } catch (err) {
            console.log('前台参数错误:', err.message)
            res.send({
                code: 403,
                message: err.message
            })
            return
        }

        // let goodsId
        // try {
        //     goodsId = await this.getId('goods_id')
        // } catch (err) {
        //     console.log('goods_id失败')
        //     throw new Error(err)
        // }

        let goodsPanicId
        try {
            goodsPanicId = await this.getId('goods_panic_id')
        } catch (err) {
            console.log('goodsSpecId失败')
            throw new Error(err)
        }

        try {
            await PanicModel.create({
                goodsPanicId: goodsPanicId,
                title: params.title,
                desc: params.desc,
                startTime: params.startTime,
                endTime: params.endTime,
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

    /**
     * 抢购商品
     */
    async add (req, res, next) {
        let params = req.body
        try {
            if (!params.title) {
                throw new Error('请输入抢购活动标题')
            }
        } catch (err) {
            console.log('前台参数错误:', err.message)
            res.send({
                code: 403,
                message: err.message
            })
            return
        }

        // let goodsId
        // try {
        //     goodsId = await this.getId('goods_id')
        // } catch (err) {
        //     console.log('goods_id失败')
        //     throw new Error(err)
        // }

        let goodsPanicId
        try {
            goodsPanicId = await this.getId('goods_panic_id')
        } catch (err) {
            console.log('goodsSpecId失败')
            throw new Error(err)
        }

        try {
            await PanicModel.create({
                goodsPanicId: goodsPanicId,
                title: params.title,
                desc: params.desc,
                startTime: params.startTime,
                endTime: params.endTime,
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

}

export default new Panic()