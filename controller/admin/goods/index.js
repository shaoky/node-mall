import mongoose from 'mongoose'
import goodsModel from '../../../models/goods/index'
import BaseComponent from '../../../prototype/base'

class Goods extends BaseComponent {
    constructor () {
        super()
        this.add = this.add.bind(this)
    }
    /*
    *
    */
    async list (req, res, next) {
        // console.log(req.query)
        console.log(new Date())
        const {page = 0, size = 20} = req.query
        try {
            const list = await goodsModel.find({}, '-_id').sort({order: -1}).skip(Number(page*size)).limit(Number(size))
            res.send({
                code: 200,
                data: list
            })
        } catch (err) {
            res.send({
                code: 400,
                message: '获取广告列表失败'
            })
        }
    }

    async add (req, res, next) {
        console.log(req.body)
        let form = req.body
        try {
            if (!form.goodsName) {
                throw new Error('请输入标题');
            }
        } catch (err) {
            console.log('前台参数错误:', err.message)
            res.send({
                code: 403,
                message: err.message
            })
            return
        }

        try {
            let id = await this.getId('goods_id')
            console.log(id)
            form.id = id
        } catch (err) {
            console.log('goods_id失败')
            throw new Error(err)
        }

        console.log(form)

        try {
            form.createTime = parseInt(new Date() / 1000)
            await goodsModel.create(form)
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
        console.log(req.params)
        try {
            await goodsModel.findOneAndRemove({ title: req.params.title})
            res.send({
                code: 200,
                message: '操作成功'
            })
        } catch (err) {
            res.send({
                code: 400,
                message: '删除失败'
            })
        }
    }

    async update (req, res , next) {
        console.log(req.body)
        try {
            await goodsModel.findOneAndUpdate({id: req.params.id}, {$set: req.params})
            res.send({
                code: 200,
                message: '操作成功'
            })
        } catch (err) {
            res.send({
                code: 400,
                message: '更新失败'
            })
        }
    }
}

export default new Goods()