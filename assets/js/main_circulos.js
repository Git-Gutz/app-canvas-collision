(() => {
    const canvas = document.getElementById("canvasA");
    const ctx = canvas.getContext("2d");
    // Resoluciones internas cuadradas fijas
    canvas.height = 300; canvas.width = 300; 

    class Circle {
        constructor(x, y, radius, color, text, speed) {
            this.posX = x; this.posY = y; this.radius = radius;
            this.color = color; this.text = text; this.speed = speed;
            this.dx = (Math.random() < 0.5 ? 1 : -1) * this.speed;
            this.dy = (Math.random() < 0.5 ? 1 : -1) * this.speed;
        }
        draw(context) {
            context.beginPath();
            // Color de la línea del círculo (Cian)
            context.strokeStyle = "#00E5FF";
            context.textAlign = "center"; context.textBaseline = "middle";
            context.font = "bold 20px 'Space Mono', monospace"; 
            
            // Color del texto (Blanco/Crema)
            context.fillStyle = "#F2EBE1";
            context.fillText(this.text, this.posX, this.posY);
            
            context.lineWidth = 2;
            context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
            context.stroke(); context.closePath();
        }
        update(context) {
            if ((this.posX + this.radius) > canvas.width || (this.posX - this.radius) < 0) this.dx = -this.dx;
            if ((this.posY - this.radius) < 0 || (this.posY + this.radius) > canvas.height) this.dy = -this.dy;
            this.posX += this.dx; this.posY += this.dy;
            this.draw(context);
        }
    }

    let circles = [];
    for (let i = 0; i < 5; i++) {
        let r = Math.random() * 30 + 20;
        circles.push(new Circle(Math.random() * (canvas.width - r*2) + r, Math.random() * (canvas.height - r*2) + r, r, "#00E5FF", (i+1).toString(), 2));
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        circles.forEach(c => c.update(ctx));
    }
    animate();
})();