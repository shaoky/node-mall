import express from 'express'
import db from './mongodb/db.js'
import routerAdmin from './routes/admin/main.js'
import routerApp from './routes/app/main.js'
import chalk from 'chalk'
import morgan from 'morgan'
import bodyParser from 'body-parser'

const app = express()
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//设置跨域访问
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
    if (req.method == 'OPTIONS') {
        // console.log(1)
	  	// res.send(200)
	} else {
	    // next();
	}
    next()
})

routerAdmin(app)
routerApp(app)

app.use(express.static('pubilc'))
var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port

    console.log('Example app listening at http://%s:%s', host, port)
})