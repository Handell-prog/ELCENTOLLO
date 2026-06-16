// =========================================================
// CHATBOT - EL CENTOLLO
// Asistente virtual de preguntas frecuentes (FAQ)
// 100% HTML/CSS/JS, sin servidor ni API externa
// =========================================================

(function () {

    // ¿La página actual vive dentro de /paginas/ o es index.html (raíz)?
    const enPaginas = location.pathname.includes('/paginas/');

    // Rutas relativas válidas desde cualquiera de las páginas del sitio
    const RUTAS = {
        inicio:    enPaginas ? '../index.html'        : './index.html',
        menu:      enPaginas ? './menu.html'           : './paginas/menu.html',
        contacto:  enPaginas ? './contacto.html'       : './paginas/contacto.html',
        ubicacion: enPaginas ? './ubicacion.html'      : './paginas/ubicacion.html',
        reservas:  enPaginas ? './reservas.html'       : './paginas/reservas.html',
    };

    // ===== BASE DE PREGUNTAS FRECUENTES (10) =====
    const PREGUNTAS = [
        {
            id: 'horario',
            pregunta: '¿Cuál es el horario de atención?',
            palabrasClave: ['horario', 'hora', 'abren', 'cierran', 'atencion'],
            respuesta: 'Nuestro horario de atención es:<br>🕚 Lunes a Viernes: 11:00 am – 10:00 pm<br>🕙 Sábado: 10:00 am – 11:00 pm<br>🕙 Domingo: 10:00 am – 8:00 pm<br>🕚 Festivos: 11:00 am – 8:00 pm'
        },
        {
            id: 'ubicacion',
            pregunta: '¿Dónde están ubicados?',
            palabrasClave: ['ubicacion', 'direccion', 'donde quedan', 'donde estan', 'mapa', 'queda'],
            respuesta: 'Estamos en la Carrera 1 #93-50, Chicó Alto, Bogotá D.C. 📍',
            enlace: { ruta: 'ubicacion', texto: 'Ver mapa y ubicación' }
        },
        {
            id: 'reservas',
            pregunta: '¿Cómo hago una reserva?',
            palabrasClave: ['reserva', 'reservar', 'mesa', 'apartar'],
            respuesta: 'Reservar es muy fácil: solo completa el formulario de nuestra página de Reservas con tu fecha, hora y número de personas. 🦀',
            enlace: { ruta: 'reservas', texto: 'Ir a Reservas' }
        },
        {
            id: 'menu',
            pregunta: '¿Qué platos tienen en la carta?',
            palabrasClave: ['menu', 'carta', 'platos', 'comida', 'que tienen'],
            respuesta: 'Tenemos 10 especialidades del mar: Centollo al Natural, Langosta a la Plancha, Ceviche de Camarón, Salmón Ahumado, Pulpo a la Gallega, Paella de Mariscos, Tiradito de Atún, Almejas al Vapor, Corvina Grillada y Sopa de Mariscos.',
            enlace: { ruta: 'menu', texto: 'Ver carta completa' }
        },
        {
            id: 'precio_centollo',
            pregunta: '¿Cuánto cuesta el Centollo al Natural?',
            palabrasClave: ['precio', 'cuanto cuesta', 'cuanto vale', 'centollo natural', 'costo'],
            respuesta: 'El Centollo al Natural tiene un precio de <strong>$85.000</strong> e incluye limón y salsa vinagreta de la casa. 🦀'
        },
        {
            id: 'domicilio',
            pregunta: '¿Tienen servicio a domicilio?',
            palabrasClave: ['domicilio', 'entrega', 'delivery', 'llevar', 'envio'],
            respuesta: 'Por ahora no contamos con domicilios, pero puedes solicitar tu pedido para recoger en tienda llamando al <strong>(57) 316 690 0508</strong>.'
        },
        {
            id: 'contacto',
            pregunta: '¿Cómo puedo contactarlos?',
            palabrasClave: ['contacto', 'telefono', 'correo', 'whatsapp', 'email', 'llamar'],
            respuesta: 'Puedes escribirnos a <strong>servicioalcliente@elcentollo.com.co</strong>, llamarnos al <strong>(57) 316 690 0508</strong> o por WhatsApp al mismo número.',
            enlace: { ruta: 'contacto', texto: 'Ir a Contacto' }
        },
        {
            id: 'eventos',
            pregunta: '¿Organizan celebraciones o eventos especiales?',
            palabrasClave: ['evento', 'cumpleanos', 'aniversario', 'celebracion', 'fiesta'],
            respuesta: '¡Sí! Cuéntanos en el formulario de Reservas si es un cumpleaños o aniversario y prepararemos un detalle especial para la ocasión. 🎉'
        },
        {
            id: 'grupos',
            pregunta: '¿Atienden grupos grandes?',
            palabrasClave: ['grupo', 'grupos grandes', 'personas', 'cuantos somos'],
            respuesta: 'Claro, contamos con espacio para grupos grandes. Solo indícanos el número de personas en el formulario de Reservas y con gusto te ayudamos. 👨‍👩‍👧‍👦'
        },
        {
            id: 'pago',
            pregunta: '¿Qué formas de pago aceptan?',
            palabrasClave: ['pago', 'efectivo', 'tarjeta', 'transferencia', 'pagar'],
            respuesta: 'Aceptamos efectivo, tarjetas débito/crédito y transferencias. Próximamente también pago con código QR. 💳'
        }
    ];

    // ===== UTILIDADES =====
    function normalizar(texto) {
        return texto
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();
    }

    function escapeHTML(texto) {
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    }

    function buscarRespuesta(textoUsuario) {
        const texto = normalizar(textoUsuario);
        let mejor = null;
        let mejorPuntaje = 0;
        PREGUNTAS.forEach(p => {
            let puntaje = 0;
            p.palabrasClave.forEach(k => {
                if (texto.includes(normalizar(k))) puntaje++;
            });
            if (puntaje > mejorPuntaje) {
                mejorPuntaje = puntaje;
                mejor = p;
            }
        });
        return mejorPuntaje > 0 ? mejor : null;
    }

    function construirHTMLRespuesta(p) {
        let html = p.respuesta;
        if (p.enlace) {
            html += `<br><a class="enlace-chat" href="${RUTAS[p.enlace.ruta]}">${p.enlace.texto} →</a>`;
        }
        return html;
    }

    // ===== MARCADO DEL WIDGET =====
    const markup = `
        <div id="centollo-chatbot">
            <div id="chatbot-globo">¿Tienes preguntas? Escríbenos 🦀</div>

            <div id="chatbot-window" role="dialog" aria-label="Asistente virtual El Centollo">
                <div id="chatbot-header">
                    <div id="chatbot-header-info">
                        <span id="chatbot-avatar">🦀</span>
                        <div>
                            <h2 id="chatbot-titulo">El Centollo</h2>
                            <p id="chatbot-estado"><span class="punto-en-linea"></span>Asistente virtual</p>
                        </div>
                    </div>
                    <button id="chatbot-cerrar" type="button" aria-label="Cerrar chat">&times;</button>
                </div>

                <div id="chatbot-mensajes" aria-live="polite"></div>

                <form id="chatbot-form" autocomplete="off">
                    <input type="text" id="chatbot-input" placeholder="Escribe tu pregunta..." aria-label="Escribe tu pregunta">
                    <button type="submit" id="chatbot-enviar" aria-label="Enviar pregunta">➤</button>
                </form>
            </div>

            <button id="chatbot-toggle" type="button" aria-label="Abrir asistente virtual" aria-expanded="false">
                <span id="chatbot-toggle-icon">🦀</span>
            </button>
        </div>
    `;

    document.addEventListener('DOMContentLoaded', () => {
        document.body.insertAdjacentHTML('beforeend', markup);

        const toggleBtn = document.getElementById('chatbot-toggle');
        const iconoToggle = document.getElementById('chatbot-toggle-icon');
        const ventana = document.getElementById('chatbot-window');
        const cerrarBtn = document.getElementById('chatbot-cerrar');
        const contenedorMensajes = document.getElementById('chatbot-mensajes');
        const form = document.getElementById('chatbot-form');
        const input = document.getElementById('chatbot-input');
        const globo = document.getElementById('chatbot-globo');

        let iniciado = false;

        function scrollAbajo() {
            contenedorMensajes.scrollTop = contenedorMensajes.scrollHeight;
        }

        function agregarMensaje(html, tipo) {
            const div = document.createElement('div');
            div.className = 'mensaje ' + tipo;
            div.innerHTML = html;
            contenedorMensajes.appendChild(div);
            scrollAbajo();
        }

        function mostrarEscribiendo() {
            const div = document.createElement('div');
            div.className = 'mensaje bot escribiendo';
            div.id = 'chatbot-escribiendo';
            div.innerHTML = '<span class="punto-typing"></span><span class="punto-typing"></span><span class="punto-typing"></span>';
            contenedorMensajes.appendChild(div);
            scrollAbajo();
        }

        function quitarEscribiendo() {
            const el = document.getElementById('chatbot-escribiendo');
            if (el) el.remove();
        }

        function quitarOpciones() {
            const actual = document.getElementById('chatbot-opciones-actual');
            if (actual) actual.remove();
        }

        function mostrarOpciones() {
            quitarOpciones();
            const wrapper = document.createElement('div');
            wrapper.className = 'opciones-wrapper';
            wrapper.id = 'chatbot-opciones-actual';
            PREGUNTAS.forEach(p => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'chip-pregunta';
                btn.textContent = p.pregunta;
                btn.addEventListener('click', () => manejarPreguntaSeleccionada(p));
                wrapper.appendChild(btn);
            });
            contenedorMensajes.appendChild(wrapper);
            scrollAbajo();
        }

        function manejarPreguntaSeleccionada(p) {
            quitarOpciones();
            agregarMensaje(escapeHTML(p.pregunta), 'usuario');
            mostrarEscribiendo();
            setTimeout(() => {
                quitarEscribiendo();
                agregarMensaje(construirHTMLRespuesta(p), 'bot');
                mostrarOpciones();
            }, 550 + Math.random() * 350);
        }

        function iniciarConversacion() {
            if (iniciado) return;
            iniciado = true;
            agregarMensaje(
                '¡Hola! 👋 Soy el asistente virtual de <strong>El Centollo</strong>. Puedo ayudarte con información sobre el menú, horarios, reservas, ubicación y más.<br>Elige una pregunta o escribe la tuya:',
                'bot'
            );
            mostrarOpciones();
        }

        function ocultarGlobo() {
            globo.classList.remove('visible');
        }

        function mostrarGlobo() {
            if (ventana.classList.contains('abierto')) return;
            globo.classList.add('visible');
            setTimeout(ocultarGlobo, 6000);
        }

        function abrirChat() {
            ventana.classList.add('abierto');
            toggleBtn.setAttribute('aria-expanded', 'true');
            iconoToggle.textContent = '✕';
            ocultarGlobo();
            iniciarConversacion();
            setTimeout(() => input.focus(), 280);
        }

        function cerrarChat() {
            ventana.classList.remove('abierto');
            toggleBtn.setAttribute('aria-expanded', 'false');
            iconoToggle.textContent = '🦀';
        }

        toggleBtn.addEventListener('click', () => {
            if (ventana.classList.contains('abierto')) {
                cerrarChat();
            } else {
                abrirChat();
            }
        });

        cerrarBtn.addEventListener('click', cerrarChat);

        globo.addEventListener('click', abrirChat);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const valor = input.value.trim();
            if (!valor) return;

            quitarOpciones();
            agregarMensaje(escapeHTML(valor), 'usuario');
            input.value = '';

            mostrarEscribiendo();
            setTimeout(() => {
                quitarEscribiendo();
                const encontrada = buscarRespuesta(valor);
                if (encontrada) {
                    agregarMensaje(construirHTMLRespuesta(encontrada), 'bot');
                } else {
                    agregarMensaje(
                        'Por ahora no tengo una respuesta exacta para eso 🦀 Pero puedo ayudarte con alguna de estas preguntas, o si prefieres escríbenos directamente al <strong>(57) 316 690 0508</strong>.',
                        'bot'
                    );
                }
                mostrarOpciones();
            }, 550 + Math.random() * 350);
        });

        // Globo de atención: aparece una vez si el usuario no ha abierto el chat
        setTimeout(mostrarGlobo, 2500);
    });

})();
