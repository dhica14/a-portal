var express = require('express');
var router = express.Router();
var axios = require('axios');
var FormData = require('form-data');

/* GET index page. */
router.get('/', function (req, res, next) {
  res.render('login', { title: 'Sign In', miss: '' });
});

router.post('/', function (req, res, next) {

  var data = new FormData();
  console.log("login");
  data.append('email', req.body.id);
  data.append('password', req.body.password);

  const config = {
    method: 'post',
    url: 'https://iseto-api.wizeflow.io/Auth',
    headers: {
      ...data.getHeaders()
    },
    data: data
  };

  axios(config)
    .then(function (response) {
      const token = JSON.stringify(response.data.token);
      // console.log(JSON.stringify(response.data));
      // console.log(token);
      req.session._id = token;
      console.log(req.session._id);
      res.redirect('/dashboard');
    })
    .catch(function (error) {
      console.log(error);
      res.render('login', { title: 'Sign In', miss: 'ID or PASSWORDが異なります' });

    });
});

// router.post('/login', function (req, res, next) {
//   res.status(201);
//   res.redirect('/');
// });


module.exports = router;
