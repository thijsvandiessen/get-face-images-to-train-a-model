import * as faceapi from 'face-api.js';

// A function that takes an image and returns an array of facedetection magic
async function detectMultipleFaces(input) {
  // fast detection of multiple faces
  const faceDetections = await faceapi.detectAllFaces(
    input, new faceapi.TinyFaceDetectorOptions({
      inputSize: 224, // possible values: 128, 160, 224, 320, 416, 512, 608
      scoreThreshold: 0.8, // this is an ok threshold, not that low
    }));

  // if no detections
  if (!faceDetections.length) return null;

  return faceDetections;
}

export default detectMultipleFaces;