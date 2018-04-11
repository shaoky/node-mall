import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import login from '../../../models/admin/login/index'
// import register from '../../../models/admin/login/register'

class Login {
    constructor () {
        // this.index()
    }
    index (req, res, next) {
        const query = req.query
        console.log('登录参数---------', query)
        if (query.userName == '') {
            res.send({
                message: '请输入账号'
            })
            return
        }
        login.findOne({
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
    register (req, res, next) {
        const userName = req.query.userName
        if (!req.query.userName || !req.query.password) {
            req.send({error_no: 0, message: '请输入您的账号密码'})
        }
        const admin = login.findOne({
            userName: userName
        }, (err, user) => {
            if (err) {
                console.log('err')
                throw err
            }
            if (user) {
                console.log(11)
            }
        })
        // if (admin) {
        //  res.send({
        //      error_no: 0,
        //      message: '该用户已经存在'
        //  })
        //  return
        // }
        // let newUser = new login({
        //  userName: userName,
        //  password: req.query.password
        // })
        // newUser.save((err) => {
        //  if (err) {
        //      res.send(err)
        //  }
        //  res.send({
        //      error_no: 0,
        //      message: '成功创建新用户！'
        //  })
        // })
        // const Schema = mongoose.Schema;
        // var schema = new mongoose.Schema({ num:Number, name: String, size: String});
        // 创建模型
        // const statisSchema = new Schema({
        //  date: String,
        //  origin: String,
        //  id: Number,
        // })
        // const MyModel = mongoose.model('MyModel', statisSchema)
        // var doc1 = new MyModel({ size: '2' });
        // doc1.save(function (err, doc) {
        //  console.log(doc)
        // })
    }
}

export default new Login()