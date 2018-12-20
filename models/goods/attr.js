'use strict';
import mongoose from 'mongoose'
const Schema  = mongoose.Schema

// 创建模型
const goodsAttrSchema = new Schema({
    goodsAttrId: Number, // 自增id
    goodsId: Number,
    attrList: Array, // 列表
    createTime: Number
},{ collection: 'goods_attr' })

// goodsSchema.index({id: 1})
const GoodsAttr = mongoose.model('goodsAttr', goodsAttrSchema)
export default GoodsAttr