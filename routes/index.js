var express = require('express');
var router = express.Router();

router.post('/login', (req, res, next) => {
  res.send({ b: 2 })
});

export default router

// module.exports = router;