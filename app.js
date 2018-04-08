import express from 'express'
import db from './mongodb/db.js'
import router from './routes/admin/main.js'
import chalk from 'chalk'
import morgan from 'morgan'
const app = express()
app.use(morgan('dev'))
// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/mall');
// var db = mongoose.connection;

// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log(chalk.green('数据库已链接'));
//   // var user = mongoose.Schema({
//   // 	name: string
//   // });
//   // var title = mongoose.model('title', user);
//   // var silence = new title({name: 'shaoky'});
//   // console.log(silence.name)
//   var schema = new mongoose.Schema({ num:Number, name: String, size: String});
//   var MyModel = mongoose.model('MyModel', schema);
//   var doc1 = new MyModel({ size: 'small' });
//   doc1.save(function (err, doc) {
//   	console.log(doc)
//   })
//     console.log(doc1.size);
// });


//设置跨域访问
app.all('*', (req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*")
	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS')
	res.header("Access-Control-Allow-Headers", "X-Requested-With")
	res.header('Access-Control-Allow-Headers', 'Content-Type')
	next();
});

// var data =  {
// 	a: 1,
// 	b: 2
// }
// //console.log(questions)
// app.post('/test', function (req, res) {
// 	// res.status(200),
// 	res.json({
// 		data: data,
// 		error_no: 0,
// 		message: ''
// 	})
// })


router(app);
// import index from './routes/index'
// app.use('/', index);

// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

var server = app.listen(3000, function () {
	var host = server.address().address
	var port = server.address().port

	console.log('Example app listening at http://%s:%s', host, port)
})