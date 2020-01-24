import * as faceapi from 'face-api.js';

// import all models
export default function loadModels() {
  return Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'), // fast detection
    // faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    // faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    // faceapi.nets.faceExpressionNet.loadFromUri('./models'),
    // faceapi.nets.ageGenderNet.loadFromUri('./models'),
    // faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    // faceapi.nets.faceLandmark68TinyNet.loadFromUri('./models'),
    // faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
  ]).then(import(/* webpackChunkName: "startVideo" */ './startVideo').then(({
    default: startVideo
  }) => startVideo(),
  ).catch((error) => `An error occurred while loading the function startVideo: ${error}`))
}
