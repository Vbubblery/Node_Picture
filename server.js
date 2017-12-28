var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var fs = require('fs')
var multipart = require('connect-multiparty');

var swig  = require('swig');
var React = require('react');
var Router = require('react-router');
var routes = require('./app/routes');

var sharp = require('sharp');
var glob = require("glob")

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Get name list of name of imgs
/** 
    Thanks to app.use(express.static(path.join(__dirname, 'public')));
    Can be dictly viewed by /imgs/IMG_NAME
    {exampleA.jpg, exampleB.jpg}
**/
app.route('/api/retrieveImgsName').get((req, res, next) => glob(__dirname + '/public/imgs/*', {}, (err, files) =>{
  if(err)
    res.status(500).send("Something gose wrong");
  else
    res.status(200).send(files.map(s => s.replace(/.*\/imgs\//, "")))
}))

app.post('/api/upload', multipart(), async function(req, res){
  //get filename
  var filename = req.files.files.originalFilename || path.basename(req.files.files.path);
  //copy file to a public directory
  var targetPath = path.dirname(__filename) + '/public/imgs/'+ filename;
  //copy file
  //fs.createReadStream(req.files.files.path).pipe(fs.createWriteStream(targetPath));
  await sharp(req.files.files.path)
  .rotate()
  .resize(750,400)
  .ignoreAspectRatio()
  .toFile(targetPath,function(err,info){
    if(err)
      console.log(err)
    fs.unlink(req.files.files.path)
    //return file url
  res.json({code: 200, msg: {url: 'http://' + req.headers.host + '/' + filename}});
  });
  
  
  
});

app.use(function(req, res) {
  Router.run(routes, req.path, function(Handler) {
    var html = React.renderToString(React.createElement(Handler));
    var page = swig.renderFile('views/index.html', { html: html });
    res.send(page);
  });
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
