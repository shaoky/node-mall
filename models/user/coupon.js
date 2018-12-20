'use strict';
import mongoose from 'mongoose'
const Schema  = mongoose.Schema

// 创建模型
const userCouponSchema = new Schema({
    userCouponId: Number,
    couponId: Number,
    userId: Number,
    createTime: Number, // 领取时间
    couponStatus: Number, // 1未用 0已用 -1删除
    dataFlag: Number,
},{ collection: 'user_coupon' })

// statisSchema.index({id: 1})
const UserCoupon = mongoose.model('userCoupon', userCouponSchema)
export default UserCoupon