/**
 * @fileoverview Motor cinemático de rebote simple (Cinta A).
 * Encapsulado en una IIFE (Immediately Invoked Function Expression) 
 * para proteger su scope léxico y aislar su ciclo de vida.
 */
(() => {
    // Inicialización del contexto de renderizado 2D
    const canvas = document.getElementById("canvasA");
    const ctx = canvas.getContext("2d");
    canvas.height = 300; canvas.width = 300; 

    // Estado local de la simulación
    let circles = [];
    let numEntities = 10;
    let gravityActive = false;
    
    // Constantes físicas
    const GRAVITY = 0.4;  // Magnitud escalar de la aceleración gravitacional (px/frame^2)
    const DAMPING = 0.8;  // Coeficiente de restitución para pérdida de energía cinética

    class Circle {
        /**
         * Inicializa un vector de posición (posX, posY) y un vector de velocidad (dx, dy).
         */
        constructor(x, y, radius, color, text, speed) {
            this.posX = x; this.posY = y; this.radius = radius;
            this.color = color; this.text = text; this.speed = speed;
            // Asignación de velocidad escalar inicial aleatorizada con dirección arbitraria
            this.dx = (Math.random() < 0.5 ? 1 : -1) * (Math.random() * speed + 1);
            this.dy = (Math.random() < 0.5 ? 1 : -1) * (Math.random() * speed + 1);
        }

        /**
         * Renderiza el objeto en el buffer del canvas actual aplicando
         * un gradiente radial para simular refracción de volumen.
         */
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

            context.strokeStyle = "#00E5FF"; 
            context.textAlign = "center"; context.textBaseline = "middle";
            context.font = "bold 20px 'Space Mono', monospace"; 
            context.fillStyle = "#F2EBE1";
            context.fillText(this.text, this.posX, this.posY);
            context.lineWidth = 2;
            context.stroke(); context.closePath();
        }

        /**
         * Integración numérica para actualizar el vector de posición por fotograma.
         */
        update(context) {
            // Inyección del vector de aceleración en la componente Y de la velocidad
            if (gravityActive) this.dy += GRAVITY;

            // Resolución de colisiones ortogonales (Paredes laterales)
            if (this.posX + this.radius > canvas.width) {
                this.posX = canvas.width - this.radius; // Corrección de penetración
                this.dx = -this.dx * (gravityActive ? DAMPING : 1); // Inversión del vector escalar
            } else if (this.posX - this.radius < 0) {
                this.posX = this.radius;
                this.dx = -this.dx * (gravityActive ? DAMPING : 1);
            }

            // Resolución de colisiones ortogonales (Techo y Suelo)
            if (this.posY + this.radius > canvas.height) {
                this.posY = canvas.height - this.radius;
                this.dy = -this.dy * (gravityActive ? DAMPING : 1);
                // Fricción horizontal simulada al tocar el piso
                if (gravityActive) this.dx *= 0.98;
            } else if (this.posY - this.radius < 0) {
                this.posY = this.radius;
                this.dy = -this.dy;
            }

            // Umbral de reposo para anular la integración y evitar micro-oscilaciones
            if (gravityActive && Math.abs(this.dy) < GRAVITY && this.posY + this.radius >= canvas.height - 1) {
                this.dy = 0;
            }

            // Actualización de posición (Método de Euler discreto)
            this.posX += this.dx;
            this.posY += this.dy;
            this.draw(context);
        }
    }

    // Rasterizado de elementos estáticos (Retícula UI)
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
        context.fillText("TARGET: KINEMATICS", 5, 20);
        context.textAlign = "right";
        context.fillText("v = dx/dt", canvas.width - 5, 5);
        context.fillText("WALL_BOUNCE: ON", canvas.width - 5, 20);
    }

    // Población de la estructura de datos
    function init() {
        circles = [];
        for (let i = 0; i < numEntities; i++) {
            let r = Math.random() * 20 + 10;
            let x = Math.random() * (canvas.width - r*2) + r;
            let y = Math.random() * (canvas.height - r*2) + r;
            circles.push(new Circle(x, y, r, "#00E5FF", (i+1).toString(), 3));
        }
    }

    // Listeners del bus de eventos global para mutar el estado
    document.addEventListener('phaethon:cambioEntidades', (e) => {
        numEntities = e.detail;
        init();
    });

    document.addEventListener('phaethon:cambioGravedad', (e) => {
        gravityActive = e.detail;
        // Inyección de energía cinética artificial al desactivar la anomalía
        if (!gravityActive) {
            circles.forEach(c => {
                if (c.dy === 0) c.dy = (Math.random() < 0.5 ? 1 : -1) * 3;
            });
        }
    });

    init();

    // Bucle principal de renderizado atado al refresh rate del monitor
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawSchematic(ctx);
        circles.forEach(c => c.update(ctx));
    }
    animate();
})();