'use strict';
import mongoose from 'mongoose'
const Schema  = mongoose.Schema

// 创建模型
const panicGoodsSchema = new Schema({
    panicGoodsId: Number, // 主键
    panicId: Number, // 活动id
    goodsId: Number, // 商品id
    panicMoney: String, // 抢购价
    goodsStock: Number, // 抢购库存
    goodsSales: Number, // 销量
    goodsVirtualSales: Number, // 虚拟购买量
    isOpen: Boolean, // 是否开启
    order: Number // 排序
},{ collection: 'panic_goods' })

// goodsSchema.index({id: 1})
const PanicGoods = mongoose.model('panicGoods', panicGoodsSchema)
export default PanicGoods