import login from './login'
// import ad from './ad'
import goods from './goods'

export default app => {
	app.use('/', login),
	// app.use('/', ad),
	app.use('/', goods)
}
