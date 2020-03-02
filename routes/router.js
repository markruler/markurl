// const express = require('express');
// const router = express.Router();
const router = require('express').Router();
const url = require('./url');

router.get('/', (req, res) => {
  // res.send('server is up and running');

  // const id = req.user;
  // if (!id) {
  //   console.log('not login status')
  //   res.render('login.ejs');
  // }

  // res.render('../views/url.ejs', {'id':id})
  res.render('../public/index.ejs', { message : '' })
});

router.use('/url', url);

module.exports = router;

