import mongoose from 'mongoose'
import config from 'config'
import goodsModel from '../../../models/goods/index'
import BaseComponent from '../../../prototype/base'

class Goods extends BaseComponent {
    constructor () {
        super()
        this.dbConfig = config.get('Customer.global')
        this.goodsList = this.goodsList.bind(this)
        this.goodsInfo = this.goodsInfo.bind(this)
        this.goodsAllList = this.goodsAllList.bind(this)
    }
    /*
    *
    */
    async goodsList (req, res, next) {
        const {page = 0, size = 20} = req.body
        try {
            let list = await goodsModel.find({}, '-_id').sort({order: -1}).skip(Number(page*size)).limit(Number(size))
            list.forEach(item => {
                if (item.goodsImage) {
                    item.goodsImage = this.dbConfig.imageHost + item.goodsImage
                } else {
                    item.goodsImage = ''
                }
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

    async goodsInfo (req, res, next) {
        let params = req.body
        try {
            let goodsInfo = await goodsModel.findOne({id: params.id}, '-_id')
            goodsInfo.goodsImage = this.dbConfig.imageHost + goodsInfo.goodsImage
            goodsInfo.goodsImageBanner = goodsInfo.goodsImageBanner.map(item => {
                return this.dbConfig.imageHost + item
            })
            goodsInfo.goodsImageDetail = goodsInfo.goodsImageDetail.map(item => {
                return this.dbConfig.imageHost + item
            })
            res.send({
                code: 200,
                data: goodsInfo
            })
        } catch (err) { 
            console.log('err', err)
            res.send({
                code: 400,
                message: '获取商品详情失败'
            })
        }
    }

    async goodsAllList (req, res, next) {
        const {page = 0, size = 20} = req.body
        const goodsName = new RegExp(req.body.goodsName, 'i')
        try {
            let list = await goodsModel.find({
                $or: [{'goodsName': {$regex: goodsName}}]
            }, '-_id').sort({order: -1}).skip(Number(page*size)).limit(Number(size))
            list.forEach(item => {
                if (item.goodsImage) {
                    item.goodsImage = this.dbConfig.imageHost + item.goodsImage
                } else {
                    item.goodsImage = ''
                }
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

    async goodsCategoryList (req, res, next) {
        res.send({
            code: 200,
            data: [{
                id: 1,
                categoryName: '男装',
                children: [{
                    id: 100,
                    categoryName: '衬衫'
                },{
                    id: 101,
                    categoryName: '裤子'
                }]
            },{
                id: 2,
                categoryName: '女装',
                children: [{
                    id: 110,
                    categoryName: '上衣'
                },{
                    id: 111,
                    categoryName: '裙子'
                }]
            },{
                id: 3,
                categoryName: '儿童',
                children: [{
                    id: 120,
                    categoryName: '上衣'
                },{
                    id: 121,
                    categoryName: '裙子'
                }]
            }]
        })
    }
}

export default new Goods()