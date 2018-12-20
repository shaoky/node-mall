import mongoose from 'mongoose'
import ArticleModel from '../../../models/article/index'
import BaseComponent from '../../../prototype/base'

/**
 * @apiDefine appArticleGroup admin-文章分类管理
 */

/**
 * @api {post} / 0. 文章分类表
 * @apiName article
 * @apiGroup appArticleGroup
 * @apiSuccess {Number} articleId 记录id
 * @apiVersion 1.0.0
 */
class Article extends BaseComponent {
    constructor () {
        super()
        this.add = this.add.bind(this)
        this.list = this.list.bind(this)
        this.delete = this.delete.bind(this)
    }
    /**
     * @api {post} /admin/article/list 1. 文章列表
     * @apiName articelList
     * @apiGroup appArticleGroup
     * @apiHeader {String} Authorization token
     * @apiParam {Number} page = 0 页面
     * @apiParam {Number} size = 20 数量
     * @apiVersion 1.0.0
     */
    async list (req, res, next) {
        let userId = this.getUserId(req.get('Authorization'), res)
        const {page = 0, size = 20} = req.body
        try {
            let list = await ArticleModel.find({}, '-_id').skip(Number(page*size)).limit(Number(size))
            res.send({
                code: 200,
                data: list
            })
        } catch (err) {
            console.log('err', err)
            res.send({
                code: 400,
                message: '获取文章列表失败'
            })
        }
    }
    /**
     * @api {post} /admin/article/add 2. 文章新增
     * @apiName articleAdd
     * @apiGroup appArticleGroup
     * @apiHeader {String} Authorization token
     * @apiParam {Number} title 文章标题
     * @apiParam {String} [imageUrl] 文章图片
     * @apiParam {Number} isShow 是否开启
     * @apiVersion 1.0.0
     */
    async add (req, res, next) {
        let userId = this.getUserId(req.get('Authorization'), res)
        let params = req.body
        try {
            if (!params.articleTypeId) {
                throw new Error('articleTypeId参数出错')
            }
            if (!params.title) {
                throw new Error('请输入文章标题')
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
            let id = await this.getId('article_id')
            params.id = id
        } catch (err) {
            console.log('article_id失败')
            throw new Error(err)
        }

        try {
            await ArticleModel.create({
                articleId: params.id,
                articleTypeId: params.articleTypeId,
                title: params.title,
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
     * @api {post} /admin/article/delete 3. 文章删除
     * @apiName articleDelete
     * @apiGroup appArticleGroup
     * @apiHeader {String} Authorization token
     * @apiParam {Number} articleId 记录id
     * @apiVersion 1.0.0
     */
    async delete (req, res, next) {
        let id = req.body.articleId
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
            let del = await ArticleModel.findOneAndRemove({ articleId: id })
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
     * @api {post} /admin/article/update 4. 文章分类更新
     * @apiName articleUpdate
     * @apiGroup appArticleGroup
     * @apiHeader {String} Authorization token
     * @apiParam {Number} articleId 记录id
     * @apiParam {String} title 文章标题
     * @apiParam {Boolean} isShow 是否开启
     * @apiVersion 1.0.0
     */
    async update (req, res, next) {
        let params = req.body
        try {
            if (!params.articleId || !Number(params.articleId)) {
                throw new Error('articleId参数错误')
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
            title: params.title,
            isShow: params.isShow
        }

        // for (let item of Object.keys(form)) {
        //     if (typeof form[item] === 'undefined') {
        //         delete form[item]
        //     }
        // }

        try {
            await ArticleModel.findOneAndUpdate({articleId: params.articleId}, {$set: form})
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

export default new Article()