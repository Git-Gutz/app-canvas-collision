(() => {
    const canvas = document.getElementById("canvasC");
    const ctx = canvas.getContext("2d");
    canvas.height = 300; canvas.width = 600;

    class CircleC {
        constructor(x, y, radius, speed, text) {
            this.posX = x; this.posY = y; this.radius = radius;
            this.speed = speed; this.text = text;
            this.dx = (Math.random() < 0.5 ? 1 : -1) * this.speed;
            this.dy = (Math.random() < 0.5 ? 1 : -1) * this.speed;
            this.collisionTimer = 0;
        }
        draw(context) {
            context.beginPath();
            context.strokeStyle = this.collisionTimer > 0 ? "red" : "blue";
            context.fillStyle = this.collisionTimer > 0 ? "rgba(255, 100, 100, 0.5)" : "rgba(0,0,0,0)";
            context.lineWidth = 2;
            context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
            context.fill(); context.stroke();
            context.fillStyle = "black"; context.textAlign = "center"; context.textBaseline = "middle"; context.font = "20px Arial";
            context.fillText(this.text, this.posX, this.posY);
            context.closePath();
        }
        update(context) {
            if (this.collisionTimer > 0) this.collisionTimer--;
            if ((this.posX + this.radius) > canvas.width || (this.posX - this.radius) < 0) this.dx = -this.dx;
            if ((this.posY - this.radius) < 0 || (this.posY + this.radius) > canvas.height) this.dy = -this.dy;
            this.posX += this.dx; this.posY += this.dy;
            this.draw(context);
        }
    }

    function resolveCol(c1, c2) {
        const xDist = c2.posX - c1.posX; const yDist = c2.posY - c1.posY;
        const dist = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));

        if (dist < c1.radius + c2.radius) {
            const unx = xDist / dist; const uny = yDist / dist;
            const v1n = (c1.dx * unx) + (c1.dy * uny); const v2n = (c2.dx * unx) + (c2.dy * uny);
            
            c1.dx += (v2n - v1n) * unx; c1.dy += (v2n - v1n) * uny;
            c2.dx += (v1n - v2n) * unx; c2.dy += (v1n - v2n) * uny;

            const overlap = (c1.radius + c2.radius) - dist;
            c1.posX -= unx * (overlap / 2); c1.posY -= uny * (overlap / 2);
            c2.posX += unx * (overlap / 2); c2.posY += uny * (overlap / 2);

            c1.collisionTimer = 30; c2.collisionTimer = 30;
        }
    }

    let circles = [];
    for (let i = 0; i < 10; i++) {
        let r = Math.random() * 25 + 15;
        circles.push(new CircleC(Math.random() * (canvas.width - r*2) + r, Math.random() * (canvas.height - r*2) + r, r, 2, (i+1).toString()));
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < circles.length; i++) {
            for (let j = i + 1; j < circles.length; j++) {
                resolveCol(circles[i], circles[j]);
            }
        }
        circles.forEach(c => c.update(ctx));
    }
    animate();
})();