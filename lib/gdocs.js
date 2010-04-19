var http = require('http'),
    sys = require('sys');

// POST /feeds/default/private/full/?convert=false HTTP/1.1
// Host: docs.google.com
// GData-Version: 3.0
// Authorization: <your authorization header here>
// Content-Length: 123456
// Content-Type: application/msword
// Slug: Example Title

function nonce= function(nonceSize) {
   var result = [];
   var chars= this.NONCE_CHARS;
   var char_pos;
   var nonce_chars_length= chars.length;
   
   for (var i = 0; i < nonceSize; i++) {
       char_pos= Math.floor(Math.random() * nonce_chars_length);
       result[i]= chars[char_pos];
   }
   return result.join('');
}

function auth (user, pass) {
  var qs = {  oauth_consumer_key:'opencouch.couchone.com'
            , oauth_nonce:nonce(64)
            , oauth_signature_method:'RSA-SHA1'
            , oauth_signature:sha(user, pass)
            , 
            }
  
  request("GET", "https://www.google.com/accounts/OAuthGetRequestToken")
}


function upload (filename, auth, )
