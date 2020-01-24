import * as faceapi from 'face-api.js';

async function detectOneFace(input) {
  const singleFace = await faceapi.detectSingleFace(input)
  // .withFaceExpressions()
  // .withAgeAndGender();
  return singleFace || null;
}

export default detectOneFace;