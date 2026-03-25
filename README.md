# ⚛️ Sistema de Detección de Colisiones 2D (App Canvas Collision)

Este proyecto es una simulación cinemática interactiva desarrollada con la API Canvas de HTML5 y JavaScript Vanilla. Diseñado como práctica de detección de colisiones e interacciones físicas en entornos bidimensionales, el sistema calcula intersecciones espaciales, conservación del momento lineal y aceleración gravitacional.

## 🚀 Características Principales

* **Renderizado de Alto Rendimiento:** Utiliza `requestAnimationFrame` para animaciones fluidas a 60 FPS.
* **Arquitectura Modular:** Tres entornos aislados (Cintas) que demuestran diferentes etapas del desarrollo de un motor físico:
    * **Cinta A:** Movimiento lineal básico y detección de bordes (Rebote simple).
    * **Cinta B:** Detección de superposición mediante cálculo de distancia Euclidiana.
    * **Cinta C:** Resolución de colisiones elásticas calculando vectores normales, masa proporcional al área ($m = \pi r^2$) y corrección de penetración.
* **Interfaz de Control Dinámica:** Event-Driven Architecture (EDA) que permite modificar la cantidad de entidades en tiempo real y alternar un vector de aceleración gravitacional global con coeficientes de pérdida de energía (amortiguamiento).
* **Diseño UI/UX "Retro-Industrial":** Estilización avanzada con CSS3, incluyendo efectos CRT (Cathode Ray Tube), Scanlines y *Glassmorphism* aplicado directamente al contexto de renderizado de Canvas para simular objetos tridimensionales.

## 🛠️ Tecnologías Utilizadas

* **HTML5** (Semántica y elemento `<canvas>`)
* **CSS3** (Variables CSS, Flexbox, Backdrop-filter)
* **JavaScript (ES6+)** (Clases, Arrow Functions, IIFE, CustomEvents, Math API)
* **Bootstrap 5.3** (Sistema de grillas y componentes UI)

## ⚙️ Estructura del Proyecto

```text
app-canvas-collision/
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── img/
│   │   └── bouncingball.png
│   └── js/
│       ├── controles.js       # Despachador global de eventos UI
│       ├── main_circulos.js   # Lógica Cinta A
│       ├── main_colision.js   # Lógica Cinta B
│       └── main_rebote.js     # Lógica Cinta C (Motor físico principal)
└── index.html                 # Estructura del DOM