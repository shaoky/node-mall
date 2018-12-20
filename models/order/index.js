'use strict';
import mongoose from 'mongoose'
const Schema  = mongoose.Schema

// 创建模型
const orderSchema = new Schema({
    orderId: Number, // 主键
    userId: Number, // 用户id
    orderNo: String, // 订单编号
    orderStatus: { type: Number, default: 1}, // 1: 未付款 2: 待发货 3: 已发货 4：交易完成 5: 退款中 6：已退款 7：已取消
    orderStatusName: String,
    totalMoney: String, // 总金额
    payMoney: String,
    freightMoney: Number, // 运费
    payType: Number, // 1：货到付款 2：在线支付
    goodsList: Array, // 商品
    isPay: { type: Boolean, default: false},
    userAddress: Object, // 用户地址
    orderRemarks: { type: String, default: '' }, // 订单备注
    createTime: { type: Number, default: parseInt(new Date() / 1000)}, // 下单时间
    receiveTime: Number, // 收货时间
    deliveryTime: Number, // 发货时间
    orderFrom: Number, // 1：普通订单 2：团购订单 3：抢购订单
},{ collection: 'order' })

// goodsSchema.index({id: 1})
const Order = mongoose.model('order', orderSchema)
export default Order