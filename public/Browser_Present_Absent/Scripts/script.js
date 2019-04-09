// Browser Present Absent Testing
const createVideo = () => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    let video = document.createElement('video');
    let videoContainer = document.getElementById('video-container');
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('width', 640);
    video.setAttribute('height', 480);
    videoContainer.appendChild(video);

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

const createModel = async (video) => {

  let left = false;
  let returned = false;

  const knn = ml5.KNNClassifier();
  let custom =  await knn.load('/Scripts/absent_present_model.json', (err,model) => {
    console.log("Custom Model Loaded");
  });
  const feat = await ml5.featureExtractor('MobileNet', (err, model) => {
    console.log("Feature Extractor Loaded");

    setInterval(() => {
      if(feat) {
        let features = feat.infer(video);
        knn.classify(features, (err, result)=> {
          let indicator = document.getElementById('indicator');
          switch (result.label) {
            case 'present':
              if(returned == false) {
                console.log("returned");
                tweet("returned");
                returned = true;
                left = false;
              } else {
                indicator.innerHTML = "present";
              }
              break;

            case 'absent':
              if(left == false) {
                console.log("left");
                tweet("left");
                returned = false;
                left = true;
              } else {
                indicator.innerHTML = "absent";
              }
            default:
          }
        });
      }
    },1);
  });
}

const tweet = (status) => {
  const xhr = new XMLHttpRequest();
  let url = `https://b283c524.ngrok.io/presence/${status}`;
  xhr.responseType = 'json';

  xhr.onreadystatechange = () => {
    if(xhr.readState == 4) {
      console.log(xhr.response);
    }
  }

  xhr.open('GET', url, true);
  xhr.send();
}

createVideo().then(createModel);
