var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', function(request, response) {
  response.send('OK');
});

app.get('/cities', function(request, response) {
  var cities = ['Colima', 'San Francisco', 'Oakland'];
  response.json(cities);
});
module.exports = app;