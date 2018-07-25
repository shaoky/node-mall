'use strict';
import mongoose from 'mongoose'
const Schema  = mongoose.Schema

// 创建模型
const advertisingTypeSchema = new Schema({
    userName: String,
    password: String,
},{ collection: 'advertising_type' })
// 这里有个坑，查询数据库，末尾会自己加上s，如果是user_admin，就会找不到表，解决方法：要么在表名末尾全部加上s，要么加collection

// statisSchema.index({id: 1})
const advertisingType = mongoose.model('advertising_type', advertisingTypeSchema)
export default advertisingType