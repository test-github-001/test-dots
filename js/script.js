'use strict';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.prepend(canvas);

var background = new Image();
background.src = "./src/images/bg-dark.jpg";
background.width = 5412;
background.height = 3594;

let vw, vh, cx, cy, bgX, bgY, bgW, bgH;

window.addEventListener('resize', updateSizes);
function updateSizes() {
    canvas.width = vw = window.innerWidth;
    canvas.height = vh = window.innerHeight;
    cx = Math.floor(vw / 2);
    cy = Math.floor(vh / 2);

    let k_w = background.width / vw;
    let k_h = background.height / vh;
    let k = k_w < k_h ? k_w : k_h;
    bgW = Math.floor(vw * k);
    bgH = Math.floor(vh * k);
    bgX = Math.floor((background.width - bgW) / 2);
    bgY = Math.floor((background.height - bgH) / 2);
}
updateSizes();

class Dot {

    constructor() {
        this.x = Math.floor(Math.random() * vw);
        this.y = Math.floor(Math.random() * vh);

        this.isInner = true;

        this.dx = cx - this.x;
        this.dy = cy - this.y;
        this.stepX = (this.x < cx) ? -Math.abs(this.dx / this.dy) : Math.abs(this.dx / this.dy);
        this.stepY = (this.y < cy) ? -Math.abs(this.dy / this.dx) : Math.abs(this.dy / this.dx);

        this.acc =  0.00001 + Math.random() / 10000;

        this.size = 1;
        this.sizeAdd = 0.05 + Math.random() / 10;

        this.colorR = Math.floor(Math.random() * 256);
        this.colorG = Math.floor(Math.random() * 256);
        this.colorB = Math.floor(Math.random() * 256);
        this.isAddColorR = (Math.random() < 0.5) ? true : false;
        this.isAddColorG = (Math.random() < 0.5) ? true : false;
        this.isAddColorB = (Math.random() < 0.5) ? true : false;

        this.alphaSub =  0.001 + Math.random() / 1000;
        this.alpha = this.alphaSub;

        this.color = `rgba(${this.colorR}, ${this.colorG}, ${this.colorB}, ${this.alpha})`;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();

        if (!this.isInner) this.size += this.sizeAdd;
        this.updateColor()
        this.x += this.acc * this.stepX;
        this.y += this.acc * this.stepY;
        this.acc *= 1.04;

        if (this.x + this.size < 0 || this.x - this.size > vw || this.y + this.size < 0 || this.y - this.size > vh) this.alpha = 0;
    }

    updateColor() {
        let RGB = Math.ceil( Math.random() * 3 );
        switch (RGB) {
            case 1 : [this.colorR, this.isAddColorR] = this.updateColorChannel(this.colorR, this.isAddColorR); break;
            case 2 : [this.colorG, this.isAddColorG] = this.updateColorChannel(this.colorG, this.isAddColorG); break;
            case 3 : [this.colorB, this.isAddColorB] = this.updateColorChannel(this.colorB, this.isAddColorB); break;
        }
        this.alpha += this.isInner ? this.alphaSub * 2 : -this.alphaSub;
        if (this.isInner && this.alpha >= 1){
            this.isInner = false;
            this.alpha = 1;
        }
        this.color = `rgba(${this.colorR}, ${this.colorG}, ${this.colorB}, ${this.alpha})`;
    }

    updateColorChannel(channel, isAdd) {
        isAdd = (isAdd && channel < 255) ? true : (channel > 0) ? false : true;
        channel = isAdd ? channel + 1 : channel - 1;
        return [channel, isAdd];
    }
}

function dotGenerator() {
    let dotNeed = dotAddedCounter - dotsArr.length;
    for (let i = 0; i < dotNeed; i++) dotsArr.push( new Dot() );
    if (dotAddedCounter < maxDots) dotAddedCounter++;
}

// INIT
const maxDots = 5000;
let dotsArr = [];

let dotAddedCounter = 1;

// ANIMATION
function animate() {
    ctx.clearRect(0, 0, vw, vh);

    ctx.drawImage(background, bgX, bgY, bgW, bgH, 0, 0, vw, vh);

    dotsArr.forEach( dot => dot.draw() );
    dotsArr = dotsArr.filter(dot => dot.alpha > 0);
    if (dotsArr.length < maxDots) dotGenerator();

    requestAnimationFrame(animate);
}

background.onload = function(){
    animate();   
}