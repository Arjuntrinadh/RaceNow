const canvas = document.getElementById("myCanvas");
canvas.width = 450;


const ctx = canvas.getContext("2d");
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 60, 120, "KEYS", 10, "otherCar.png");
const cars = [
    "playCar.png",
    "playCar2.png",
    "playCar3.png",
    "playCar4.png",
    "playCar5.png",
    "playCar6.png",
    "playCar7.png",
    "playCar8.png",
    "playCar9.png",
]

const traffic = [

];
var trafficY = []
var previousLargeDistance = 0;
addTraffic(10);
animate();
var scoure = 0
var scouretxt = document.getElementById("scoure")
var high = window.localStorage.getItem("Highscore")
if(high == null){
    window.localStorage.setItem("Highscore","0")
}
var highScoure = document.getElementById("high_scoure")
highScoure.textContent = Math.floor(parseInt(high))
function muteSound() {
    if (car.audio2.paused) {
        car.audio2.play()
        car.audio.volume = 0.5
    }
    else {
        car.audio2.pause()
        car.audio.volume = 0
    
    } 
}
var isPaused = false
function pauseGame(){
    if(isPaused == true){
    isPaused = false
    }else{
        isPaused = true
       
    }
}
var carCount = 10
function addTraffic(x) {
    for (let i = 0; i < x; i++) {
        const y = previousLargeDistance + (-1 * Math.floor(Math.random() * 10000) + 100)
        trafficY.push(y)
        traffic.push(new Car(road.getLaneCenter(Math.floor(Math.random() * 4)), y, 60, 100, "DUMMY", Math.floor(Math.random() * 1) + 1, cars[Math.floor(Math.random() * 9)]))
    }
}
function restart(){
    window.location.reload()
}
function animate() {
    if(car.damaged){
    
        var highInt = parseInt(high)
        if(highInt < scoure){
        window.localStorage.setItem("Highscore",scoure)
        }
    }
    if(car.EngineStarted && !car.damaged && !isPaused){
            scoure = scoure + 1/60
           
scouretxt.textContent = Math.floor(scoure)
    }
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].update(road.borders, [])
    }

    previousLargeDistance = Math.min.apply(Math, trafficY)

    if (car.y-window.innerHeight+100 < previousLargeDistance) {
        carCount = carCount + 10
        addTraffic(carCount)
    }
    if(!isPaused){
    car.update(road.borders, traffic);
    canvas.height = window.innerHeight;
    ctx.save();
    ctx.translate(0, -car.y + canvas.height * 0.75);
    road.draw(ctx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(ctx)
    }
    car.draw(ctx);
}
    ctx.restore();
    requestAnimationFrame(animate);

}