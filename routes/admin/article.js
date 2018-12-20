import express from 'express'
import Article from '../../controller/admin/article/index'
import ArticleType from '../../controller/admin/article/type'

const router = express.Router()

router.post('/admin/article/list', Article.list)
router.post('/admin/article/add', Article.add)
router.post('/admin/article/update', Article.update)
router.post('/admin/article/delete', Article.delete)

router.post('/admin/article/type/list', ArticleType.list)
router.post('/admin/article/type/add', ArticleType.add)
router.post('/admin/article/type/update', ArticleType.update)
router.post('/admin/article/type/delete', ArticleType.delete)
export default router