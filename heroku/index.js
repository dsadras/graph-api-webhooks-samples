'option strict'

var bodyParser = require('body-parser');
var fs = require('fs');
var express = require('express');
var app = express();
var xhub = require('express-x-hub');

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'));

app.use(xhub({ algorithm: 'sha1', secret: process.env.APP_SECRET }));
app.use(bodyParser.json());

var token = process.env.TOKEN || 'token';
var received_updates = [];

app.get('/', function (req, res) {
    console.log(req);
    res.send('<pre>' + JSON.stringify(received_updates, null, 2) + '</pre>');
});

app.get(['/facebook', '/instagram'], function (req, res) {
    if (
        req.query['hub.mode'] == 'subscribe' &&
        req.query['hub.verify_token'] == token
    ) {
        res.send(req.query['hub.challenge']);
    } else {
        res.sendStatus(400);
    }
});

app.post('/facebook', function (req, res) {
    console.log('Facebook request body:', req.body);
    // Process the Facebook updates here
    received_updates.unshift(req.body);
    console.log('Acumulado:', JSON.stringify(received_updates, null, 2) );
    res.send('ok');
});
app.listen();
