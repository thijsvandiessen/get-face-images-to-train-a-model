// expirimental features need to be enabled to make this work
// planned to ship in chrome 80 on 4 feb 2020
import * as faceapi from 'face-api.js';

// a function that takes an image/video and returns facedetection magic or null
async function detectTinyFace(input) {
  // fast detection of single faces
  const detectFace = faceapi.detectSingleFace(
    input,
    new faceapi.TinyFaceDetectorOptions({
      inputSize: 320, // possible values: 128, 160, 224, 320, 416, 512, 608
      scoreThreshold: 0.6, // this is a relatively low threshold
    }),
  );

  return detectFace || null;
}

export default detectTinyFace;