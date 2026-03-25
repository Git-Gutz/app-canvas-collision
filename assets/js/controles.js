// controles.js
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('sliderParticulas');
    const lblCount = document.getElementById('lblCount');
    const toggleGravedad = document.getElementById('toggleGravedad');
    const btnReiniciar = document.getElementById('btnReiniciar');

    // Actualizar el número visualmente al mover el slider
    slider.addEventListener('input', (e) => {
        lblCount.innerText = e.target.value;
    });

    // Despachar el evento de cambio de cantidad cuando sueltas el slider
    slider.addEventListener('change', (e) => {
        const cantidad = parseInt(e.target.value);
        document.dispatchEvent(new CustomEvent('phaethon:cambioEntidades', { detail: cantidad }));
    });

    // Despachar el evento de gravedad
    toggleGravedad.addEventListener('change', (e) => {
        document.dispatchEvent(new CustomEvent('phaethon:cambioGravedad', { detail: e.target.checked }));
    });

    // Botón para reiniciar
    btnReiniciar.addEventListener('click', () => {
        const cantidad = parseInt(slider.value);
        document.dispatchEvent(new CustomEvent('phaethon:cambioEntidades', { detail: cantidad }));
    });
});