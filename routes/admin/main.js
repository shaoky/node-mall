import login from './login'
import advertising from './advertising'

export default app => {
	app.use('/', login),
	app.use('/', advertising)
}
