'use strict';
import mongoose from 'mongoose'
const Schema  = mongoose.Schema

// 创建模型
const goodsSchema = new Schema({
    goodsId: Number, // 主键
    goodsSn: String, // 商品编号
    goodsName: String, // 商品名称
    goodsImage: String, // 商品图片
    goodsImageFull: String,
    goodsThums: String, // 商品缩略图
    goodsThumsFull: String,
    goodsImageBanner: Array, // 商品轮播图
    goodsImageDetail: Array, // 商品详情图
    marketPrice: String, // 市场价格
    shopPrice: String, // 商品价格
    goodsStock: { type: Number, default: 0 }, // 商品库存
    saleCount: { type: Number, default: 0 }, // 销售总数
    goodsDesc: String, // 商品详情
    goodsStatus: Number, // 商品状态|-1:禁售 0:未审核 1:已审核
    createTime: { type: Number, default: parseInt(new Date() / 1000)}, // 创建时间
    saleTime: Number, // 上架时间
    isSale: { type: Boolean, default: false }, // 是否销售|false:不上架, true:上架	
    // isNew: { type: Boolean, default: false }, // 是否新品|false:否, true:是
    isHot: { type: Boolean, default: false }, // 是否热卖|false:否, true:是
    isRecommend: { type: Boolean, default: false }, // 是否推荐|false:否, true:是
    goodsFlag: { type: Boolean, default: true }, // 删除标志|false: 删除 true:有效
    order: Number, // 排序
},{ collection: 'goods' })

// goodsSchema.index({id: 1})
const Goods = mongoose.model('goods', goodsSchema)
export default Goods