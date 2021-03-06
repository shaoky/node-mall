import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import UserModel from '../../../models/user/user'
import Base from '../../../prototype/base'
/**
 * @apiDefine appUserGroup app-用户模块
 */

/**
 * @api {post} / 0. 用户表
 * @apiName user
 * @apiGroup appUserGroup
 * @apiSuccess {Number} userId 地址id
 * @apiVersion 1.0.0
 */
class User extends Base{
    constructor () {
        super()
        this.register = this.register.bind(this)
    }
    /*
    *
    */
    index (req, res, next) {
        const params = req.body
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
        UserModel.findOne({
            userName: params.userName
        }, (err, user) => {
            if (err) {
                throw err
            }
            if (!user) {
                res.send({
                    code: 400,
                    message: '账号或密码错误'
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
                res.send({
                    data: {
                        user: {
                            token: user.token,
                            user: user.userName,
                            nickname: user.userName,
                            picture: user.picture
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
        })
    }

    async register (req, res, next) {
        const userName = req.body.userName
        const password = req.body.password
        if (!userName || !password) {
            res.send({code: 400, message: '请输入您的账号密码'})
            return
        }
        const user = await UserModel.findOne({userName: userName})
        if (user) {
            res.send({
                code: 400,
                message: '该用户已经存在'
            })
            return
        }
        
        let userId
        try {
            userId = await this.getId('user_id')
        } catch (err) {
            console.log('获取user_id失败')
            throw new Error(err)
        }

        try {
            await UserModel.create({
                id: userId,
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

export default new User()