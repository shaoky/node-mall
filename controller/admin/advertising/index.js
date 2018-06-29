import mongoose from 'mongoose'
import advertising from '../../../models/admin/advertising/index'
// import register from '../../../models/admin/login/register'

class Advertising {
    constructor () {
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
        try {
            const adList = await advertising.find({}, null, {sort: [['order', -1]]}, '-_id')
            console.log(adList)
            res.send({
                status: 200,
                data: adList
            })
        } catch (err) {
            res.send({
                message: '获取广告列表失败'
            })
        }
    }

    async add (req, res, next) {
        // console.log(req.query)
        // try {
        //     const adList = await advertising.find({}, null, {sort: [['_id', 1]]}, '-_id')
        //     console.log(adList)
        //     res.send({
        //         status: 200,
        //         data: adList
        //     })
        // } catch (err) {
        //     res.send({
        //         message: '获取广告列表失败'
        //     })
        // }
    }
}

export default new Advertising()