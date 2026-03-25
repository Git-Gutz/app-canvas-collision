/**
 * @fileoverview Subsistema de evaluación de intersección espacial (Cinta B).
 * Mide en tiempo real la superposición de primitivas circulares
 * mutando su estado visual sin alterar la inercia vectorial.
 */
(() => {
    const canvas = document.getElementById("canvasB");
    const ctx = canvas.getContext("2d");
    canvas.height = 300; canvas.width = 300;

    let circles = [];
    let numEntities = 10;
    let gravityActive = false;
    const GRAVITY = 0.4;
    const DAMPING = 0.8;

    class CircleB {
        constructor(x, y, radius, speed, text) {
            this.posX = x; this.posY = y; this.radius = radius;
            this.speed = speed; this.text = text;
            this.dx = (Math.random() < 0.5 ? 1 : -1) * (Math.random() * speed + 1);
            this.dy = (Math.random() < 0.5 ? 1 : -1) * (Math.random() * speed + 1);
            this.isColliding = false; // Flag booleano de estado de intersección
        }
        draw(context) {
            context.beginPath();
            context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);

            const glassGradient = context.createRadialGradient(
                this.posX - this.radius * 0.3, this.posY - this.radius * 0.3, this.radius * 0.1,
                this.posX, this.posY, this.radius
            );
            glassGradient.addColorStop(0, "rgba(255, 230, 180, 0.4)"); 
            glassGradient.addColorStop(0.6, "rgba(20, 20, 20, 0.3)"); 
            glassGradient.addColorStop(1, "rgba(0, 0, 0, 0.5)"); 

            context.fillStyle = glassGradient;
            context.fill(); 

            // Evaluación ternaria del estado para alternar el trazo del Stroke
            context.strokeStyle = this.isColliding ? "#FF3366" : "#00E5FF";
            context.textAlign = "center"; context.textBaseline = "middle";
            context.font = "bold 20px 'Space Mono', monospace"; 
            context.fillStyle = "#F2EBE1";
            context.fillText(this.text, this.posX, this.posY);
            context.lineWidth = 2;
            context.stroke(); context.closePath();
        }
        update(context) {
            if (gravityActive) this.dy += GRAVITY;

            if (this.posX + this.radius > canvas.width) {
                this.posX = canvas.width - this.radius;
                this.dx = -this.dx * (gravityActive ? DAMPING : 1);
            } else if (this.posX - this.radius < 0) {
                this.posX = this.radius;
                this.dx = -this.dx * (gravityActive ? DAMPING : 1);
            }

            if (this.posY + this.radius > canvas.height) {
                this.posY = canvas.height - this.radius;
                this.dy = -this.dy * (gravityActive ? DAMPING : 1);
                if (gravityActive) this.dx *= 0.98;
            } else if (this.posY - this.radius < 0) {
                this.posY = this.radius;
                this.dy = -this.dy;
            }

            if (gravityActive && Math.abs(this.dy) < GRAVITY && this.posY + this.radius >= canvas.height - 1) {
                this.dy = 0;
            }

            this.posX += this.dx;
            this.posY += this.dy;
            this.draw(context);
        }
    }

    /**
     * Calcula la magnitud de la distancia entre dos puntos (Distancia Euclidiana).
     * @returns {number} Magnitud escalar del vector desplazamiento.
     */
    function getDist(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    function drawSchematic(context) {
        context.strokeStyle = "rgba(0, 229, 255, 0.08)";
        context.lineWidth = 1;
        context.beginPath();
        for (let x = 0; x <= canvas.width; x += 30) {
            context.moveTo(x, 0); context.lineTo(x, canvas.height);
        }
        for (let y = 0; y <= canvas.height; y += 30) {
            context.moveTo(0, y); context.lineTo(canvas.width, y);
        }
        context.stroke(); context.closePath();

        context.strokeStyle = "rgba(255, 51, 102, 0.15)";
        context.beginPath();
        context.moveTo(canvas.width/2, 0); context.lineTo(canvas.width/2, canvas.height);
        context.moveTo(0, canvas.height/2); context.lineTo(canvas.width, canvas.height/2);
        context.stroke(); context.closePath();

        context.fillStyle = "rgba(0, 229, 255, 0.3)";
        context.font = "10px 'Space Mono', monospace";
        context.textAlign = "left"; context.textBaseline = "top";
        context.fillText("SYS_PHAETHON_V2.1", 5, 5);
        context.fillText("TARGET: OVERLAP", 5, 20);
        context.textAlign = "right";
        context.fillText("d = √(Δx²+Δy²)", canvas.width - 5, 5);
        context.fillText("RAD_INTERSECT: ON", canvas.width - 5, 20);
    }

    function init() {
        circles = [];
        for (let i = 0; i < numEntities; i++) {
            let r = Math.random() * 20 + 10;
            let x = Math.random() * (canvas.width - r*2) + r;
            let y = Math.random() * (canvas.height - r*2) + r;
            circles.push(new CircleB(x, y, r, 3, (i+1).toString()));
        }
    }

    document.addEventListener('phaethon:cambioEntidades', (e) => {
        numEntities = e.detail;
        init();
    });
    
    document.addEventListener('phaethon:cambioGravedad', (e) => {
        gravityActive = e.detail;
        if (!gravityActive) circles.forEach(c => { if (c.dy === 0) c.dy = (Math.random() < 0.5 ? 1 : -1) * 3; });
    });

    init();

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        drawSchematic(ctx); 

        // Reseteo de flags antes de iterar la evaluación por frame
        circles.forEach(c => c.isColliding = false);
        
        // Bucles anidados O(n^2) para evaluar intersecciones espaciales
        for (let i = 0; i < circles.length; i++) {
            for (let j = i + 1; j < circles.length; j++) {
                // Validación matemática de superposición (distancia < sumatoria de radios)
                if (getDist(circles[i].posX, circles[i].posY, circles[j].posX, circles[j].posY) < circles[i].radius + circles[j].radius) {
                    circles[i].isColliding = true; 
                    circles[j].isColliding = true;
                }
            }
        }
        circles.forEach(c => c.update(ctx));
    }
    animate();
})();