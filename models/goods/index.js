'use strict';
import mongoose from 'mongoose'
const Schema  = mongoose.Schema

// 创建模型
const goodsSchema = new Schema({
    id: Number,
    goodsSn: String,
    goodsName: String,
    goodsImg: String,
    goodsThums: String,
    marketPrice: String,
    shopPrice: String,
    goodsStock: String,
    saleCount: String,
    isSale: Number,
    isHot: Number,
    // isNew: Number,
    goodsDesc: String,
    goodsStatus: Number,
    saleTime: Number,
    goodsFlag: Number,
    order: Number,
},{ collection: 'goods' })

// goodsSchema.index({id: 1})
const Goods = mongoose.model('goods', goodsSchema)
export default Goods