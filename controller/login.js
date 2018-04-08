class Login {
    constructor (app) {
        this.init()
    }
    /**
     * 初始化
     */
    init () {
        this.routes()
    }
    /*
    * 注册路由
    */
    routes () {
    
    }
    index () {
        res.send({
            status: 0,
            type: '123',
            message: '获取订单列表失败'
        })
        console.log(123123)
    }
}

export default Login