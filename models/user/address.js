'use strict';
import mongoose from 'mongoose'
const Schema  = mongoose.Schema

// 创建模型
const addressSchema = new Schema({
    addressId: Number,
    userId: Number,
    userName: String,
    userPhone: String,
    provinceName: String,
    cityName: String,
    countyName: String,
    detailInfo: String,
    postalCode: String,
    createTime: { type: Number, default: parseInt(new Date() / 1000)},
    isDefault: { type: Boolean, default : false}, // 0:否，1:是
},{ collection: 'user_address' })
// 这里有个坑，查询数据库，末尾会自己加上s，如果是user_admin，就会找不到表，解决方法：要么在表名末尾全部加上s，要么加collection

// statisSchema.index({id: 1})
const Address = mongoose.model('address', addressSchema)
export default Address