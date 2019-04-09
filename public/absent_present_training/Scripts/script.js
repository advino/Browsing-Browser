// Training Interface
const createVideo = () => {
  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
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

const createModels = (video) => {

  let source = video;

  const knn = ml5.KNNClassifier();

  knn.load('../Scripts/absent_present_model.json', (err, model) => {
    if(err) {
      console.lo(egrr.name + ": " + err.message);
    }
    console.log('Custom Model Loaded');
  })

  console.log(knn);

  const feat = ml5.featureExtractor('MobileNet', () => {
    console.log("Extractor Loaded");
    assignFunc(feat, knn, source);
  });
}

const assignFunc = (feat, knn, video) => {
  let present = document.getElementById('present');
  let absent = document.getElementById('absent');
  let save = document.getElementById('save');

  present.onclick = () => {
    const features = feat.infer(video, 'conv_preds');
    knn.addExample(features, 'present');
    console.log("Present example added");
  }

  absent.onclick = () => {
    const features = feat.infer(video);
    knn.addExample(features, 'absent');
    console.log("Absent example added");
  }

  save.onclick = () => {
    knn.save('absent_present_model');
  }
}

createVideo().then(createModels);
