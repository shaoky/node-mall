import advertising from './advertising'
import goods from './goods'
import user from './user'
import wx from './wx'
import cart from './cart'

export default app => {
	app.use('/', advertising),
	app.use('/', goods),
	app.use('/', user),
	app.use('/', wx),
	app.use('/', cart)
}
