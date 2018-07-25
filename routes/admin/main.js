import login from './login'
import advertising from './advertising'
import goods from './goods'

export default app => {
	app.use('/', login),
	app.use('/', advertising),
	app.use('/', goods)
}
