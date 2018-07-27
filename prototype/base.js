import ids from '../models/ids'
import formidable from 'formidable'
import gm from 'gm'
import fs from 'fs'
import path from 'path'

export default class BaseComponent {
    constructor () {
		this.idList = ['image_id', 'advertising_id', 'admin_id', 'goods_id']
		this.uploadImg = this.uploadImg.bind(this)
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
			// console.log(type)
			// console.log('idData', idData['goods_id'])
			await idData.save()
			return idData[type]
		} catch (err) {
			console.log('获取ID数据失败');
			throw new Error(err)
		}
	}

	async uploadImg (req, res, next) {
		try {
			const imagePath = await this.getImagePath(req, res)
			res.send({
				status: 200,
				data: {
					imagePath
				}
			})
		} catch (err) {
			console.log(err)
			res.send({
				status: 400,
				message: '图片上传失败'
			})
		}
	}

	async getImagePath (req, res) {
		return new Promise((resolve, reject) => {
			const form = formidable.IncomingForm()
			form.uploadDir = './public/images'
			form.parse(req, async (err, fields, files) => {
				let image_id
				try {
					image_id = await this.getId('image_id')
				} catch (err) {
					console.log('获取图片id失败')
					fs.unlinkSync(files.file.path)
					reject('获取图片id失败')
				}
				
				const hashName = (new Date().getTime() + Math.ceil(Math.random()*10000)).toString(16) + image_id
				const extname = path.extname(files.file.name)
				if (!['.jpg', '.jpeg', '.png'].includes(extname)) {
					res.send({
						status: 400,
						message: '文件格式错误'
					})
					reject('上传失败')
					return
				}
				const fullName = hashName + extname
				const repath = './public/images/' + fullName
				try {
					fs.renameSync(files.file.path, repath)
					// gm(repath)
					// .resize(200)
					// .write(fullName, async (err) => {
					// 	console.log(fullName, err)
					// 	// if(err){
					// 	// 	console.log('裁切图片失败');
					// 	// 	reject('裁切图片失败');
					// 	// 	return
					// 	// }
					// 	resolve(fullName)
					// })
					resolve(fullName)
				} catch (err) {
					console.log('保存图片失败', err);
					// if (fs.existsSync(repath)) {
					// 	fs.unlinkSync(repath);
					// } else {
					// 	fs.unlinkSync(files.file.path);
					// }
					reject('保存图片失败')
				}
			})
		})
	}
}