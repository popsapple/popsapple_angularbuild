// server.js
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const nodemailer = require('nodemailer');
const bodyParserJsonError = require('express-body-parser-json-error');
const multer = require('multer');
const multerS3 = require('multer-s3');
const fs = require('file-system');
const aws = require('aws-sdk');
const app = express();
global.crypto = require('crypto');
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.use(express.static(__dirname + '/dist'));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.listen(process.env.PORT || 4200);
app.get('/',function(request,response){
  response.type('text/html');
  response.send('/index.html');
});

const usingSession = session({
  key: process.env.SESSIONKEY, // 세션키
  secret: process.env.SECRETKEY, // 비밀키
  cookie: {
    maxAge: 1000 * 60 * 180 // 3시간
  }
});
app.use(usingSession);

// DB 연결
const mongoose = require('mongoose');

const db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
  console.log("몽고디비에 연결되었습니다.");
});
mongoose.connect("mongodb://heroku_70467gbs:ggvtdslkhd8dj1n1livvuemb09@ds153392.mlab.com:53392/heroku_70467gbs");

//에러 처리
app.use(function(error, req, res) {
   res.status(400).send("<script>alert('요청하신 페이지는 존재하지 않습니다.');window.location.href='/';</script>");
   res.end();
});
app.use(function(error, req, res, next) {
   res.status(500).send("<script>alert('요청하신 페이지는 존재하지 않습니다.');window.location.href='/';</script>");
   res.end();
});
