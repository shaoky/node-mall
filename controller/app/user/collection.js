import mongoose from 'mongoose'
import CollectionModel from '../../../models/user/collection'
import BaseComponent from '../../../prototype/base'

/**
 * @apiDefine appCollectionGroup app-用户浏览记录
 */

/**
 * @api {post} / 0. 浏览记录表
 * @apiName collection
 * @apiGroup appCollectionGroup
 * @apiSuccess {Number} collectionId 记录id
 * @apiVersion 1.0.0
 */
class Collection extends BaseComponent {
    constructor () {
        super()
        this.add = this.add.bind(this)
        this.list = this.list.bind(this)
        this.delete = this.delete.bind(this)
    }
    /**
     * @api {post} /user/collection/list 1. 收藏列表
     * @apiName collectionList
     * @apiGroup appCollectionGroup
     * @apiHeader {String} Authorization token
     * @apiParam {Number} page = 0 页面
     * @apiParam {Number} size = 20 数量
     * @apiVersion 1.0.0
     */
    async list (req, res, next) {
        let userId = this.getUserId(req.get('Authorization'))
        const {page = 0, size = 20} = req.body
        try {
            let list = await CollectionModel.find({userId: userId}, '-_id').skip(Number(page*size)).limit(Number(size))
            res.send({
                code: 200,
                data: list
            })
        } catch (err) {
            console.log('err', err)
            res.send({
                code: 400,
                message: '获取收藏列表失败'
            })
        }
    }
    /**
     * @api {post} /user/collection/add 2. 浏览记录新增
     * @apiName collectionAdd
     * @apiGroup appCollectionGroup
     * @apiHeader {String} Authorization token
     * @apiParam {Number} goodsId 商品id
     * @apiVersion 1.0.0
     */
    async add (req, res, next) {
        let form = req.body
        try {
            if (!form.goodsId) {
                throw new Error('goodsId不存在');
            }
        } catch (err) {
            console.log('前台参数错误:', err.message)
            res.send({
                code: 400,
                message: err.message
            })
            return
        }
        let userId = this.getUserId(req.get('Authorization'))
        if (userId.code === 401) {
            res.send(userId)
            return
        }

        try {
            let id = await this.getId('collection_id')
            form.id = id
        } catch (err) {
            console.log('collection_id失败')
            throw new Error(err)
        }

        console.log(form.id)
        try {
            await CollectionModel.create({
                collectionId: form.id,
                userId: userId,
                goodsId: form.goodsId,
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
            let del = await CollectionModel.findOneAndRemove({ collectionId: id })
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

export default new Collection()