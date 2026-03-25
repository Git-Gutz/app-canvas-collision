(() => {
    const canvas = document.getElementById("canvasB");
    const ctx = canvas.getContext("2d");
    canvas.height = 300; canvas.width = 300;

    class CircleB {
        constructor(x, y, radius, speed, text) {
            this.posX = x; this.posY = y; this.radius = radius;
            this.speed = speed; this.text = text;
            this.dx = (Math.random() < 0.5 ? 1 : -1) * this.speed;
            this.dy = (Math.random() < 0.5 ? 1 : -1) * this.speed;
            this.isColliding = false;
        }
        draw(context) {
            context.beginPath();
            // Cambio de color al intersectar: Rojo Neón o Azul Cian
            context.strokeStyle = this.isColliding ? "#FF3366" : "#00E5FF";
            context.textAlign = "center"; context.textBaseline = "middle";
            context.font = "bold 20px 'Space Mono', monospace"; 
            
            // Color de la fuente
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

    function getDist(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }

    let circles = [];
    for (let i = 0; i < 10; i++) {
        let r = Math.random() * 25 + 15;
        circles.push(new CircleB(Math.random() * (canvas.width - r*2) + r, Math.random() * (canvas.height - r*2) + r, r, 2, (i+1).toString()));
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        circles.forEach(c => c.isColliding = false);
        for (let i = 0; i < circles.length; i++) {
            for (let j = i + 1; j < circles.length; j++) {
                if (getDist(circles[i].posX, circles[i].posY, circles[j].posX, circles[j].posY) < circles[i].radius + circles[j].radius) {
                    circles[i].isColliding = true; circles[j].isColliding = true;
                }
            }
        }
        circles.forEach(c => c.update(ctx));
    }
    animate();
})();