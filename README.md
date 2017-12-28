# Node_thumbnails_Picture

## This is for get all of the picture who are in the public/imgs

## The architecture
### Node.js, Express, React, Flux, Bootstrap 

## Overview
### Provide API to get the name of files who are in the public/imgs
`
app.route('/api/retrieveImgsName').get((req, res, next) => glob(__dirname + '/public/imgs/*', {}, (err, files) =>{
  if(err)
    res.status(500).send("Something gose wrong");
  else
    res.status(200).send(files.map(s => s.replace(/.*\/imgs\//, "")))
}))
`
### Provide API to Upload the img to public/imgs, the img who are uploaded will be deal with the sharp who can resize the image.
`
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
`
### Click one img, img will be in a bigger size, but if click again, it will be a thumbnails again.
### In the top of page, Client can upload the imgs, and we limite 10 imgs can be uploaded at the same time.
