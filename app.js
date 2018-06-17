import express from 'express'
import db from './mongodb/db.js'
import router from './routes/admin/main.js'
import chalk from 'chalk'
import morgan from 'morgan'
const app = express()
app.use(morgan('dev'))

//设置跨域访问
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
    if (req.method == 'OPTIONS') {
	  	res.send(200)
	} else {
	    next();
	}
    next()
})

router(app)

var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port

    console.log('Example app listening at http://%s:%s', host, port)
})