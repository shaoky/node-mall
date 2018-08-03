import mongoose from 'mongoose'
import config from 'config'
import goodsModel from '../../../models/goods/index'
import BaseComponent from '../../../prototype/base'

/**
 * @apiDefine appGoodsGroup app-商品模块
 */

/**
 * @api {post} / 0. 商品表
 * @apiName goods
 * @apiGroup appGoodsGroup
 * @apiSuccess {Number} goodsId 商品id
 * @apiSuccess {String} goodsSn 商品编号
 * @apiSuccess {String} goodsName 商品名称
 * @apiSuccess {String} goodsImageFull 商品图片
 * @apiSuccess {String} goodsThumsFull 商品缩略图
 * @apiSuccess {Array} goodsImageBanner 商品轮播图
 * @apiSuccess {Array} goodsImageDetail 商品详情图
 * @apiSuccess {String} marketPrice 市场价
 * @apiSuccess {String} shopPrice 商品价
 * @apiSuccess {String} goodsStock 商品库存
 * @apiSuccess {String} goodsDesc 商品详情
 * @apiSuccess {Number} goodsStatus 商品状态
 * @apiSuccess {Number} createTime 创建时间
 * @apiSuccess {Number} saleTime 上架时间
 * @apiSuccess {Boolean} isSale 是否上架
 * @apiSuccess {Boolean} isNew 是否新品商品
 * @apiSuccess {Boolean} isHot 是否热卖商品
 * @apiSuccess {Boolean} isRecommend 是否推荐商品
 * @apiSuccess {Boolean} goodsFlag 是否删除商品
 * @apiSuccess {Number} order 排序
 * @apiVersion 1.0.0
 */
class Goods extends BaseComponent {
    constructor () {
        super()
        this.dbConfig = config.get('Customer.global')
        this.goodsList = this.goodsList.bind(this)
        this.goodsInfo = this.goodsInfo.bind(this)
        this.goodsAllList = this.goodsAllList.bind(this)
    }
    /**
     * @api {post} /goods/list 1. 商品列表
     * @apiName list
     * @apiGroup appGoodsGroup
     * @apiHeader {String} Authorization token
     * @apiParam {Number} page = 0 页码
     * @apiParam {Number} size = 20 数量
     * @apiSuccess {Array} data 商品列表，见商品表
     * @apiVersion 1.0.0
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
    /**
     * @api {post} /goods/info 2. 商品详情
     * @apiName info
     * @apiGroup appGoodsGroup
     * @apiHeader {String} Authorization token
     * @apiParam {Number} goodsId 产品id
     * @apiSuccess {Object} data 商品详情，见商品表
     * @apiVersion 1.0.0
     */
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
    /**
     * @api {post} /goodsAll/list 3. 全部商品
     * @apiName goodsAllList
     * @apiGroup appGoodsGroup
     * @apiHeader {String} Authorization token
     * @apiParam {String} [goodsName] 商品名称
     * @apiSuccess {Array} data 商品列表，见商品表
     * @apiVersion 1.0.0
     */
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
    /**
     * @api {post} /goodsCategory/list 4. 商品类别
     * @apiName goodsCategoryList
     * @apiGroup appGoodsGroup
     * @apiHeader {String} Authorization token
     * @apiSuccess {Number} id 主键
     * @apiSuccess {String} categoryName 类别名称
     * @apiSuccess {Array} children 下级
     * @apiVersion 1.0.0
     */
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