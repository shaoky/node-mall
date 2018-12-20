import login from './login'
import ad from './ad'
import article from './article'
import goods from './goods'
import panic from './panic'
import order from './order'
import user from './user'

export default app => {
	app.use('/', login),
	app.use('/', ad),
	app.use('/', article),
	app.use('/', goods),
	app.use('/', panic),
	app.use('/', order),
	app.use('/', user)
}
