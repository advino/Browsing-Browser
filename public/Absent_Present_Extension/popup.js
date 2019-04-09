// Browsing Browser Extension Script
const createVideo = () => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    let video = document.createElement('video');
    let videoContainer = document.getElementById('video-container');
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('width', 320);
    video.setAttribute('height', 240);
    videoContainer.appendChild(video);
    video.style.display = 'none';

    let parameters = {
      audio: false,
      video: true
    };

    navigator.mediaDevices.getUserMedia(parameters).then(stream => {
      video.srcObject = stream;
    }).catch(err => {
      console.log(err.name + ": " + err.message);
    });

    return new Promise((resolve, reject) => {
      setInterval(() => {
        resolve(video);
      }, 1000);
    });
  } else {
    alert("Media Devices is not supported :(");
  }
}

let laura = "I love you :)";

const createModel = async (video) => {
  let left = false;
  let returned = false;

  const knn = ml5.KNNClassifier();
  let custom =  await knn.load('./absent_present_model.json', (err,model) => {
    console.log("Custom Model Loaded");
  });
  const feat = await ml5.featureExtractor('MobileNet', (err, model) => {
    console.log("Feature Extractor Loaded");
    let img = document.querySelector('img');

    setInterval(() => {
      if(feat) {
        let features = feat.infer(video);
        knn.classify(features, (err, result)=> {
          if(result !== undefined) {
            switch (result.label) {
              case 'present':
                if(returned == false) {
                  console.log("returned");
                  img.style.display = 'block';
                  returned = true;
                  left = false;

                  let snap = snapshot(video);
                  let snapMessage = snap.toDataURL();
                  tweet("returned", snapMessage);
                } else {
                }
                break;

              case 'absent':
                if(left == false) {
                  console.log("left");
                  img.style.display = 'none';
                  returned = false;
                  left = true;

                  let snap = snapshot(video);
                  let snapMessage = snap.toDataURL();
                  tweet("left", snapMessage);
                } else {
                }
              default:
            }
          }
        });
      }
    },1);
  });
}

const tweet = (status, img) => {
  const xhr = new XMLHttpRequest();
  let url = 'https://b283c524.ngrok.io/snapshot';
  xhr.responseType = 'json';

  const data = JSON.stringify({
    state: status,
    image: img
  });

  xhr.onreadystatechange = () => {
    if(xhr.readyState == 4) {
      console.log(xhr.response);
    }
  }

  xhr.open('POST', url);
  xhr.setRequestHeader('Content-type', 'application/json');
  xhr.send(data);
}


const snapshot = (video) => {
  let c = document.createElement('canvas');
  c.setAttribute('width', 320);
  c.setAttribute('height', 240);
  let ctx = c.getContext('2d');

  ctx.drawImage(video,0,0, c.width, c.height);

  return c;
}

createVideo().then(createModel);

window.onunload = e => {
  let snap = snapshot(video);
  let snapMessage = snap.toDataURL();
  tweet("left", snapMessage);
}
