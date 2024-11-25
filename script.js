let model;
const video = document.getElementById("liveVideo");
const canvas = document.getElementById("parkingCanvas");
const ctx = canvas.getContext("2d");

let parkedCars = 0;
const detectedCars = [];
const carStayThreshold = 5 * 60 * 1000; // 5 minutes in milliseconds

const channelIPs = {
    1: "http://<ESP32-CAM-IP1>/stream", // Replace <ESP32-CAM-IP1> with actual IP for channel 1
    2: "http://<ESP32-CAM-IP2>/stream"  // Replace <ESP32-CAM-IP2> with actual IP for channel 2
};

async function loadModel() {
    model = await cocoSsd.load();
    changeChannel(1); // Default to channel 1
}

function changeChannel(channelNumber) {
    const channelTitle = document.getElementById("channelTitle");
    channelTitle.innerText = `Channel No.${channelNumber}`;
    
    const ip = channelIPs[channelNumber];
    if (ip) {
        video.src = ip;
        video.onloadeddata = () => detectObjects();
    }
}

async function detectObjects() {
    if (!model) return;
    const predictions = await model.detect(video);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const currentTime = Date.now();

    predictions.forEach((prediction) => {
        if (prediction.class === "car" && prediction.score > 0.5) {
            const [x, y, width, height] = prediction.bbox;
            ctx.strokeStyle = "red";
            ctx.lineWidth = 4;
            ctx.strokeRect(x, y, width, height);
            ctx.fillStyle = "red";
            ctx.fillText(`Car (${Math.round(prediction.score * 100)}%)`, x, y - 10);

            trackCar({ x, y, width, height }, currentTime);
        }
    });

    removeStaleCars(currentTime);
    requestAnimationFrame(detectObjects);
}

function trackCar(bbox, currentTime) {
    const car = detectedCars.find((car) => isSameCar(car.bbox, bbox));
    if (car) {
        car.lastSeen = currentTime;

        if (!car.isParked && currentTime - car.firstSeen >= carStayThreshold) {
            car.isParked = true;
            incrementCarCount();
        }
    } else {
        detectedCars.push({
            bbox,
            firstSeen: currentTime,
            lastSeen: currentTime,
            isParked: false
        });
    }
}

function removeStaleCars(currentTime) {
    const staleThreshold = 30 * 1000;
    detectedCars.forEach((car, index) => {
        if (currentTime - car.lastSeen > staleThreshold) {
            detectedCars.splice(index, 1);
        }
    });
}

function isSameCar(bbox1, bbox2) {
    const threshold = 50;
    return (
        Math.abs(bbox1.x - bbox2.x) < threshold &&
        Math.abs(bbox1.y - bbox2.y) < threshold &&
        Math.abs(bbox1.width - bbox2.width) < threshold &&
        Math.abs(bbox1.height - bbox2.height) < threshold
    );
}

function incrementCarCount() {
    parkedCars++;
    document.getElementById("parkedCarCount").innerText = `Parked Cars: ${parkedCars}`;
    saveDailyCount();
}

function saveDailyCount() {
    const today = new Date().toISOString().split("T")[0];
    fetch("http://localhost:3000/save-count", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: today, count: 1 })
    })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
}

function toggleFullScreen() {
    const videoContainer = document.querySelector(".video-container");
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else if (videoContainer) {
        videoContainer.requestFullscreen();
    }
}

loadModel();
