import mongoose from 'mongoose'
import advertising from '../../../models/advertising/index'
import BaseComponent from '../../../prototype/base'
// import moment from 'moment'

// class BaseComponent {
//     constructor(name) {
//         // this.name = name
//         console.log(name)
//     }

//     abc () {
        
//     }
// }

class Advertising extends BaseComponent {
    constructor () {
        super()
        this.add = this.add.bind(this)
        
        // this.getId('1')
        // console.log(1)
        // this.index()
    }
    /*
    *
    */
    index (req, res, next) {
        const query = req.query
        console.log('列表参数---------', query)
        res.send({
            list: [{
                a: 1
            }]
        })
    }

    async list (req, res, next) {
        // console.log(req.query)
        console.log(new Date())
        const {page = 1, size = 0} = req.query
        try {
            const adList = await advertising.find({}, '-_id').sort({order: -1}).skip(Number(page)).limit(Number(size))
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
        console.log(req.body)
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
            let id = await this.getId('advertising_id')
            form.id = id
        } catch (err) {
            console.log('获取advertising_id失败')
            throw new Error(err)
        }

        try {
            form.createTime = parseInt(new Date() / 1000)
            await advertising.create(form)
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
    
    async delete (req, res, next) {
        console.log(req.params)
        try {
            await advertising.findOneAndRemove({ title: req.params.title})
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
            await advertising.findOneAndUpdate({id: req.params.id}, {$set: req.params})
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

export default new Advertising()