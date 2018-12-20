'use strict';
import mongoose from 'mongoose'
const Schema  = mongoose.Schema

// 创建模型
const articleTypeSchema = new Schema({
    articleTypeId: Number,
    typeName: String,
    content: String,
    imageUrl: String,
    isShow: Boolean,
    createTime: Number,
},{ collection: 'article_type' })

// statisSchema.index({id: 1})
const ArticleType = mongoose.model('articleType', articleTypeSchema)
export default ArticleType