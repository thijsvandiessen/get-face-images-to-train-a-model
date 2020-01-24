// list mediadevices
// we can access video data from multiple devices
export default function detectMediaDevices() {
  // when there are no mediaDevices
  if (!navigator.mediaDevices && !navigator.mediaDevices.enumerateDevices) return;

  // show the available mediaDevices
  navigator.mediaDevices.enumerateDevices().then((devices) => {
    console.info(...devices)
  }).catch((error) => {
    console.error(error.name + ": " + error.message);
  });
};
