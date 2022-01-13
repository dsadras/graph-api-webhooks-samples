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
    /*
  if (!req.isXHubValid()) {
    console.log('Warning - request header X-Hub-Signature not present or invalid');
    res.sendStatus(401);
    return;
  }
  */
    const separator = process.env.SEPARATOR || '|';
    const arrEntry = req.body.entry || req.body[0].entry;
    //for (let i = 0; i < arrEntry.length; ++i) {
    const i = 0;
        const entry_time = arrEntry[i].time;
        const arrChanges = arrEntry[i].changes
        //for (let c = 0; c < arrChanges.length; ++c) {
            const c = 0;
            if (arrChanges[c].field === 'comments') {
                const myValue = arrChanges[c].value;
                const post_id = myValue.post_id;
                const comment_id = myValue.comment_id;
                var comment_message = '';
                var user_id = '';
                var user_name = '';
                var peso = '1';
                if (myValue.verb === 'delete')
                    peso = '-1';
                else {
                    if (myValue.verb === 'edit')
                        peso = '0';
                    user_id = myValue.from.id;
                    user_name = myValue.from.name;
                    comment_message = myValue.message;
                };
                const contentLine = post_id.concat(separator, entry_time, separator, comment_id,
                    separator, comment_message, separator, user_id, separator, user_name, separator,
                    peso, '\n');
                //fs.appendFile('./diego.log', contentLine, err => {
                //    if (err) {
                //        console.error(err)
                //        return
                //    }
                //    //done!
                //});
                res.send(contentLine);
            };
        //};
    //};

    // Process the Facebook updates here
    received_updates.unshift(req.body);
});
app.listen();
