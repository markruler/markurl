const router = require('express').Router();
const crypto = require('crypto');
const mail = require('../smtp');
let Url = require('../models/Url.model');

router.route('/').get((req, res) => {res.render('../public/index.ejs', { message : ''})})

router.route('/:email').get((req, res) => {
  console.log(req.params.email);
  
})

// http://expressjs.com/en/4x/api.html#req
router.route('/:tiny').get((req, res) => {
  console.log('/url/:tiny get');
  console.log(req.params.tiny);

  // https://mongoosejs.com/docs/api.html#model_Model.findOne
  Url.findOne({
    tiny: req.params.tiny
  })
  .then(data => res.redirect(data.origin))
  .catch(error => {
    // res.redirect('/');
    res.render('../public/index.ejs', { message : 'MarkURL was not found.'})
  });
});

// TODO: Modularization 
router.route('/mark').post((req, res) => {
  console.log('/url/:email+origin post');
  const email = req.body.email;
  const origin = req.body.origin;

  /* URLs counting */
  const start = new Date();
  start.setHours(0,0,0,0);

  const end = new Date();
  end.setHours(23,59,59,999);

  // Url.countDocuments({
  //   email: req.params.email
  // })
  // .then(res => res.json(res));
  const pipeline = [
    {
      $match: {
        createdAt: { "$gte": start, "$lt": end }
      }
    },
    {
      $group: {
        _id: "$email",
        count: { "$sum": 1 }
      }
    }
  ]

  Url.aggregate(pipeline)
  .then(data => {
    console.log(data[0].count);
    
    if (data[0].count > 2) {
      res.render('../public/index.ejs', { message : 'Only 3 URLs per day.' });
    } else {
      markSave(email, origin, res);
    }
  })
  .catch(err => {
    if (err) {
      // console.log('error : \n', err);
      res.redirect('/url');
    }
  })

  
});

function markSave(email, origin, res) {
  /* URL shortened */
  // https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm_options
  // hash 알고리즘으로 변환시키면 한 글자만 바껴도 다른 문자열 반환
  // 하지만 (소문자 + 숫자) = 총 31자
  let hash = crypto.createHash('sha512');
  hash.update(email + origin); // 중복을 피하기 위해
  hash = hash.digest('hex');
  // console.log('hash : ', hash);

  // https://nodejs.org/api/buffer.html
  // SHA-512로 변환된 문자열을 base64로 인코딩
  // (대문자 + 소문자 + 숫자) 맨앞에서 6자 추출
  const bin = Buffer.from(hash).toString('base64').substring(0, 6);
  // console.log('bin : ', bin);

  // duplication...
  // 중복될 경우 시퀀스를 발생시켜서 다시 mongoose를 부르자

  const newUrl = new Url({
    email,
    origin,
    tiny: bin,
    duration: 7
  });

  // console.log(newUrl);

  // URL save
  https://www.markruler.com/podo/film.do?releaseYear=all&productionCountry=%EB%8F%85%EC%9D%BC&genreId=3&saw=all&order=all
  newUrl.save()
    .then(() => {
      mail.send({
        to: newUrl.email,
        text: 'https://markruler.com/url/' + newUrl.tiny,
      })
      // console.log('smtp send');
      res.render('../public/index.ejs', { message : 'MarkURL has been sent to your email.'})
    })
    .catch(err => {
      // console.log(err);
      // duplicated URL 일 경우, 기존에 생성된 단축 URL 전송
      if (err.code === 11000) {
        // console.log(err.name);
        // console.log(err.errmsg);
        mail.send({
          to: newUrl.email,
          text: 'https://markruler.com/url/' + newUrl.tiny,
        })
        // console.log('smtp send');
        res.render('../public/index.ejs', { message : 'MarkURL has been sent to your email.'});
      } else {
        res.render('../public/index.ejs', { message : 'This URL cannot be converted.'});
      }
      // Cannot set headers after they are sent to the client
      // res.render('../public/index.ejs', { message : 'This URL cannot be converted.'});
    });
  
  // Promise, 비동기 처리
  console.log('tinyURL : \n', newUrl.tiny)

  
  // [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
  // res.render('../public/index.ejs', {message: 'MarkURL has been sent to your email.'});
}

module.exports = router;
