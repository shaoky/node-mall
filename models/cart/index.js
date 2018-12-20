'use strict';
import mongoose from 'mongoose'
const Schema  = mongoose.Schema

// 创建模型
const cartSchema = new Schema({
    cartId: Number, // 主键
    userId: Number, // 用户id
    freightMoney: Number, // 运费
    freeFreightMoney: Number, // 满多少免邮
    // goodsId: Number, // 商品id
    // goodsNum: Number, // 商品数量
    // isCheck: Boolean, // 是否选中，false:否，true:是
    goodsList: Array,
    createTime: Number,
},{ collection: 'cart' })

// goodsSchema.index({id: 1})
const Cart = mongoose.model('cart', cartSchema)
export default Cart