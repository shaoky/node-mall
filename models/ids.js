'use strict';
import mongoose from 'mongoose'
const Schema  = mongoose.Schema

// 创建模型
const idsSchema = new Schema({
    image_id: Number,
    advertising_id: Number,
    admin_id: Number,
    goods_id: Number,
    user_id: Number,
    address_id: Number,
    cart_id: Number,
    order_id: Number,
},{ collection: 'id_list' })
// 这里有个坑，查询数据库，末尾会自己加上s，如果是user_admin，就会找不到表，解决方法：要么在表名末尾全部加上s，要么加collection

// advertisingSchema.index({a: 1})
const Ids = mongoose.model('Ids', idsSchema)
Ids.findOne((err, data) => {
    // console.log(data)
    // for(let item in data) {
        // console.log(item)
    // }
    if (!data) {
        const newIds = new Ids({
            image_id: 0,
            advertising_id: 0,
            admin_id: 0,
            goods_id: 0,
            user_id: 0,
            address_id: 0,
            cart_id: 0,
            order_id: 0
        })
        newIds.save()
    }
})
export default Ids