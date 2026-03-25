(() => {
    const canvas = document.getElementById("canvasC");
    const ctx = canvas.getContext("2d");
    canvas.height = 300; canvas.width = 300;

    let circles = [];
    let numEntities = 10;
    let gravityActive = false;
    const GRAVITY = 0.4;
    const DAMPING = 0.8;

    class CircleC {
        constructor(x, y, radius, speed, text) {
            this.posX = x; this.posY = y; this.radius = radius;
            this.speed = speed; this.text = text;
            this.dx = (Math.random() < 0.5 ? 1 : -1) * (Math.random() * speed + 1);
            this.dy = (Math.random() < 0.5 ? 1 : -1) * (Math.random() * speed + 1);
            this.collisionTimer = 0;
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
            
            if (this.collisionTimer > 0) {
                context.fillStyle = "rgba(255, 51, 102, 0.3)"; 
                context.fill();
            }

            context.strokeStyle = this.collisionTimer > 0 ? "#FF3366" : "#00E5FF";
            context.lineWidth = 2;
            context.stroke(); 

            context.fillStyle = "#F2EBE1"; 
            context.textAlign = "center"; context.textBaseline = "middle"; 
            context.font = "bold 20px 'Space Mono', monospace";
            context.fillText(this.text, this.posX, this.posY);
            context.closePath();
        }
        update(context) {
            if (this.collisionTimer > 0) this.collisionTimer--;
            
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
function resolveCol(c1, c2) {
        const xDist = c2.posX - c1.posX; 
        const yDist = c2.posY - c1.posY;
        const dist = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));

        if (dist < c1.radius + c2.radius) {
            // 1. Vector normal (la dirección del choque)
            const nx = xDist / dist; 
            const ny = yDist / dist;

            // 2. Proyectar velocidades sobre el vector normal
            const v1n = (c1.dx * nx) + (c1.dy * ny); 
            const v2n = (c2.dx * nx) + (c2.dy * ny);

            // 3. Calcular la masa basándose en el área del círculo (m = pi * r^2)
            const m1 = Math.PI * Math.pow(c1.radius, 2);
            const m2 = Math.PI * Math.pow(c2.radius, 2);

            // 4. Ecuación de conservación de momento unidimensional
            const v1nFinal = (v1n * (m1 - m2) + 2 * m2 * v2n) / (m1 + m2);
            const v2nFinal = (v2n * (m2 - m1) + 2 * m1 * v1n) / (m1 + m2);

            // 5. Aplicar la nueva velocidad restando la vieja normal y sumando la nueva
            c1.dx += (v1nFinal - v1n) * nx; 
            c1.dy += (v1nFinal - v1n) * ny;
            c2.dx += (v2nFinal - v2n) * nx; 
            c2.dy += (v2nFinal - v2n) * ny;

            // 6. Corrección de penetración (para que no se queden pegadas)
            // Empujamos cada partícula basándonos en su masa (la pesada se mueve menos)
            const overlap = (c1.radius + c2.radius) - dist;
            const totalMass = m1 + m2;
            const c1Correction = (m2 / totalMass) * overlap;
            const c2Correction = (m1 / totalMass) * overlap;

            c1.posX -= nx * c1Correction; 
            c1.posY -= ny * c1Correction;
            c2.posX += nx * c2Correction; 
            c2.posY += ny * c2Correction;

            // Encender la luz roja de impacto
            c1.collisionTimer = 15; 
            c2.collisionTimer = 15;
        }
    }
    // --- NUEVO: Motor de Renderizado del Esquemático ---
    function drawSchematic(context) {
        // 1. Trazado de Cuadrícula (Grid)
        context.strokeStyle = "rgba(0, 229, 255, 0.08)"; // Cian muy tenue
        context.lineWidth = 1;
        context.beginPath();
        for (let x = 0; x <= canvas.width; x += 30) {
            context.moveTo(x, 0); context.lineTo(x, canvas.height);
        }
        for (let y = 0; y <= canvas.height; y += 30) {
            context.moveTo(0, y); context.lineTo(canvas.width, y);
        }
        context.stroke(); context.closePath();

        // 2. Ejes Centrales (Cruz de mira)
        context.strokeStyle = "rgba(255, 51, 102, 0.15)"; // Rojo tenue
        context.beginPath();
        context.moveTo(canvas.width/2, 0); context.lineTo(canvas.width/2, canvas.height);
        context.moveTo(0, canvas.height/2); context.lineTo(canvas.width, canvas.height/2);
        context.stroke(); context.closePath();

        // 3. Telemetría y Ecuaciones (Textos)
        context.fillStyle = "rgba(0, 229, 255, 0.3)";
        context.font = "10px 'Space Mono', monospace";
        
        context.textAlign = "left"; context.textBaseline = "top";
        context.fillText("SYS_PHAETHON_V2.1", 5, 5);
        context.fillText("TARGET: MOMENTUM", 5, 20);
        
        context.textAlign = "right";
        context.fillText("p = m*v", canvas.width - 5, 5);
        context.fillText("e = 1.0 (ELASTIC)", canvas.width - 5, 20);
    }

    function init() {
        circles = [];
        for (let i = 0; i < numEntities; i++) {
            let r = Math.random() * 20 + 10;
            let x = Math.random() * (canvas.width - r*2) + r;
            let y = Math.random() * (canvas.height - r*2) + r;
            circles.push(new CircleC(x, y, r, 3, (i+1).toString()));
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
        
        // Rasterizamos el esquemático antes que las canicas
        drawSchematic(ctx);
        
        for (let i = 0; i < circles.length; i++) {
            for (let j = i + 1; j < circles.length; j++) {
                resolveCol(circles[i], circles[j]);
            }
        }
        circles.forEach(c => c.update(ctx));
    }
    animate();
})();