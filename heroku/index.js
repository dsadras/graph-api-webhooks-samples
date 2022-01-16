'option strict'

const access_token = 'DQVJ1RUJWNE5KMHFVZA3I0a0JTdUJWdnA3M2dGUUpnd1pLUjBvNnpRRXFsYTU0ZA3RRYU5lRmI5VWNJVWJmSGJIMVkxRHQtUTVlZA0UzNEt4bk45bGlOelM2VEgzcU9lNThMN3AzbHZALVHQ1YjNIQ0trdTUxZATBRMHRoMUc0WkVKY0xWWGx5YkhzT05MaklhMUViWEhScVdPdHQ4VlpQMDNpanozdEhoWjJ5Y2owMkdKVEQzQkdfdl9RMWx0cVpoNWlhWndhYUVn'
const group_id = '412614683895934'
var facebookAccess = require('./facebookAccess');

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

app.get('/log_full', function(req, res) {
  res.send('<pre>' + JSON.stringify(received_logfull, null, 2) + '</pre>');
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
                    var myReactions = JSON.parse(x).data
                    for (let r = myReactions.length - 1; r >= 0; --r) {
                        const user_id = myReactions[r].id;
                        const user_name = myReactions[r].name;
                        const user_reaction = myReactions[r].type;
                        const peso = (peso_reaction[user_reaction]) ? peso_reaction[user_reaction] : peso_reaction_default;
                        const contentLine = post_id.concat(separator, comment_id,
                            separator, user_id, separator, user_name, separator,
                            user_reaction, separator, peso);// '\n');
                        console.log(contentLine);
                    };

                };
                //COMMENTS
                var ProcessComments = function (x, post_id) {
                    var myComments = JSON.parse(x).data
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
                    var myFeed = JSON.parse(x).data
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
                facebookAccess.getInfo('/' + group_id + '/feed', access_token, ProcessFeed);

                ////REACTIONS
                //var f = function (x) { console.log(x) };
                //comment_id = '418815449942524';
                //facebookAccess.getInfo('/' + comment_id + '/reactions?summary=true', access_token, f);



    // Process the Facebook updates here
    received_updates.unshift(req.body);
    res.sendStatus(200);
});

app.listen();
