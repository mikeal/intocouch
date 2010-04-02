
// http://www.whitehouse.gov/briefing-room/disclosures/visitor-records
// http://www.whitehouse.gov/files/disclosures/visitors/WhiteHouse-WAVES-Released-0310.csv

var reader = require('./lib/reader'),
    csv = require('./lib/csv')
    sys = require('sys'),
    path = require('path'),
    http = require('http'),
    request = require('./lib/request');

var csvheader = 'NAMELAST,NAMEFIRST,NAMEMID,UIN,BDGNBR,ACCESS_TYPE,TOA,POA,TOD,POD,APPT_MADE_DATE,APPT_START_DATE,APPT_END_DATE,APPT_CANCEL_DATE,Total_People,LAST_UPDATEDBY,POST,LastEntryDate,TERMINAL_SUFFIX,visitee_namelast,visitee_namefirst,MEETING_LOC,MEETING_ROOM,CALLER_NAME_LAST,CALLER_NAME_FIRST,CALLER_ROOM,description,RELEASE_DATE'

var names = csvheader.split(',')

function coherse (val) {
  var x = parseInt(val);
  if (!isNaN(x)) {
    return x;
  } else {
    return val;
  }
}

var client = http.createClient(5984, 'localhost');

var url = 'http://localhost:5984/visitors/_bulk_docs'

var count = 0;
var docbuffer = [];
csv.each(path.join(__dirname, 'data', 'WhiteHouse-WAVES-Released-0310.csv'), {sep:'\r'})
  .addListener("data", function(data) {
    count += 1;
    if (count === 1) {return ;}
    var obj = {}
    
    for (var i=0;i<data.length;i+=1) {
      if (data[i] !== '') {
        obj[names[i]] = coherse(data[i]);
      }
    }
    obj.position = count;
    if (!obj.UIN || typeof(obj.UIN) !== "string") {
      obj._id = count.toString();
    } else {
      obj._id = obj.UIN;
    } 
    docbuffer.push(obj);
    if (docbuffer.length > 5000) {
      sys.puts("POST to "+url)
      request.request(url, 'POST', 
        JSON.stringify({docs:docbuffer}), 
        undefined, client, undefined, function (error, response) {
          if (error) {
            sys.puts('Error '+error)
          }
          sys.puts(response.statusCode)
          if (error) {sys.puts(sys.inspect(error))}
      });
      docbuffer = [];
    }
  }).addListener("complete", function() {
  sys.puts("POST to "+url)
  request.request(url, 'POST', 
    JSON.stringify({docs:docbuffer}), 
    undefined, client, undefined, function (error, response) {
      if (error) {
        sys.puts('Error '+error)
      }
      sys.puts('Response status == '+response.statusCode)
      if (error) {sys.puts(sys.inspect(error))}
      else {uploader()}
    });
    sys.puts('done');
});
