// Obtiene el contexto del DOM
const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.height = window_height / 2;
canvas.width = window_width / 2;
canvas.style.background = "#ff8";

class Circle {
    constructor(x, y, radius, strokeColor, speed, text) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.baseStrokeColor = strokeColor;
        this.baseFillColor = "rgba(0,0,0,0)"; 
        this.collisionStrokeColor = "red"; 
        this.collisionFillColor = "rgba(255, 100, 100, 0.5)"; 
        this.speed = speed;
        this.text = text;

        this.dx = (Math.random() < 0.5 ? 1 : -1) * this.speed;
        this.dy = (Math.random() < 0.5 ? 1 : -1) * this.speed;

        this.collisionTimer = 0;
        this.collisionDuration = 30; 
    }

    draw(context) {
        context.beginPath();

        const currentStrokeColor = this.collisionTimer > 0 ? this.collisionStrokeColor : this.baseStrokeColor;
        const currentFillColor = this.collisionTimer > 0 ? this.collisionFillColor : this.baseFillColor;

        context.strokeStyle = currentStrokeColor;
        context.fillStyle = currentFillColor;
        context.lineWidth = 2;

        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.fill(); 
        context.stroke(); 

        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillStyle = currentStrokeColor; 
        context.fillText(this.text, this.posX, this.posY);

        context.closePath();
    }

    update(context) {
        if (this.collisionTimer > 0) {
            this.collisionTimer--;
        }

        if ((this.posX + this.radius) > canvas.width || (this.posX - this.radius) < 0) {
            this.dx = -this.dx;
        }

        if ((this.posY - this.radius) < 0 || (this.posY + this.radius) > canvas.height) {
            this.dy = -this.dy;
        }

        this.posX += this.dx;
        this.posY += this.dy;

        this.draw(context);
    }
}

// Generación de Entidades
let circles = [];
const N = 12; 

for (let i = 0; i < N; i++) {
    const radius = Math.floor(Math.random() * 30 + 30); 
    const x = Math.random() * (canvas.width - radius * 2) + radius;
    const y = Math.random() * (canvas.height - radius * 2) + radius;
    const speed = Math.random() * 2 + 1; 

    circles.push(new Circle(x, y, radius, "blue", speed, (i + 1).toString()));
}

// Loop de Animación
let updateCircle = function () {
    requestAnimationFrame(updateCircle);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Integración: Se llama a resolveCollision definida en main_colision.js
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            resolveCollision(circles[i], circles[j]);
        }
    }

    for (let i = 0; i < circles.length; i++) {
        circles[i].update(ctx);
    }
};

updateCircle();