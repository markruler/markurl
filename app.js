const express = require('express');
const session = require('express-session');
// const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash')
// const cookieParser = require('cookie-parser');
// const favicon = require('serve-favicon');
// const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
// const config = require('./config/database');
const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy

require('dotenv').config();

const app = express();
const port = process.env.PORT;
const router = require('./routes/router')

app.listen(port, () => {
  console.log(`Server running at :${port}`);
});

// static 폴더를 지정했기 때문에
// bootstrap 을 node_modules로 다운로드 받아서 사용할 수 없음
// CDN 으로 받자
app.use('/url/static', express.static('public'))
app.use(cors());
// app.use(express.json());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine', 'ejs')

app.use(session({
  secret : process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
})

// 순서 중요
app.use(router);