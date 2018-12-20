'use strict';
import mongoose from 'mongoose'
const Schema  = mongoose.Schema

// 创建模型
const panicSchema = new Schema({
    panicId: Number, // 主键
    title: String, // 抢购标题
    startTime: Number, // 开始时间
    endTime: Number, // 结束时间
    desc: String, // 活动描述
    createTime: Number,// 创建时间
    dataFlag: Number,
    isOpen: Boolean
},{ collection: 'panic' })

// goodsSchema.index({id: 1})
const Panic = mongoose.model('panic', panicSchema)
export default Panic