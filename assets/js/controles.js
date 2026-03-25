/**
 * @fileoverview Despachador global de eventos (Event Dispatcher).
 * Actúa como un bus de eventos estático anclado al objeto `document`. 
 * Captura las interacciones del DOM y propaga objetos CustomEvent 
 * con un payload (detail) hacia los scripts de simulación.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los nodos del DOM de la interfaz
    const slider = document.getElementById('sliderParticulas');
    const lblCount = document.getElementById('lblCount');
    const toggleGravedad = document.getElementById('toggleGravedad');
    const btnReiniciar = document.getElementById('btnReiniciar');

    // Actualiza el nodo de texto en tiempo real durante el drag del slider
    slider.addEventListener('input', (e) => {
        lblCount.innerText = e.target.value;
    });

    // Despacha la mutación del estado (número de entidades) al soltar el slider
    slider.addEventListener('change', (e) => {
        const cantidad = parseInt(e.target.value);
        document.dispatchEvent(new CustomEvent('phaethon:cambioEntidades', { detail: cantidad }));
    });

    // Despacha el booleano del estado de la gravedad al conmutar el switch
    toggleGravedad.addEventListener('change', (e) => {
        document.dispatchEvent(new CustomEvent('phaethon:cambioGravedad', { detail: e.target.checked }));
    });

    // Fuerza una re-inicialización despachando el estado actual del slider
    btnReiniciar.addEventListener('click', () => {
        const cantidad = parseInt(slider.value);
        document.dispatchEvent(new CustomEvent('phaethon:cambioEntidades', { detail: cantidad }));
    });
});