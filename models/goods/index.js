'use strict';
import mongoose from 'mongoose'
const Schema  = mongoose.Schema

// 创建模型
const goodsSchema = new Schema({
    id: Number, // 主键
    goodsSn: String, // 商品编号
    goodsName: String, // 商品名称
    goodsImage: String, // 商品图片
    goodsThums: String, // 商品缩略图
    goodsImageBanner: Array, // 商品轮播图
    goodsImageDetail: Array, // 商品详情图
    marketPrice: String, // 市场价格
    shopPrice: String, // 商品价格
    goodsStock: String, // 商品库存
    saleCount: Number, // 销售总数
    goodsDesc: String, // 商品详情
    goodsStatus: Number, // 商品状态|-1:禁售 0:未审核 1:已审核
    createTime: Number, // 创建时间
    saleTime: Number, // 上架时间
    isSale: Boolean, // 是否销售|false:不上架, true:上架	
    // isNew: Boolean, // 是否新品|false:否, true:是
    isHot: Boolean, // 是否热卖|false:否, true:是
    goodsFlag: Boolean, // 删除标志|false: 删除 true:有效
    order: Number, // 排序
},{ collection: 'goods' })

// goodsSchema.index({id: 1})
const Goods = mongoose.model('goods', goodsSchema)
export default Goods