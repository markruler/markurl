const router = require('express').Router();
const smtp = require('nodemailer');
let Url = require('../models/Url.model')

router.route('/').post((req, res) => {
  console.log('/url post');
  const email = req.body.email;
  const origin = req.body.origin;
  console.log(email);
  console.log(origin);
  const newUrl = new Url({
    email,
    origin
  });

  newUrl.save()
    .then(() => res.json("URL shortened!"))
    .catch(err => {
      res.status(400).json(err);
      console.log(err);
    });

  console.log('smtp send');

  res.render('../public/index.ejs', {message: 'MarkURL was sent by email.'});
});

module.exports = router;
