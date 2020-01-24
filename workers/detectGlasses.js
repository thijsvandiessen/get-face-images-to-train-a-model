// worker method to import scripts
importScripts('https://unpkg.com/@tensorflow/tfjs', 'https://unpkg.com/@tensorflow/tfjs-automl')

// the tf model
const MODEL_URL = '../models/glassesModel.json';

// load the tf model
const model = tf.automl.loadImageClassification(MODEL_URL);

// function that can return the predictions
async function run(imageData) {
  // do not overflow the event loop
  if (!model) return null;

  model.then(async (m) => {
    // classify the image
    const predictions = await m.classify(imageData);

    return postMessage(predictions);
  });
};

// when a message is received
self.onmessage = async (message) => {
  // if the message is only text
  if (typeof message.data === 'string') return postMessage(message.data);

  // image - we can classify!
  return await run(message.data);
};