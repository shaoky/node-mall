import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import AdminModel from '../../../models/admin/admin'
import Base from '../../../prototype/base'

class Login extends Base {
    constructor () {
        super()
        this.register = this.register.bind(this)
    }
    async index (req, res, next) {
        const params = req.body
        console.log('登录参数---------', params)
        if (params.userName == '') {
            res.send({
                code: 400,
                message: '请输入账号'
            })
            return
        }
        if (params.password == '') {
            res.send({
                code: 400,
                message: '请输入密码'
            })
            return
        }

        try {
            let user = await AdminModel.findOne({userName: params.userName})
            if (!user) {
                res.send({
                    code: 400,
                    message: '用户不存在'
                })
                return
            }
            // 检查密码是否正确
            if (params.password == user.password) {
                user.token = jwt.sign({name: user.name}, 'shaoky')
                user.save((err) => {
                    if (err) {
                        res.send(err)
                    }
                })

                // console.log(req.connection.remoteAddress) // 获取客服端ip
                res.send({
                    data: {
                        user: {
                            token: user.token
                        }
                    },
                    code: 200
                })
            } else {
                res.send({
                    code: 400,
                    message: '密码错误'
                })
            }
        } catch (err) {
            console.log(err)
        }
        // AdminModel.findOne({
        //     userName: params.userName
        // }, (err, user) => {
        //     if (err) {
        //         throw err
        //     }
        //     if (!user) {
        //         res.send({
        //             code: 0,
        //             message: '用户不存在'
        //         })
        //         return
        //     }

        //     // 检查密码是否正确
        //     if (params.password == user.password) {
        //         user.token = jwt.sign({name: user.name}, 'shaoky')
        //         user.save((err) => {
        //             if (err) {
        //                 res.send(err)
        //             }
        //         })

        //         console.log(req.connection)
        //         res.send({
        //             data: {
        //                 user: {
        //                     token: user.token
        //                 }
        //             },
        //             code: 200
        //         })
        //     } else {
        //         res.send({
        //             code: 400,
        //             message: '密码错误'
        //         })
        //     }
        // })
    }
    async register (req, res, next) {
        const userName = req.body.userName
        const password = req.body.password
        if (!userName || !password) {
            res.send({code: 400, message: '请输入您的账号密码'})
            return
        }
        const admin = await AdminModel.findOne({userName: userName})
        if (admin) {
            res.send({
                code: 400,
                message: '该用户已经存在'
            })
            return
        }
        
        let adminId
        try {
            adminId = await this.getId('admin_id')
        } catch (err) {
            console.log('获取admin_id失败')
            throw new Error(err)
        }

        try {
            await AdminModel.create({
                id: adminId,
                userName: userName,
                password: password
            })
            res.send({
                code: 200,
                message: '成功创建新用户'
            })
        } catch (err) {
            res.send({
                code: 0,
                message: '操作失败'
            })
        }
    }
}

export default new Login()