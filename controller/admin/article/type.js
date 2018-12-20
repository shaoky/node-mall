import mongoose from 'mongoose'
import ArticleTypeModel from '../../../models/article/type'
import BaseComponent from '../../../prototype/base'

/**
 * @apiDefine appArticleTypeGroup admin-文章分类管理
 */

/**
 * @api {post} / 0. 文章分类表
 * @apiName articleType
 * @apiGroup appArticleTypeGroup
 * @apiSuccess {Number} articleTypeId 记录id
 * @apiVersion 1.0.0
 */
class ArticleType extends BaseComponent {
    constructor () {
        super()
        this.add = this.add.bind(this)
        this.list = this.list.bind(this)
        this.delete = this.delete.bind(this)
    }
    /**
     * @api {post} /admin/article/type/list 1. 文章分类列表
     * @apiName articelTypeList
     * @apiGroup appArticleTypeGroup
     * @apiHeader {String} Authorization token
     * @apiParam {Number} page = 0 页面
     * @apiParam {Number} size = 20 数量
     * @apiVersion 1.0.0
     */
    async list (req, res, next) {
        let userId = this.getUserId(req.get('Authorization'), res)
        const {page = 0, size = 20} = req.body
        try {
            let list = await ArticleTypeModel.find({}, '-_id').skip(Number(page*size)).limit(Number(size))
            res.send({
                code: 200,
                data: list
            })
        } catch (err) {
            console.log('err', err)
            res.send({
                code: 400,
                message: '获取文章分类列表失败'
            })
        }
    }
    /**
     * @api {post} /admin/article/type/add 2. 文章分类新增
     * @apiName articleTypeAdd
     * @apiGroup appArticleTypeGroup
     * @apiHeader {String} Authorization token
     * @apiParam {Number} typeName 文章分类名称
     * @apiParam {String} [imageUrl] 文章分类图片
     * @apiParam {Number} isShow 是否开启
     * @apiVersion 1.0.0
     */
    async add (req, res, next) {
        let userId = this.getUserId(req.get('Authorization'), res)
        let params = req.body
        try {
            if (!params.typeName) {
                throw new Error('请输入类型名称')
            }
            if (!params.isShow) {
                throw new Error('请设置是否开启')
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
            let id = await this.getId('article_type_id')
            params.id = id
        } catch (err) {
            console.log('article_type_id失败')
            throw new Error(err)
        }

        try {
            await ArticleTypeModel.create({
                articleTypeId: params.id,
                typeName: params.typeName,
                imageUrl: params.imageUrl,
                isShow: params.isShow,
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
     * @api {post} /admin/article/type/delete 3. 文章分类删除
     * @apiName articleDelete
     * @apiGroup appArticleTypeGroup
     * @apiHeader {String} Authorization token
     * @apiParam {Number} articleTypeId 记录id
     * @apiVersion 1.0.0
     */
    async delete (req, res, next) {
        let id = req.body.articleTypeId
        console.log(Number(id))
        if (!id || !Number(id)) {
            console.log('id参数错误')
            res.send({
                code: 400,
                message: 'id参数错误'
            })
            return
        }

        try {
            let del = await ArticleTypeModel.findOneAndRemove({ articleTypeId: id })
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
    /**
     * @api {post} /admin/article/type/update 4. 文章分类更新
     * @apiName articleUpdate
     * @apiGroup appArticleTypeGroup
     * @apiHeader {String} Authorization token
     * @apiParam {Number} articleTypeId 记录id
     * @apiParam {String} typeName 分类名称
     * @apiParam {Boolean} isShow 是否开启
     * @apiVersion 1.0.0
     */
    async update (req, res, next) {
        let params = req.body
        try {
            if (!params.articleTypeId || !Number(params.articleTypeId)) {
                throw new Error('articleTypeId参数错误')
            }
            if (!params.isShow) {
                throw new Error('请设置是否开启')
            }
        } catch (err) {
            console.log('前台参数错误:', err.message)
            res.send({
                code: 400,
                message: err.message
            })
            return
        }

        const form = {
            typeName: params.typeName,
            isShow: params.isShow
        }

        // for (let item of Object.keys(form)) {
        //     if (typeof form[item] === 'undefined') {
        //         delete form[item]
        //     }
        // }

        try {
            await ArticleTypeModel.findOneAndUpdate({articleTypeId: params.articleTypeId}, {$set: form})
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

export default new ArticleType()