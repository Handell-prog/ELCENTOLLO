const toggle = document.getElementById('menu-toggle');
        const nav = document.getElementById('nav-links');

        toggle.addEventListener('click', () => {
            const abierto = nav.classList.toggle('abierto');
            toggle.setAttribute('aria-expanded', abierto);
        });

        // Cerrar menú al hacer clic en un enlace (móvil)
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('abierto');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });