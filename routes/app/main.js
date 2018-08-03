import ad from './ad'
import goods from './goods'
import user from './user'
import wx from './wx'
import cart from './cart'
import order from './order'

export default app => {
	app.use('/', ad),
	app.use('/', goods),
	app.use('/', user),
	app.use('/', wx),
	app.use('/', cart),
	app.use('/', order)
}
