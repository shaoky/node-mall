import mongoose from 'mongoose'
import config from 'config'
import GoodsModel from '../../../models/goods/index'
import GoodsSpecModel from '../../../models/goods/spec'
import BaseComponent from '../../../prototype/base'
/**
 * @apiDefine adminGoodsGroup admin-商品模块
 */

/**
 * @api {post} / 0. 商品规格表
 * @apiName goods
 * @apiGroup appGoodsSpecGroup
 * @apiSuccess {Number} goodsId 商品id
 * @apiVersion 1.0.0
 */
class GoodsSpec extends BaseComponent {
    constructor () {
        super()
        this.goodsSpecAdd = this.goodsSpecAdd.bind(this)
    }
    /**
     * @api {post} /goods/spec/add 1. 规格添加
     * @apiName goodsSpecAdd
     * @apiGroup appGoodsGroup
     * @apiHeader {String} Authorization token
     * @apiParam {String} goodsId 商品id
     * @apiParam {Array} goodsSpecList 商品规格列表
     * @apiVersion 1.0.0
     */
    async goodsSpecAdd (req, res, next) {
        console.log(req.body)
        let params = req.body

        try {
            if (!params.goodsId || !Number(params.goodsId)) {
                throw new Error('商品id出错拉')
            }
        } catch (err) {
            console.log('前台参数错误:', err.message)
            res.send({
                code: 403,
                message: err.message
            })
            return
        }

        let goodsSpecId
        try {
            goodsSpecId = await this.getId('goods_spec_id')
        } catch (err) {
            console.log('goodsSpecId失败')
            throw new Error(err)
        }

        try {
            
            await GoodsSpecModel.create({
                goodsSpecId: goodsSpecId,
                goodsId: params.goodsId,
                goodsAttrList: params.goodsAttrList,
                goodsSpecList: params.goodsSpecList
            })
            
            // 更新主表的规格id
            console.log(params.goodsId)
            let a = await GoodsModel.findOneAndUpdate({goodsId: params.goodsId}, {$set: {goodsSpecId: goodsSpecId}})
            console.log(a)
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

export default new GoodsSpec()