var express = require('express');
var opn = require('opn')
var fs = require('fs')
var path = require('path')
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

var port = '7081';
var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// 保存配置数据接口
app.post('/save', upload.array(), function (req, res, next) {
  // console.log(req.body);
  // writeStateJs(createStateJsString({common: req.body.common}));
  var result = req.body;
  res.json(result);
});

module.exports = app.listen(port, function () {
  console.log('> Listening at ' + port + '\n');
});
