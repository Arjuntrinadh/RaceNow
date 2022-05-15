

class Car {
    constructor(x, y, w, h,controlType,maxSpeed = 10,img) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.damaged = false
        this.damagedSound = false
        this.speed = 0;
        this.accerlation = 0.2;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;
        this.angle = 0;
        this.polygon = [{}]
        if(controlType != "DUMMY"){
        this.sensor = new Sensor(this);
        this.sensor.update([
            [0, 0],
            [0, 0]
        ],[]);
        }
        this.controls = new Controls(controlType);
        this.carType = controlType
        this.img = img
        this.EngineStarted = false
        this.audio2 = new Audio('carengine.wav');
         this.audio = new Audio('damage.wav');
    }

    update = (roadBoarders,trafffic) => {
 
        if (!this.damaged) {
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBoarders,trafffic)
        }
        if(this.carType != "DUMMY"){
        this.sensor.update(roadBoarders,trafffic);
        }
    }


    #assessDamage(roadBoarders,trafffic) {

        for (let i = 0; i < roadBoarders.length; i++) {
            if (polyIntersect(this.polygon, roadBoarders[i])) {
                return true;
            }

        }
        for (let i = 0; i < trafffic.length; i++) {
            if (polyIntersect(this.polygon, trafffic[i].polygon)) {
                return true;
            }
            
        }
       
        return false
    }
    
    #createPolygon() {
        const points = [];
        const rad = Math.hypot(this.w, this.h) / 2;
        const alpha = Math.atan2(this.w, this.h);
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad
        })
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad
        })

        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad
        })
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad
        })
        return points
    }

    //car movements
    #move() {
        //accerlating
        if (this.controls.forward) {
            this.speed += this.accerlation;
        }
        //deaccerlating
        if (this.controls.reverse) {
            this.speed -= this.accerlation;
        }
        //control maxSpeed
        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed
        }
        //control reverse maxSpeed
        if (this.speed < -this.maxSpeed / 2) {
            this.speed = -this.maxSpeed / 2
        }
        //apply friction for forward
        if (this.speed > 0) {
            this.speed -= this.friction;
        }
        //apply friction for backward
        if (this.speed < 0) {
            this.speed += this.friction;
        }
        //correction for float values
        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        if (this.speed != 0) {
            const flip = this.speed > 0 ? 1 : -1;
            if (this.controls.left) {
                this.angle += 0.03;
            }
            if (this.controls.right) {
                this.angle -= 0.03;
            }
        }

        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }

    draw(ctx) {
        var car = new Image();
        car.src = this.img;
        if(this.speed != 0 && this.carType != "DUMMY" && this.EngineStarted == false){
          
            this.audio2.loop = false
            this.audio2.volume = 0.8

            this.audio2.play();
            this.EngineStarted = true
        }
        ctx.save();
        ctx.translate(this.x, this.y)
        ctx.rotate(-this.angle)
        ctx.beginPath();

        ctx.drawImage(car, -this.w/2,
            -this.h/2,
            this.w ,
            this.h );
        if (this.damaged) {
            var crash = new Image();
            crash.src = "crash.png"
            ctx.drawImage(crash, -this.w,
                -this.h,
                this.w * 2,
                this.h * 2);
            if (this.damagedSound == false) {
                this.audio2.pause()
                
                this.audio.loop = false
                this.audio.play();
                this.damagedSound = true
            }
        }
        ctx.restore();
        if(this.carType != "DUMMY"){
        this.sensor.draw(ctx)
        }
    }
}

