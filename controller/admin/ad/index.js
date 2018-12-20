import mongoose from 'mongoose'
import AdModel from '../../../models/ad/index'
import BaseComponent from '../../../prototype/base'

class Ad extends BaseComponent {
    constructor () {
        super()
        this.add = this.add.bind(this)
    }

    async list (req, res, next) {
        const {page = 1, size = 0} = req.query
        try {
            const adList = await AdModel.find({}, '-_id').sort({order: -1}).skip(Number(page)).limit(Number(size))
            res.send({
                code: 200,
                data: adList
            })
        } catch (err) {
            res.send({
                code: 400,
                message: '获取广告列表失败'
            })
        }
    }

    async add (req, res, next) {
        let form = req.body
        try {
            if (!form.title) {
                throw new Error('请输入标题');
            }
        } catch (err) {
            console.log('前台参数错误:', err.message)
            res.send({
                code: 400,
                type: 'ERROR_PARAMS',
                message: err.message
            })
            return
        }

        try {
            let id = await this.getId('ad_id')
            form.id = id
        } catch (err) {
            console.log('获取ad_id失败')
            throw new Error(err)
        }

        try {
            form.createTime = parseInt(new Date() / 1000)
            await AdModel.create(form)
            res.send({
                code: 200,
                message: '操作成功'
            })
        } catch (err) {
            console.log(err)
            res.send({
                code: 400,
                message: '操作失败'
            })
        }
    }
    
    // async delete (req, res, next) {
    //     try {
    //         await Ad.findOneAndRemove({ title: req.params.title})
    //         res.send({
    //             code: 200,
    //             message: '操作成功'
    //         })
    //     } catch (err) {
    //         res.send({
    //             code: 400,
    //             message: '删除失败'
    //         })
    //     }
    // }

    // async update (req, res , next) {
    //     try {
    //         await Ad.findOneAndUpdate({id: req.params.id}, {$set: req.params})
    //         res.send({
    //             code: 200,
    //             message: '操作成功'
    //         })
    //     } catch (err) {
    //         res.send({
    //             code: 400,
    //             message: '更新失败'
    //         })
    //     }
    // }
}

export default new Ad()