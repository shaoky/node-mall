'use strict';
import mongoose from 'mongoose'
const Schema  = mongoose.Schema

// 创建模型
const goodsSpecSchema = new Schema({
    goodsSpecId: Number, // 主键
    goodsId: Number, // 商品id
    goodsAttrList: Array, // 产品属性
    goodsSpecList: Array, // 产品规格

},{ collection: 'goods_spec' })

// goodsSchema.index({id: 1})
const GoodsSpec = mongoose.model('goodsSpec', goodsSpecSchema)
export default GoodsSpec