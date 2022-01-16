/**
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

var bodyParser = require('body-parser');
var express = require('express');
var app = express();
//var xhub = require('express-x-hub');

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'));

//app.use(xhub({ algorithm: 'sha1', secret: process.env.APP_SECRET }));
app.use(bodyParser.json());

var token = process.env.TOKEN || 'token';
var received_logfull = [];

app.get('/log_full', function(req, res) {
  res.send('<pre>' + JSON.stringify(received_logfull, null, 2) + '</pre>');
});

//app.get(['/facebook', '/instagram'], function(req, res) {
//  if (
//    req.query['hub.mode'] == 'subscribe' &&
//    req.query['hub.verify_token'] == token
//  ) {
//    res.send(req.query['hub.challenge']);
//  } else {
//    res.sendStatus(400);
//  }
//});

app.post('/facebook', function(req, res) {

  //if (!req.isXHubValid()) {
  //  console.log('Warning - request header X-Hub-Signature not present or invalid');
  //  res.sendStatus(401);
  //  return;
  //}

  // Process the Facebook updates here
  received_logfull.unshift(req.body);
  res.sendStatus(200);
});

app.listen();
