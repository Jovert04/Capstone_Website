let model;
const video = document.getElementById("liveVideo");
const canvas = document.getElementById("parkingCanvas");
const ctx = canvas.getContext("2d");

let parkedCars = 0;

async function loadModel() {
    model = await cocoSsd.load();
    startDetection();
}

async function startDetection() {
    video.src = "http://<ESP32-IP>/stream"; // Replace <ESP32-IP> with the IP of the ESP32-CAM
    video.onloadeddata = () => {
        detectObjects();
    };
}

async function detectObjects() {
    if (!model) return;
    const predictions = await model.detect(video);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    predictions.forEach((prediction) => {
        if (prediction.class === "car" && prediction.score > 0.5) {
            const [x, y, width, height] = prediction.bbox;
            ctx.strokeStyle = "red";
            ctx.lineWidth = 4;
            ctx.strokeRect(x, y, width, height);
            ctx.fillStyle = "red";
            ctx.fillText(`Car (${Math.round(prediction.score * 100)}%)`, x, y - 10);
            incrementCarCount();
        }
    });

    requestAnimationFrame(detectObjects);
}

function incrementCarCount() {
    // Increase parked car count after car is detected for 5-10 minutes
    if (parkedCars < 1) {  // Just for example
        parkedCars++;
        document.getElementById("parkedCarCount").innerText = `Parked Cars: ${parkedCars}`;
    }
}

function changeChannel(channelNumber) {
    console.log(`Switching to channel ${channelNumber}`);
    const channelTitle = document.getElementById("channelTitle");
    if (channelNumber === 1) {
        channelTitle.innerText = "Channel No.1";
    } else {
        channelTitle.innerText = "Channel No.2";
    }
    // Add logic for switching video streams (can change ESP32 stream URL)
}

function toggleFullScreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        document.body.requestFullscreen();
    }
}

// Load the model and start detection
loadModel();
