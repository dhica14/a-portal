var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  // res.send('dashboard');
  res.render('dashboard', { token: req.session._id });

});

module.exports = router;
