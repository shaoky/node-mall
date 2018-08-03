import mongoose from 'mongoose'
import UserModel from '../../../models/user/user'
import Base from '../../../prototype/base'
import config from 'config'
import jwt from 'jsonwebtoken'

class Mini extends Base {
    constructor () {
        super()
        this.config = config.get('Customer.wx')
        this.login = this.login.bind(this)
    }

    async login (req, res, next) {
        console.log(req.body)
        let params = req.body
        let url = 'https://api.weixin.qq.com/sns/jscode2session'
        let data = {
            appid: this.config.appid,
            secret: this.config.secret,
            js_code: params.code,
            grant_type: 'authorization_code'

        }
        let wx = await this.fetch(url, data)

        
        
        try {
            let tokenKey = config.get('Customer.global.tokenKey')
            let wxInfo = await UserModel.findOne({openid: wx.openid}, ['-id', '-sessionKey', '-openid'])
            if (wxInfo) {
                let token = jwt.sign({id: wxInfo.userId}, tokenKey)
                wxInfo.token = token
                await wxInfo.save()
                res.send({
                    code: 200,
                    data: wxInfo
                })
            } else {
                let userId
                try {
                    userId = await this.getId('user_id')
                } catch (err) {
                    console.log('user失败')
                    throw new Error(err)
                }
                let token = jwt.sign({id: userId}, tokenKey)
                await UserModel.create({
                    userId: wxInfo.userId,
                    openid: wx.openid,
                    sessionKey: wx.session_key,
                    nickname: params.nickname,
                    province: params.province,
                    city: params.city,
                    userPhoto: params.avatarUrl,
                    systemInfo: params.systemInfo,
                    latitude: params.latitude || '',
                    longitude: params.longitude || '',
                    token: token
                })
                let newUser = await UserModel.findOne({openid: wx.openid}, ['-_id', '-id', '-sessionKey', '-openid'])
                res.send({
                    code: 200,
                    data: newUser 
                })
            }
        } catch (err) {
            console.log(err, err)
            res.send({
                code: 400,
                message: '请求失败'
            })
        }
    }
    
    
}

export default new Mini()