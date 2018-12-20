'use strict';
import mongoose from 'mongoose'
const Schema  = mongoose.Schema

// 创建模型
const collectionSchema = new Schema({
    collectionId: Number,
    userId: Number,
    goodsId: Number,
    createTime: Number,
},{ collection: 'user_collection' })
// 这里有个坑，查询数据库，末尾会自己加上s，如果是user_admin，就会找不到表，解决方法：要么在表名末尾全部加上s，要么加collection

// statisSchema.index({id: 1})
const Collection = mongoose.model('collection', collectionSchema)
export default Collection