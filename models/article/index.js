'use strict';
import mongoose from 'mongoose'
const Schema  = mongoose.Schema

// 创建模型
const articleSchema = new Schema({
    articleId: Number,
    articleTypeId: Number,
    title: String,
    content: String,
    imageUrl: String,
    isShow: Boolean,
    createTime: Number,
},{ collection: 'article' })
// 这里有个坑，查询数据库，末尾会自己加上s，如果是user_admin，就会找不到表，解决方法：要么在表名末尾全部加上s，要么加collection

// statisSchema.index({id: 1})
const Article = mongoose.model('article', articleSchema)
export default Article