/*
 * Detect faces with help of a worker.
 * If a traingingsworker is provided images will sent to google
 *
 * @param videostream - required
 * @param worker - worker that can return predictions
 * @param trainingsworker - optional worker that can process images
 * 
 * returns a unit8ClampedArray / imageData object
 */
export default async function detector(videoStream, worker, trainingsWorker) {
  // error message
  if (!videoStream || !worker) return console.error('This function needs a worker and a video stream');

  // import tinyFace
  const detectTinyFace = import(/* webpackChunkName: "detectTinyFace" */ './detectTinyFace').then(({
    default: detectTinyFace
  }) => detectTinyFace,
  ).catch(error => `An error occurred while loading the function detectTinyFace: ${error}`);

  // tiny face detection - fast
  const faceDetection = await detectTinyFace.then((faceDetection) => faceDetection(videoStream));

  // if no face is detected
  if (!faceDetection) return worker.postMessage('Look in this mirror');

  // The person needs to be a bit closer
  if (faceDetection.box.area < 100000) return worker.postMessage('Come closer!');

  // Create an offscreen canvas element to create pictures
  // why offscreen? because it's faster. It is not supporded by all browsers
  if (!window.OffscreenCanvas) return console.error('offscreenCanvas is not supported')
  const offscreen = new OffscreenCanvas(videoStream.width, videoStream.height);
  const contex = offscreen.getContext('2d');

  // Clear the offscreen canvas and set dementions of only the face.
  // Pixels are whole numbers, so we need to floor some values.
  contex.clearRect(0, 0, videoStream.width, videoStream.height);
  offscreen.width = Math.floor(faceDetection.box.width);
  offscreen.height = Math.floor(faceDetection.box.height);

  // Draw the image in an offscreen canvas contex.
  // This because otherwise we can't collect the right image data.
  // The coordinates are floats, thats why I floor them.
  contex.drawImage(videoStream,
    Math.floor(faceDetection.box.x),      // dx from video stream
    Math.floor(faceDetection.box.y),      // dy from video stream
    Math.floor(faceDetection.box.width),  // width
    Math.floor(faceDetection.box.height), // height
    0,                                    // x target
    0,                                    // y target
    Math.floor(faceDetection.box.width),  // with target
    Math.floor(faceDetection.box.height), // height target
  );

  // create a unit8ClampedArray with imagedata
  // the same size as the drawn image
  const imageData = contex.getImageData(
    0,                                     // dx
    0,                                     // dy
    Math.floor(faceDetection.box.width),
    Math.floor(faceDetection.box.height),
  );

  // if we have a trainingsworker and a token
  if (trainingsWorker && window.data && window.productCounter) {
    trainingsWorker.postMessage(window.productCounter);
    trainingsWorker.postMessage(imageData);
    trainingsWorker.postMessage(window.data)
  }

  // return the image data in an ImageData object: unit8ClampedArray
  // return worker.postMessage(imageData);
}
