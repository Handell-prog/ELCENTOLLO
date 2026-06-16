// ===== SLIDER =====
const slides = document.querySelectorAll('.slide');
const puntos = document.querySelectorAll('.punto');
let indiceActual = 0;
let intervalo;

function mostrarSlide(idx) {
    slides[indiceActual].classList.remove('activo');
    puntos[indiceActual].classList.remove('activo');
    indiceActual = (idx + slides.length) % slides.length;
    slides[indiceActual].classList.add('activo');
    puntos[indiceActual].classList.add('activo');
}

function iniciarIntervalo() {
    intervalo = setInterval(() => mostrarSlide(indiceActual + 1), 4000);
}

function reiniciarIntervalo() {
    clearInterval(intervalo);
    iniciarIntervalo();
}

document.getElementById('flecha_der').addEventListener('click', () => {
    mostrarSlide(indiceActual + 1);
    reiniciarIntervalo();
});

document.getElementById('flecha_izq').addEventListener('click', () => {
    mostrarSlide(indiceActual - 1);
    reiniciarIntervalo();
});

puntos.forEach(p => {
    p.addEventListener('click', () => {
        mostrarSlide(parseInt(p.dataset.idx));
        reiniciarIntervalo();
    });
});

iniciarIntervalo();
