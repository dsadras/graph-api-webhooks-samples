'option strict'

const access_token = 'DQVJzcjV0UC03cHRvZAkNDWlhlbVg4UGNxZAHpJVkZA0bjJldzdtakFxQ3B2SVVWWmdKX2o3UExBRFZA4al9aMWhHd2dMT01TeXIzMTlpcEZARbElwZAW9RVkhwdUNEbUIzZAWtvVWZAPSjRnUXZAKYXR2LTgyMXEwQWdHMllvS1ZAKT0hvS2JvNDBGcVYwRElKRklPMkVLTjlCbXhWYUtzSlZABdEFCTEM3aDBTNGQ0RU5HZAndpTW1XM0lJWE1UVFdaUG5xX3h1bGxwal93'
const group_id = '412614683895934'
var facebookAccess = require('./facebookAccess');
const peso_reaction_default = 0.5;
var peso_reaction = [];
peso_reaction['LIKE'] = .75;
peso_reaction['HAHA'] = .25;

var comment_id = '';

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
var received_reactions = [];

app.get('/log_full', function (req, res) {
    res.send('<pre>' + JSON.stringify(received_logfull, null, 2) + '</pre>');
});
app.get('/reactions', function (req, res) {
    res.send('<pre>' + JSON.stringify(received_reactions, null, 2) + '</pre>');
});

app.get(['/facebook', '/instagram'], function(req, res) {
  if (
    req.query['hub.mode'] == 'subscribe' &&
    req.query['hub.verify_token'] == token
  ) {
    res.send(req.query['hub.challenge']);
  } else {
    res.sendStatus(400);
  }
});

app.post('/facebook', function(req, res) {

  //if (!req.isXHubValid()) {
  //  console.log('Warning - request header X-Hub-Signature not present or invalid');
  //  res.sendStatus(401);
  //  return;
  //}

    const separator = process.env.SEPARATOR || '|';
    const arrEntry = req.body.entry || req.body[0].entry;
    
                //REACTIONS
    var ProcessReactions = function (x, post_id, comment_id) {
        //var post_id='pp'
        //var comment_id='cc'
        var myReactions = JSON.parse(x).data;
        for (let r = myReactions.length - 1; r >= 0; --r) {
            const user_id = myReactions[r].id;
            const user_name = myReactions[r].name;
            const user_reaction = myReactions[r].type;
            const peso = (peso_reaction[user_reaction]) ? peso_reaction[user_reaction] : peso_reaction_default;
            const contentLine = post_id.concat(separator, comment_id,
                separator, user_id, separator, user_name, separator,
                user_reaction, separator, peso);// '\n');
            received_reactions.unshift(contentLine);
        };
    };
                //COMMENTS
    var ProcessComments = function (x, post_id) {
        var myComments = JSON.parse(x).data;
        for (let c = myComments.length - 1; c >= 0; --c) {
            const comment_id = myComments[c].id;
            //busco comentarios del comment
            facebookAccess.getInfo('/' + comment_id + '/comments', access_token, ProcessComments, post_id);
            //busco reacciones del comment
            facebookAccess.getInfo('/' + comment_id + '/reactions?summary=true',
                access_token,
                ProcessReactions,
                post_id,
                comment_id
            );

        };

    };

                //FEED
    var ProcessFeed = function (x) {
        var myFeed = JSON.parse(x).data;
        for (let p = myFeed.length - 1; p >= 0; --p) {
            const post_id = myFeed[p].id;
            //busco comentarios del post
            facebookAccess.getInfo('/' + post_id + '/comments', access_token, ProcessComments, post_id);
            //busco reacciones del post
            facebookAccess.getInfo('/' + post_id + '/reactions?summary=true', access_token,
                ProcessReactions,
                post_id,
                'nocomment');
        };

    };
    if (received_reactions.length > 0) {
        received_reactions.splice(0,received_reactions.length)
    };
    facebookAccess.getInfo('/' + group_id + '/feed', access_token, ProcessFeed);

                ////REACTIONS
                //var f = function (x) { console.log(x) };
                //comment_id = '418815449942524';
                //facebookAccess.getInfo('/' + comment_id + '/reactions?summary=true', access_token, f);



    // Process the Facebook updates here
    received_logfull.unshift(req.body);
    res.sendStatus(200);
});

app.listen();
