'use strict';
import mongoose from 'mongoose'
const Schema  = mongoose.Schema

// 创建模型
const idsSchema = new Schema({
    image_id: Number,
    ad_id: Number,
    article_id: Number,
    article_type_id: Number,
    admin_id: Number,
    goods_id: Number,
    panic_id: Number,
    panic_goods_id: Number,
    goods_group_id: Number,
    goods_attr_id: Number,
    user_id: Number,
    coupon_id: Number,
    user_coupon_id: Number,
    address_id: Number,
    browse_id: Number,
    collection_id: Number,
    cart_id: Number,
    cart_goods_id: Number,
    order_id: Number,
},{ collection: 'id_list' })
// 这里有个坑，查询数据库，末尾会自己加上s，如果是user_admin，就会找不到表，解决方法：要么在表名末尾全部加上s，要么加collection

const Ids = mongoose.model('Ids', idsSchema)
Ids.findOne((err, data) => {
    // console.log(data)
    // for(let item in data) {
        // console.log(item)
    // }
    if (!data) {
        const newIds = new Ids({
            image_id: 0,
            ad_id: 0,
            article_id: 0,
            article_type_id: 0,
            admin_id: 0,
            goods_id: 0,
            goods_attr_id: 0,
            panic_id: 0,
            panic_goods_id: 0,
            group_id: 0,
            user_id: 0,
            address_id: 0,
            collection_id: 0,
            browse_id: 0,
            cart_id: 0,
            cart_goods_id: 0,
            order_id: 0
        })
        newIds.save()
    }
})
export default Ids