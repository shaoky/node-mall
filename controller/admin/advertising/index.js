import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
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
        console.log('登录参数1---------', query)
        if (query.userName == '') {
            res.send({
                message: '请输入账号'
            })
            return
        }
        advertising.findOne({
            userName: query.userName
        }, (err, user) => {
            if (err) {
                throw err
            }
            if (!user) {
                res.send({
                    message: '用户不存在！'
                })
                return
            }
            // 检查密码是否正确
            if (query.password == user.password) {
                user.token = jwt.sign({name: user.name}, 'shaoky')
                user.save((err) => {
                    if (err) {
                        res.send(err)
                    }
                })
                res.send({
                    data: {
                        user: {
                            token: user.token
                        }
                    },
                    error_no: 0,
                    message: ''
                })
            } else {
                res.send({
                    error_no: 50000,
                    message: '密码错误'
                })
            }
        })
    }
    add (req, res, next) {
        console.log(1)
        const query = req.query
        console.log('登录参数1---------', query)
        if (query.userName == '') {
            res.send({
                message: '请输入账号'
            })
            return
        }
        advertising.findOne({
            userName: query.userName
        }, (err, user) => {
            if (err) {
                throw err
            }
            if (!user) {
                res.send({
                    message: '用户不存在！'
                })
                return
            }
            // 检查密码是否正确
            if (query.password == user.password) {
                user.token = jwt.sign({name: user.name}, 'shaoky')
                user.save((err) => {
                    if (err) {
                        res.send(err)
                    }
                })
                res.send({
                    data: {
                        user: {
                            token: user.token
                        }
                    },
                    error_no: 0,
                    message: ''
                })
            } else {
                res.send({
                    error_no: 50000,
                    message: '密码错误'
                })
            }
        })
    }
}

export default new Advertising()