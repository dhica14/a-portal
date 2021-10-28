var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('project', { token: req.session._id });

});

/* GET users listing. */
router.post('/*', function (req, res, next) {
    res.render('sl', { project_name: "projectName" });

});


module.exports = router;
