'option strict'

exports.getInfo = function (myPath, myToken, myFunction, post_id_to_function, comment_id_to_reaction) {
    var https = require('follow-redirects').https;
    var options = {
        'method': 'GET',
        'hostname': 'graph.workplace.com',
        'path': myPath,
        'headers': {
            'Authorization': 'Bearer ' + myToken
        },
        'maxRedirects': 20
    };
    //console.log(options);
    var req = https.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

         res.on("end",  function () {
             var body = Buffer.concat(chunks);
             if ((post_id_to_function)&&(comment_id_to_reaction)) {
                 myFunction(body.toString(), post_id_to_function, comment_id_to_reaction);
             } else if (post_id_to_function) {
                 myFunction(body.toString(), post_id_to_function);
             } else {
                 myFunction(body.toString());
             };
        });

        res.on("error", function (error) {
            console.error(error);
        });
    });
    
    req.end();
    return;
};
