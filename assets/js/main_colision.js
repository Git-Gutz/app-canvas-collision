// Función auxiliar para calcular la distancia euclidiana
function getDistance(x1, y1, x2, y2) {
    let xDistance = x2 - x1;
    let yDistance = y2 - y1;
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

// Función principal de física de colisiones elásticas 2D
function resolveCollision(c1, c2) {
    const xDistance = c2.posX - c1.posX;
    const yDistance = c2.posY - c1.posY;
    const distance = getDistance(c1.posX, c1.posY, c2.posX, c2.posY);

    // Detección de superposición (Colisión)
    if (distance < c1.radius + c2.radius) {
        // 1. Vector normal de colisión
        const unx = xDistance / distance;
        const uny = yDistance / distance;

        // 2. Velocidades relativas a lo largo de la normal
        const v1n = (c1.dx * unx) + (c1.dy * uny);
        const v2n = (c2.dx * unx) + (c2.dy * uny);

        // 3. Transferencia de momento lineal (Rebote)
        c1.dx += (v2n - v1n) * unx;
        c1.dy += (v2n - v1n) * uny;
        c2.dx += (v1n - v2n) * unx;
        c2.dy += (v1n - v2n) * uny;

        // 4. Resolución de penetración (evita que los objetos colapsen o se peguen)
        const overlap = (c1.radius + c2.radius) - distance;
        c1.posX -= unx * (overlap / 2);
        c1.posY -= uny * (overlap / 2);
        c2.posX += unx * (overlap / 2);
        c2.posY += uny * (overlap / 2);

        // 5. Cambio de estado visual
        c1.collisionTimer = c1.collisionDuration;
        c2.collisionTimer = c2.collisionDuration;
    }
}