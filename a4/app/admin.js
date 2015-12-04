var express = require('express');
var app = express();

app.engine('jade', require('jade').__express)
app.set('view engine', 'jade')

app.use(express.static('public'))
app.use(require('./controllers/route_user'))
app.use(require('./controllers/index'))

app.listen(3000, function() {
  console.log('Listening on port 3000.')
})
