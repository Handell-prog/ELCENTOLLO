/* ===== MODAL DE OFERTAS - El Centollo ===== */
/* Aparece cada vez que se carga o recarga el index */

(function () {
    const overlay = document.getElementById("overlay_modal");
    const btnCerrar = document.getElementById("btn_cerrar_modal");
    const btnNoMostrar = document.getElementById("btn_no_mostrar");

    if (!overlay) return;

    // Mostrar el modal al cargar la página (siempre en index)
    function mostrarModal() {
        overlay.classList.remove("oculto");
        document.body.style.overflow = "hidden";
    }

    // Cerrar el modal
    function cerrarModal() {
        overlay.classList.add("oculto");
        document.body.style.overflow = "";
    }

    // Cerrar al hacer clic en el overlay (fuera del modal)
    overlay.addEventListener("click", function (e) {
        if (e.target === overlay) cerrarModal();
    });

    // Botón X
    if (btnCerrar) btnCerrar.addEventListener("click", cerrarModal);

    // Botón "No mostrar de nuevo hoy"
    if (btnNoMostrar) {
        btnNoMostrar.addEventListener("click", function () {
            cerrarModal();
        });
    }

    // Cerrar con Escape
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") cerrarModal();
    });

    // Mostrar al cargar
    mostrarModal();
})();
