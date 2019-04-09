const express = require('express');
let cors = require('cors')
const app = express();
const port = 5000;
const server = app.listen(port, () => {
  console.log(`Server initialzed at port: ${port}`);
});

app.use(express.static(__dirname + "/public/Absent_Present_Extension"));

app.use(cors());

const path = require('path');
const fs = require('fs');

const bodyParser = require('body-parser');
app.use(bodyParser.json({
  limit: '16mb'
}));

app.use(bodyParser.urlencoded({
  extended: false,
  limit: '16mb'
}));


const twitMod = require('./twitMod.js');
const responses = require('./responses.js');
const T = twitMod.T;

const saveImg = (data) => {
  let matches = data.match(/^data:.+\/(.+);base64,(.*)$/);
  let buffer = new Buffer(matches[2], 'base64');

  let savePath = path.resolve('Image' + '.png');
  fs.writeFileSync(savePath, buffer);
  console.log("Saved");
}

app.get("/presence/:status", (req,res,next) => {

  let status = req.params.status;
  console.log(status);
  let date = Date();

  if(status == 'left') {
    T.post('statuses/update', {status: responses.left[Math.floor(Math.random() * 3)] + date}, (err, data, response) => {
      console.log("Posted" + req.params.status);
    });
  } else {
    T.post('statuses/update', {status: responses.returned[Math.floor(Math.random() * 3)] + date}, (err, data, response) => {
      console.log("Posted" + req.params.status);
    });
  }

  res.status(200).send();
});

app.post("/snapshot", (req,res,next) => {
  console.log("Post Request");
  let state = req.body.state;
  console.log(state);
  saveImg(req.body.image);

  let b64content = fs.readFileSync('./Image.png', {encoding: 'base64'});

  T.post('media/upload', {media_data: b64content}, (err, data, response) => {
    console.log("test");
    let mediaIdStr = data.media_id_string;
    let altText = "Me";
    let meta_params = {media_id: mediaIdStr, alt_text: {text: altText}};

    T.post('media/metadata/create', meta_params, () => {
      if(!err) {
        if(state == 'returned') {
          let params = {status: responses.returned[Math.floor(Math.random() * 3)], media_ids: [mediaIdStr]};

          T.post('statuses/update', params, (err, data, response) => {
            console.log("Posted Image");
          });
        } else {
          let params = {status: responses.left[Math.floor(Math.random() * 3)], media_ids: [mediaIdStr]};

          T.post('statuses/update', params, (err, data, response) => {
            console.log("Posted Image");
          });
        }
      }
    })
  })


  res.status(200).send();
});
