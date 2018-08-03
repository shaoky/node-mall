import ids from '../models/ids'
import formidable from 'formidable'
import gm from 'gm'
import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'
import config from 'config'
import jwt from 'jsonwebtoken'

export default class BaseComponent {
    constructor () {
		this.idList = ['image_id', 'ad_id', 'ad_type_id', 'admin_id', 'goods_id', 'user_id', 'address_id', 'cart_id', 'order_id']
		this.uploadImg = this.uploadImg.bind(this)
	}

	systemConfig () {
		let config = {
			deliverMoney: 10
		}
		return config
	}

	async fetch(url = '', data = {}, type = 'GET', resType = 'JSON'){
		type = type.toUpperCase();
		resType = resType.toUpperCase();
		if (type == 'GET') {
			let dataStr = ''; //数据拼接字符串
			Object.keys(data).forEach(key => {
				dataStr += key + '=' + data[key] + '&';
			})

			if (dataStr !== '') {
				dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
				url = url + '?' + dataStr;
			}
		}

		let requestConfig = {
			method: type,
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
		}

		if (type == 'POST') {
			Object.defineProperty(requestConfig, 'body', {
				value: JSON.stringify(data)
			})
		}
		let responseJson;
		try {
			const response = await fetch(url, requestConfig);
			if (resType === 'TEXT') {
				responseJson = await response.text();
			}else{
				responseJson = await response.json();
			}
		} catch (err) {
			console.log('获取http数据失败', err);
			throw new Error(err)
		}
		return responseJson
	}

	// 获取用户id

	getUserId (token) {
        let tokenKey = config.get('Customer.global.tokenKey')
        let decoded = jwt.verify(token, tokenKey)
		let userId = decoded.id
		console.log('userId:', userId)
		return userId
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
			console.log(`获取${type}数据失败`);
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
			form.uploadDir = './pubilc/images'
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
				const repath = './pubilc/images/' + fullName
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