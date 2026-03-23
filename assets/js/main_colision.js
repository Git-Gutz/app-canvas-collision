const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;

// El canvas toma la mitad de la pantalla
canvas.height = window_height / 2;
canvas.width = window_width / 2;
canvas.style.background = "#ff8";

class Circle {
    constructor(x, y, radius, defaultColor, collisionColor, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.defaultColor = defaultColor;
        this.collisionColor = collisionColor;
        this.text = text;
        this.speed = speed;
        
        // Direcciones aleatorias iniciales (1 o -1)
        this.dx = (Math.random() < 0.5 ? 1 : -1) * this.speed;
        this.dy = (Math.random() < 0.5 ? 1 : -1) * this.speed;
        
        // Bandera de estado para el fotograma actual
        this.isColliding = false; 
    }

    draw(context) {
        context.beginPath();

        // El color cambia dependiendo de si hay colisión en este fotograma
        context.strokeStyle = this.isColliding ? this.collisionColor : this.defaultColor;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillStyle = "#000"; // Color del texto
        context.fillText(this.text, this.posX, this.posY);

        context.lineWidth = 2;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }

    update(context) {
        // Corrección: Los rebotes de pared ahora usan las dimensiones reales del canvas
        if ((this.posX + this.radius) >= canvas.width || (this.posX - this.radius) <= 0) {
            this.dx = -this.dx;
        }

        if ((this.posY - this.radius) <= 0 || (this.posY + this.radius) >= canvas.height) {
            this.dy = -this.dy;
        }

        this.posX += this.dx;
        this.posY += this.dy;

        this.draw(context);
    }
}

// Función auxiliar para calcular la distancia euclidiana
function getDistance(x1, y1, x2, y2) {
    let xDistance = x2 - x1;
    let yDistance = y2 - y1;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

// Generación de N círculos
let circles = [];
const N = 12; // Define la cantidad de círculos aquí

for (let i = 0; i < N; i++) {
    let radius = Math.floor(Math.random() * 30 + 20); // Radio aleatorio entre 20 y 50
    // Asegurar que aparezcan dentro de los límites del canvas
    let x = Math.random() * (canvas.width - radius * 2) + radius;
    let y = Math.random() * (canvas.height - radius * 2) + radius;
    let speed = Math.random() * 2 + 1; 

    // Colores: Azul por defecto, Rojo para colisión
    circles.push(new Circle(x, y, radius, "#4267B2", "#FF0000", (i + 1).toString(), speed));
}

let updateCircle = function () {
    requestAnimationFrame(updateCircle);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Reiniciar el estado de colisión para todos los círculos
    for (let i = 0; i < circles.length; i++) {
        circles[i].isColliding = false;
    }

    // 2. Detección de colisiones (Algoritmo O(n^2))
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            // Si la distancia entre centros es menor a la suma de los radios, hay superposición
            if (getDistance(circles[i].posX, circles[i].posY, circles[j].posX, circles[j].posY) < circles[i].radius + circles[j].radius) {
                circles[i].isColliding = true;
                circles[j].isColliding = true;
            }
        }
    }

    // 3. Actualizar posiciones y dibujar
    for (let i = 0; i < circles.length; i++) {
        circles[i].update(ctx);
    }
};

updateCircle();