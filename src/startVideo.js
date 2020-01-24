export default function startVideo() {

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return

  // get the video input as a stream
  navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: "user",
      width: video.width,
      height: video.height,
    }
  }).then((stream) => {
    const video = document.getElementById('video');
    // Older browsers may not have srcObject
    if ("srcObject" in video) {
      video.srcObject = stream;
    } else {
      console.warn('this is an old browser')
      video.src = window.URL.createObjectURL(stream);
    }
    video.onloadedmetadata = () => video.play();
  }).catch((err) => {
    console.log(err.name + ": " + err.message);
  });
};
