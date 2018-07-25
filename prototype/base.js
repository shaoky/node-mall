import ids from '../models/ids'

export default class BaseComponent {
    constructor () {
		this.idList = ['advertising_id', 'admin_id', 'goods_id']
    }
    //获取id列表
	async getId(type){
		if (!this.idList.includes(type)) {
			console.log('id类型错误');
			throw new Error('id类型错误');
			return
		}
		try {
			const idData = await ids.findOne()
			idData[type] ++
			console.log(type)
			console.log('idData', idData['goods_id'])
			await idData.save()
			return idData[type]
		} catch (err) {
			console.log('获取ID数据失败');
			throw new Error(err)
		}
	}
}