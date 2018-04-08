'use strict';
import mongoose from 'mongoose'
const Schema  = mongoose.Schema

// 创建模型
const userSchema = new Schema({
	userName: String,
	password: String,
},{ collection: 'user_admin' })
// 数据表
const register = mongoose.model('user_admin', userSchema)
// var doc1 = new register({ a: '22' });
// doc1.save(function (err, doc) {
// 	console.log(doc)
// })

export default register