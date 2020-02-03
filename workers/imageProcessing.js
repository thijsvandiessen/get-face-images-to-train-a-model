// ImageData object to a png blob
async function imageDataToBlob(imageData) {
  const canvas = new OffscreenCanvas(imageData.width, imageData.height);
  const context = canvas.getContext("2d");
  context.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height); // synchronous

  return new Promise((resolve, reject) => {
    resolve(canvas.convertToBlob({ type: 'image/png', quality: 1 }))
    reject(new Error("Whoops, imageDataToBlob() failed!"))
  });
};

// make the token accessable
let token

// POST method
async function postData(url = '', data = {}) {
  // return if we do not have a token.
  if (!token) return null;

  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'image/png',
      // TODO 
      Authorization: `${token.token_type} ${token.access_token}`,
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *client
    body: data, // body data type must match "Content-Type" header
  });

  return response;
}

// the glasses ID
let productCounter

self.onmessage = async (message) => {
  // what if the message is a product count number?
  if (typeof message.data === 'number') return productCounter = message.data
  // What if the messag is a token?
  if (message.data.constructor.name !== 'ImageData') return token = message.data;

  // create a png image blob from the messsage.data
  const blob = await imageDataToBlob(message.data).then((png => png))

  // Generate a date object to create a unique file name
  const date = new Date();

  // the name of the glasses, to append
  // TODO: store also the amount of glasses? Maybe not possible
  const url = `https://storage.googleapis.com/upload/storage/v1/b/grv-test-upload-image/o?uploadType=media&name=glasses_number__${productCounter}-time-${date.getTime()}.png`;

  try {
    // sent images to google
    postData(url, blob).then((data) => {
      if (!data.ok) throw data;
      // success message
      return self.postMessage(data.url)
    });
  } catch (error) {
    console.error(error);
  };
};
