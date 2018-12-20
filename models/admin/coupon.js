'use strict';
import mongoose from 'mongoose'
const Schema  = mongoose.Schema

// 创建模型
const couponSchema = new Schema({
    couponId: Number,
    title: String, // 优惠券名称
    type: Number, // 优惠券类型
    couponMoney: Number, // 1:满减
    spendMoney: Number, // 优惠券面额
    desc: String, // 优惠活动描述
    sendNum: Number, // 发放数量
    receiveNum: Number, // 领取数量
    sendStartTime: Number, // 发放开始时间
    sendEndTime: Number, // 发放结束时间
    validStartTime: Number, // 活动开始时间
    validEndTime: Number, // 活动结束时间
    createTime: Number, // 创建时间
    dataFlag: Number,
},{ collection: 'coupon' })

// statisSchema.index({id: 1})
const Coupon = mongoose.model('coupon', couponSchema)
export default Coupon