// All styles
import './styles.scss';

// webcomponent
import './FrameworkComponent';

// auth
import { initializeLogin } from './googleAuthorization';

// In this worker we can detect glasses. 
const detectionWorker = new Worker('./workers/detectGlasses.js');

// in this worker we can sent the images to a server
const trainingsWorker = new Worker('./workers/imageProcessing.js');

// Code executed only in development mode
if (process.env.NODE_ENV !== 'production') {
  console.log('Looks like we are in development mode!');

  // if we want to use multiple camera's, then we can detect these
  import(/* webpackChunkName: "detectMediaDevices" */ './detectMediaDevices').then(({
    default: detectMediaDevices
  }) => detectMediaDevices(),
  ).catch(error => `An error occurred while loading the function detectMediaDevices: ${error}`);
}

// import all the models
const models = import(/* webpackChunkName: "loadModels" */ './loadModels').then(({
  default: loadModels
}) => loadModels,
).catch(error => `An error occurred while loading the function loadModels: ${error}`);

// then load the face-api.js models 
models.then((loadModels) => loadModels());

// import our detector function
const detector = import(/* webpackChunkName: "detector" */ './detector').then(({
  default: detector
}) => detector,
).catch(error => `An error occurred while loading the function detector: ${error}`);

// Create a root element and append to <body>
const root = document.createElement("div");
root.id = 'app';
document.body.appendChild(root);

// An encapsulated component, ready for a framework
const frameworkComponent = document.createElement('framework-component');
root.appendChild(frameworkComponent);

// A variable that stores the interval id (neded to stop the interval)
let interval;

// Video element with face time camera dementions
// Todo: use native camera dementions or specify the correct dementions
const video = document.createElement("video");
video.preload = 'auto'; // Hints to the UA that optimistically downloading the entire video is considered desirable.
video.muted = 'muted'; // no sound
video.width = 1280;
video.height = 720;
video.style.display = "none"; // hide the video stream
video.innerHTML = 'Video stream not available.' // Only displayed when the video stream is not available
video.id = 'video'; // why do we need this?
video.addEventListener('play', () => {
  // loop the detector function with the required video and worker parameters
  interval = setInterval(() => { detector.then((detect) => detect(video, detectionWorker, trainingsWorker)) }, 100);
});
root.appendChild(video);

function stopDetector() {
  clearInterval(interval);
}

function playVideo() {
  video.play();
}

function pauseVideo() {
  video.pause();
}

// create an info container
const infoNodeContainer = document.createElement("div");
infoNodeContainer.id = 'infoNodeContainer';
const notificationNode = document.createElement("p");
notificationNode.id = 'notificationNode' // used to observe the amount of images taken
notificationNode.innerText = 'select a number to begin'; // startup message
root.appendChild(infoNodeContainer);
infoNodeContainer.appendChild(notificationNode)

const formContainer = document.createElement('form');
root.append(formContainer);

// count the uploaded images of 1 product
let count = 0;

const inputField = document.createElement('input');
inputField.setAttribute('type', 'number');
inputField.setAttribute('min', 0)
inputField.setAttribute('step', 1);
inputField.onchange = (event) => {
  // Method to number the filenames / glasses
  if (Number(event.target.value) === NaN) return window.productCounter = null;
  // make globaly available
  window.productCounter = parseInt(event.target.value, 10);
  // reset counter
  count = 0;
};
inputField.setAttribute('value', '');
inputField.id = 'inputField';
formContainer.appendChild(inputField)

trainingsWorker.addEventListener('message', (event) => {
  notificationNode.innerText = count++ + ' images of model number ' + event.data.slice(113, event.data.length - 4 - 13 - 6); // minus filename + timestamp + label
});

const pausePlayButton = document.createElement('button');
pausePlayButton.setAttribute('type', 'button');

pausePlayButton.onclick = (event) => {
  if (event.target.innerText === 'start') {
    event.target.innerText = 'stop';

    return playVideo();
  }

  // so we stop
  event.target.innerText = 'start';

  // stop recording
  stopDetector();
  pauseVideo();
};

// default text
pausePlayButton.innerText = 'stop';
formContainer.appendChild(pausePlayButton);

// create a footer with login buttons
const footer = document.createElement('footer');
root.appendChild(footer);

// async login functionality
(async function () {
  await initializeLogin(footer);
})();



// Select the node that will be observed for mutations
const targetNode = document.getElementById('notificationNode');

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = function (mutationsList, observer) {
  // Use traditional 'for loops' for IE 11
  for (let mutation of mutationsList) {

    // TODO: how many pictures?
    // stop the video after a couple of pictures
    if (mutation.target.innerText.startsWith('150')) {
      // programaticly click on the pause button
      pausePlayButton.click();
    }
  }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);