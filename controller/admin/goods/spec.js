import mongoose from 'mongoose'
import config from 'config'
import goodsModel from '../../../models/goods/index'
import BaseComponent from '../../../prototype/base'

class Goods extends BaseComponent {
    constructor () {
        super()
        this.add = this.add.bind(this)
    }
    
}

export default new Goods()