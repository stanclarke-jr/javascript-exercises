const video = document.querySelector('.webcam');
const canvas = document.querySelector('.video');
const ctx = canvas.getContext('2d');
const faceCanvas = document.querySelector('.face');
const faceCtx = faceCanvas.getContext('2d');
const faceDetector = new window.FaceDetector();
const optionsSelector = document.querySelectorAll('.controls input[type="range"]');

const options = {
  SIZE: 18,
  SCALE: 1.1,
};

function handleOption(e) {
  const { value, name } = e.currentTarget;
  options[name] = parseFloat(value);
}

optionsSelector.forEach(input => input.addEventListener('input', handleOption));
// Write a function that will populate the user's video
async function populateVideo() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { width: 640, height: 360 },
  });
  video.srcObject = stream;
  await video.play();
  // Size the canvas to be the same as the video
  console.log(video.videoWidth, video.videoHeight);
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  faceCanvas.width = video.videoWidth;
  faceCanvas.height = video.videoHeight;
}

function drawFace(face) {
  const { width, height, top, left } = face.boundingBox;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#ffc600';
  ctx.lineWidth = 0.5;
  ctx.strokeRect(left, top, width, height);
}

function pixelate({ boundingBox: face }) {
  faceCtx.imageSmoothingEnabled = false;
  faceCtx.clearRect(0, 0, faceCanvas.width, faceCanvas.height);
  // 1. Draw the small face
  faceCtx.drawImage(
    // 5 source arguments
    video, // Where does the source come from?
    face.x, // Where do we start the source pull from?
    face.y,
    face.width,
    face.height,
    // 4 draw arguments
    face.x, // Where should we start drawing the x and y
    face.y,
    options.SIZE,
    options.SIZE
  );

  // 2. Take the small face out, and draw it back at normal size
  const width = face.width * options.SCALE;
  const height = face.height * options.SCALE;
  faceCtx.drawImage(
    // Source arguments (5)
    faceCanvas, // Source
    face.x, // Where do we start the source pull from?
    face.y,
    options.SIZE,
    options.SIZE,
    // Draw arguments (4)
    face.x - (width - face.width) / 2,
    face.y - (width - face.height) / 2,
    width,
    height
  );
}
async function detect() {
  const faces = await faceDetector.detect(video);
  // 1. Ask the browser when the next animation frame is
  // 2. Tell it to run detect()
  faces.forEach(drawFace);
  faces.forEach(pixelate);
  requestAnimationFrame(detect);
}

populateVideo().then(detect);
