document.addEventListener('DOMContentLoaded', () => {
    
    // 1. JSON actualizado con identificadores válidos para Prolog y formato WebP
    const especiesJSON = [
      { id: "pez_guppy", nombre: "Pez Guppy", habitat: "Acuático", temperamento: "Pacífico", temp: "22-28°C", ph: "6.8-7.8", espacio: "20 L", tamano: "6 cm", img: "imagenes/pezguppy.webp" },
      { id: "tetra_neon", nombre: "Tetra Neón", habitat: "Acuático", temperamento: "Pacífico", temp: "20-26°C", ph: "5.0-7.0", espacio: "40 L", tamano: "4 cm", img: "imagenes/tetraneon.webp" },
      { id: "corydora", nombre: "Corydora", habitat: "Acuático", temperamento: "Pacífico", temp: "22-26°C", ph: "6.0-7.8", espacio: "60 L", tamano: "7 cm", img: "imagenes/corydora.webp" },
      { id: "camaron_cereza", nombre: "Camarón Cereza", habitat: "Acuático", temperamento: "Pacífico", temp: "18-28°C", ph: "6.5-8.0", espacio: "20 L", tamano: "4 cm", img: "imagenes/camaroncereza.webp" },
      { id: "pez_betta", nombre: "Pez Betta", habitat: "Acuático", temperamento: "Territorial", temp: "24-28°C", ph: "6.0-7.5", espacio: "20 L", tamano: "7 cm", img: "imagenes/pezbetta.webp" },
      { id: "pez_oscar", nombre: "Pez Oscar", habitat: "Acuático", temperamento: "Depredador", temp: "22-28°C", ph: "6.0-7.5", espacio: "400 L", tamano: "35 cm", img: "imagenes/pezoscar.webp" },
      { id: "ciclido_convicto", nombre: "Cíclido Convicto", habitat: "Acuático", temperamento: "Agresivo", temp: "22-28°C", ph: "6.5-8.0", espacio: "150 L", tamano: "15 cm", img: "imagenes/ciclidoconvicto.webp" },
      { id: "pirana_vientre_rojo", nombre: "Piraña Vientre Rojo", habitat: "Acuático", temperamento: "Depredador", temp: "24-28°C", ph: "6.0-7.5", espacio: "400 L", tamano: "30 cm", img: "imagenes/piranavientrerojo.webp" },
      { id: "goldfish", nombre: "Goldfish", habitat: "Acuático", temperamento: "Pacífico", temp: "15-24°C", ph: "6.5-8.0", espacio: "150 L", tamano: "30 cm", img: "imagenes/goldfish.webp" },
      { id: "ajolote", nombre: "Ajolote", habitat: "Acuático", temperamento: "Depredador", temp: "14-20°C", ph: "6.5-8.0", espacio: "150 L", tamano: "30 cm", img: "imagenes/ajolote.webp" },
      { id: "rana_flecha", nombre: "Rana Flecha", habitat: "Terrestre Tropical", temperamento: "Territorial", temp: "22-27°C", ph: "N/A", espacio: "400 cm2", tamano: "5 cm", img: "imagenes/ranaflecha.webp" },
      { id: "rana_ojos_rojos", nombre: "Rana Ojos Rojos", habitat: "Terrestre Tropical", temperamento: "Pacífico", temp: "22-28°C", ph: "N/A", espacio: "1300 cm2", tamano: "7 cm", img: "imagenes/ranaojosrojos.webp" },
      { id: "sapo_vientre_fuego", nombre: "Sapo Vientre Fuego", habitat: "Mixto", temperamento: "Pacífico", temp: "18-24°C", ph: "6.5-7.5", espacio: "40 L y 400 cm2", tamano: "5 cm", img: "imagenes/sapovientrefuego.webp" },
      { id: "salamandra_tigre", nombre: "Salamandra Tigre", habitat: "Mixto", temperamento: "Depredador", temp: "15-22°C", ph: "6.5-7.5", espacio: "75 L y 750 cm2", tamano: "25 cm", img: "imagenes/salamandratigre.webp" },
      { id: "tortuga_orejas_rojas", nombre: "Tortuga Orejas Rojas", habitat: "Mixto", temperamento: "Depredador", temp: "22-28°C", ph: "6.5-8.0", espacio: "300 L y 3000 cm2", tamano: "30 cm", img: "imagenes/tortugaorejasrojas.webp" },
      { id: "iguana_verde", nombre: "Iguana Verde", habitat: "Terrestre Tropical", temperamento: "Pacífico", temp: "24-32°C", ph: "N/A", espacio: "40000 cm2", tamano: "180 cm", img: "imagenes/iguanaverde.webp" },
      { id: "gecko_crestado", nombre: "Gecko Crestado", habitat: "Terrestre Tropical", temperamento: "Pacífico", temp: "22-27°C", ph: "N/A", espacio: "750 cm2", tamano: "20 cm", img: "imagenes/geckocrestado.webp" },
      { id: "camaleon_velo", nombre: "Camaleón Velo", habitat: "Terrestre Tropical", temperamento: "Territorial", temp: "24-29°C", ph: "N/A", espacio: "4500 cm2", tamano: "60 cm", img: "imagenes/camaleonvelo.webp" },
      { id: "anolis_verde", nombre: "Anolis Verde", habitat: "Terrestre Tropical", temperamento: "Territorial", temp: "22-30°C", ph: "N/A", espacio: "750 cm2", tamano: "20 cm", img: "imagenes/anolisverde.webp" },
      { id: "dragon_barbudo", nombre: "Dragón Barbudo", habitat: "Terrestre Desértico", temperamento: "Pacífico", temp: "24-35°C", ph: "N/A", espacio: "4500 cm2", tamano: "55 cm", img: "imagenes/dragonbarbudo.webp" },
      { id: "gecko_leopardo", nombre: "Gecko Leopardo", habitat: "Terrestre Desértico", temperamento: "Pacífico", temp: "24-32°C", ph: "N/A", espacio: "1100 cm2", tamano: "25 cm", img: "imagenes/geckoleopardo.webp" },
      { id: "uromastyx", nombre: "Uromastyx", habitat: "Terrestre Desértico", temperamento: "Pacífico", temp: "27-40°C", ph: "N/A", espacio: "4500 cm2", tamano: "40 cm", img: "imagenes/uromastyx.webp" },
      { id: "serpiente_maiz", nombre: "Serpiente Maíz", habitat: "Terrestre Tropical", temperamento: "Depredador", temp: "22-28°C", ph: "N/A", espacio: "1500 cm2", tamano: "150 cm", img: "imagenes/serpientemaiz.webp" },
      { id: "piton_bola", nombre: "Pitón Bola", habitat: "Terrestre Tropical", temperamento: "Depredador", temp: "25-32°C", ph: "N/A", espacio: "2800 cm2", tamano: "150 cm", img: "imagenes/pitonbola.webp" }
    ];

    // Catálogo indexado por id (se usa para mostrar nombres e imágenes en los monitores de diagnóstico)
    const especiesPorId = new Map(especiesJSON.map(especie => [especie.id, especie]));

    const contenedorModal = document.getElementById('lista-especies-modal');

    especiesJSON.forEach(especie => {
        const fila = document.createElement('div');
        fila.className = 'fila-especie';
        fila.innerHTML = `
            <img src="${especie.img}" alt="${especie.nombre}">
            <div class="info-especie">
                <h3>${especie.nombre}</h3>
                <p><strong>Hábitat:</strong> ${especie.habitat} | <strong>Temperamento:</strong> ${especie.temperamento}</p>
                <p><strong>Parámetros:</strong> Temp: ${especie.temp} | pH: ${especie.ph}</p>
                <p><strong>Espacio mínimo:</strong> ${especie.espacio} | <strong>Tamaño máx:</strong> ${especie.tamano}</p>
            </div>
        `;
        contenedorModal.appendChild(fila);
    });
    
    const cuadricula = document.getElementById('cuadricula');
    cuadricula.innerHTML = ''; 

    especiesJSON.forEach(especie => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-especie';
        tarjeta.dataset.id = especie.id; 
        
        tarjeta.innerHTML = `
            <img src="${especie.img}" alt="${especie.nombre}">
            <span>${especie.nombre}</span>
        `;

        tarjeta.addEventListener('click', () => {
            tarjeta.classList.toggle('seleccionada');
        });

        cuadricula.appendChild(tarjeta);
    });

    const btnEvaluar = document.getElementById('btn-evaluar');
    const inputLitros = document.getElementById('litros');
    const inputArea = document.getElementById('area');
    const valorLitros = document.getElementById('valor-litros');
    const valorArea = document.getElementById('valor-area');
    const campoLitros = document.getElementById('campo-litros');
    const campoArea = document.getElementById('campo-area');
    const etiquetaArea = document.getElementById('etiqueta-area');
    const inputHabitat = document.getElementById('tipo-habitat');
    const msgError = document.querySelector('.burbuja-error');
    const espiralCarga = document.getElementById('cargando');
    const contenedorResultados = document.getElementById('resultados-contenido');
    const estrellaCentro = document.getElementById('estrella-resultado');
    const monitorEspera = document.getElementById('monitor-espera');
    const monitores = document.getElementById('monitores');
    const capaTransicion = document.getElementById('fondo-transicion');

    // =====================================================================
    // FONDOS DINÁMICOS: la clase del <body> cambia según el tipo de ecosistema
    // =====================================================================
    const FONDOS = {
        '': 'fondo-general',
        acuatico: 'fondo-acuatico',
        terrestre_tropical: 'fondo-terrestre-tropical',
        terrestre_desertico: 'fondo-terrestre-desertico',
        mixto: 'fondo-mixto'
    };
    const CLASES_FONDO = Object.values(FONDOS);

    function cambiarFondo(habitat) {
        const nuevaClase = FONDOS[habitat] || 'fondo-general';
        if (document.body.classList.contains(nuevaClase)) return;

        // Un background-image no se puede animar con CSS, así que se copia el fondo actual en
        // una capa fija, se cambia la clase del body y esa capa se desvanece (fundido de 0.5 s).
        const estilo = getComputedStyle(document.body);
        capaTransicion.style.transition = 'none';
        capaTransicion.style.backgroundImage = estilo.backgroundImage;
        capaTransicion.style.backgroundColor = estilo.backgroundColor;
        capaTransicion.style.opacity = '1';

        document.body.classList.remove(...CLASES_FONDO);
        document.body.classList.add(nuevaClase);

        void capaTransicion.offsetWidth; // Fuerza el reflujo para que arranque la transición
        capaTransicion.style.transition = 'opacity 0.5s ease';
        capaTransicion.style.opacity = '0';
    }

    // Cambia el fondo en cuanto el usuario elige una opción del selector
    inputHabitat.addEventListener('change', () => cambiarFondo(inputHabitat.value));

    // =====================================================================
    // DESLIZADORES: el valor en texto se actualiza en tiempo real
    // =====================================================================
    function formatear(numero) {
        return Number(numero).toLocaleString('es-MX');
    }

    function actualizarDeslizador(input, salida, unidad) {
        const minimo = Number(input.min);
        const maximo = Number(input.max);
        const progreso = ((Number(input.value) - minimo) / (maximo - minimo)) * 100;
        input.style.setProperty('--progreso', progreso + '%'); // Relleno de la pista
        salida.textContent = formatear(input.value) + ' ' + unidad;
    }

    inputLitros.addEventListener('input', () => actualizarDeslizador(inputLitros, valorLitros, 'L'));
    inputArea.addEventListener('input', () => actualizarDeslizador(inputArea, valorArea, 'cm²'));

    actualizarDeslizador(inputLitros, valorLitros, 'L');
    actualizarDeslizador(inputArea, valorArea, 'cm²');

    // Muestra los deslizadores de capacidad que corresponden al hábitat elegido:
    // acuático -> litros | terrestre -> cm² | mixto -> litros y cm²
    function actualizarCamposCapacidad() {
        const habitat = inputHabitat.value;

        if (habitat === 'terrestre_tropical' || habitat === 'terrestre_desertico') {
            campoLitros.style.display = 'none';
            campoArea.style.display = 'flex';
            etiquetaArea.textContent = 'Área del terrario';
        } else if (habitat === 'mixto') {
            campoLitros.style.display = 'flex';
            campoArea.style.display = 'flex';
            etiquetaArea.textContent = 'Área de tierra';
        } else {
            // Acuático o sin selección: solo litros
            campoLitros.style.display = 'flex';
            campoArea.style.display = 'none';
        }
    }

    inputHabitat.addEventListener('change', actualizarCamposCapacidad);

    // =====================================================================
    // PANEL DE RESULTADOS: monitores de diagnóstico de laboratorio
    // =====================================================================
    const NOMBRES_HABITAT = {
        acuatico: 'Acuático',
        terrestre_tropical: 'Terrestre tropical',
        terrestre_desertico: 'Terrestre desértico',
        mixto: 'Mixto (paludario)'
    };

    // Mensajes que devuelve el motor de Prolog -> etiqueta, código y texto para mostrar
    const TIPOS_CONFLICTO = {
        'Riesgo de depredacion': { codigo: 'DEP', etiqueta: 'Depredación', texto: 'Riesgo de depredación' },
        'Conflicto por agresion o territorialidad': { codigo: 'AGR', etiqueta: 'Agresión / territorio', texto: 'Conflicto por agresión o territorialidad' },
        'Incompatibilidad de temperatura': { codigo: 'TMP', etiqueta: 'Temperatura', texto: 'Incompatibilidad de temperatura' },
        'Incompatibilidad de pH o humedad': { codigo: 'QUI', etiqueta: 'Químico', texto: 'Incompatibilidad de pH o humedad' },
        'Especie incompatible con el tipo de tanque': { codigo: 'HAB', etiqueta: 'Hábitat', texto: 'Especie incompatible con el tipo de tanque' },
        'Falta de espacio (Hacinamiento)': { codigo: 'ESP', etiqueta: 'Espacio', texto: 'Falta de espacio (hacinamiento)' }
    };

    let numeroDiagnostico = 0;

    function crearElemento(etiqueta, clase, texto) {
        const elemento = document.createElement(etiqueta);
        if (clase) elemento.className = clase;
        if (texto !== undefined) elemento.textContent = texto;
        return elemento;
    }

    // Trazo tipo electrocardiograma (el SVG se arma con texto fijo, nunca con datos del servidor)
    function crearTrazo(tipo) {
        const rutas = {
            ok: 'M0 20 L34 20 L40 20 L46 6 L54 34 L60 20 L100 20 L106 20 L112 12 L118 20 L160 20 L166 20 L172 4 L180 36 L186 20 L200 20',
            alerta: 'M0 20 L14 20 L20 8 L26 32 L32 4 L40 36 L48 14 L56 28 L64 20 L88 20 L94 6 L100 34 L108 10 L116 30 L124 20 L150 20 L156 2 L164 38 L172 12 L180 28 L188 20 L200 20'
        };
        const ns = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(ns, 'svg');
        svg.setAttribute('viewBox', '0 0 200 40');
        svg.setAttribute('preserveAspectRatio', 'none');
        svg.setAttribute('class', 'trazo trazo-' + tipo);
        svg.setAttribute('aria-hidden', 'true');
        const ruta = document.createElementNS(ns, 'path');
        ruta.setAttribute('d', rutas[tipo]);
        ruta.setAttribute('pathLength', '100');
        svg.appendChild(ruta);
        return svg;
    }

    function crearBarra(titulo, codigo) {
        const barra = crearElemento('div', 'monitor-barra');
        barra.appendChild(crearElemento('span', 'led'));
        barra.appendChild(crearElemento('span', 'monitor-titulo', titulo));
        barra.appendChild(crearElemento('span', 'monitor-codigo', codigo));
        return barra;
    }

    function crearLecturas(pares) {
        const lista = crearElemento('dl', 'lecturas');
        pares.forEach(([nombre, valor]) => {
            const fila = crearElemento('div', 'lectura');
            fila.appendChild(crearElemento('dt', null, nombre));
            fila.appendChild(crearElemento('dd', null, valor));
            lista.appendChild(fila);
        });
        return lista;
    }

    // Las especies involucradas pueden llegar como lista (["pez_oscar", "pez_guppy"])
    // o como texto ("involucrados(pez_oscar,pez_guppy)")
    function normalizarInvolucrados(involucrados) {
        if (Array.isArray(involucrados)) return involucrados.map(String);
        if (typeof involucrados === 'string') {
            return (involucrados.match(/[a-z0-9_]+/g) || []).filter(id => id !== 'involucrados');
        }
        return [];
    }

    function crearMuestras(ids) {
        const contenedor = crearElemento('div', 'muestras');
        ids.forEach(id => {
            const chip = crearElemento('span', 'muestra');
            const especie = especiesPorId.get(id);
            if (id === 'todos') {
                chip.textContent = 'Todas las especies';
            } else if (especie) {
                const imagen = document.createElement('img');
                imagen.src = especie.img;
                imagen.alt = '';
                chip.appendChild(imagen);
                chip.appendChild(crearElemento('span', null, especie.nombre));
            } else {
                chip.textContent = id;
            }
            contenedor.appendChild(chip);
        });
        return contenedor;
    }

    function textoCapacidad(contexto) {
        if (contexto.habitat === 'acuatico') return formatear(contexto.litros) + ' L';
        if (contexto.habitat === 'mixto') return formatear(contexto.litros) + ' L · ' + formatear(contexto.area) + ' cm²';
        return formatear(contexto.area) + ' cm²';
    }

    // Dibuja el monitor principal (veredicto) y un monitor de alerta por cada conflicto
    function mostrarResultados(data, contexto) {
        monitores.replaceChildren();
        monitorEspera.style.display = 'none';

        const conflictos = Array.isArray(data.conflictos) ? data.conflictos : [];
        const viable = Boolean(data.viable);
        numeroDiagnostico += 1;

        // Monitor principal: veredicto del diagnóstico
        const principal = crearElemento('div', 'monitor ' + (viable ? 'monitor-ok' : 'monitor-alerta'));
        principal.appendChild(crearBarra('Bio-Scan · Diagnóstico', 'DX-' + String(numeroDiagnostico).padStart(4, '0')));
        const cuerpo = crearElemento('div', 'monitor-cuerpo');
        cuerpo.appendChild(crearElemento('div', 'monitor-estado', viable ? 'Ecosistema estable' : 'Ecosistema no viable'));
        cuerpo.appendChild(crearTrazo(viable ? 'ok' : 'alerta'));
        cuerpo.appendChild(crearLecturas([
            ['Hábitat', NOMBRES_HABITAT[contexto.habitat] || contexto.habitat],
            ['Capacidad', textoCapacidad(contexto)],
            ['Especies', String(contexto.especies.length)],
            ['Conflictos', String(conflictos.length)]
        ]));
        cuerpo.appendChild(crearMuestras(contexto.especies));
        principal.appendChild(cuerpo);
        monitores.appendChild(principal);

        // Un monitor de alerta por cada conflicto
        conflictos.forEach((conflicto, indice) => {
            const mensaje = conflicto && conflicto.mensaje ? String(conflicto.mensaje) : 'Conflicto detectado';
            const tipo = TIPOS_CONFLICTO[mensaje] || { codigo: 'ERR', etiqueta: 'Conflicto', texto: mensaje };

            const tarjeta = crearElemento('div', 'monitor monitor-alerta');
            tarjeta.style.setProperty('--retraso', (0.15 * (indice + 1)) + 's');
            tarjeta.appendChild(crearBarra('Alerta · ' + tipo.etiqueta, tipo.codigo + '-' + String(indice + 1).padStart(2, '0')));

            const cuerpoAlerta = crearElemento('div', 'monitor-cuerpo');
            cuerpoAlerta.appendChild(crearElemento('div', 'monitor-estado', tipo.texto));
            cuerpoAlerta.appendChild(crearTrazo('alerta'));
            cuerpoAlerta.appendChild(crearMuestras(normalizarInvolucrados(conflicto && conflicto.involucrados)));
            tarjeta.appendChild(cuerpoAlerta);
            monitores.appendChild(tarjeta);
        });
    }

    // Reinicia una animación CSS (para que el mensaje central vuelva a aparecer en cada evaluación)
    function reiniciarAnimacion(elemento) {
        elemento.style.animation = 'none';
        void elemento.offsetWidth;
        elemento.style.animation = '';
    }

    // =====================================================================
    // EVALUAR
    // =====================================================================
    btnEvaluar.addEventListener('click', () => {
        const habitat = inputHabitat.value;
        const litros = parseInt(inputLitros.value);
        const area = parseInt(inputArea.value);
        
        const tarjetasActivas = document.querySelectorAll('.tarjeta-especie.seleccionada');
        const especiesSeleccionadas = Array.from(tarjetasActivas).map(tarjeta => tarjeta.dataset.id);

        // Qué datos de capacidad exige cada tipo de ecosistema
        const necesitaLitros = (habitat === 'acuatico' || habitat === 'mixto');
        const necesitaArea = (habitat === 'terrestre_tropical' || habitat === 'terrestre_desertico' || habitat === 'mixto');

        if (!habitat) {
            msgError.textContent = "Por favor, selecciona el tipo de ecosistema.";
            msgError.style.display = 'block';
            return;
        }
        if (necesitaLitros && !(litros > 0)) {
            msgError.textContent = "Por favor, ingresa una cantidad válida de litros.";
            msgError.style.display = 'block';
            return;
        }
        if (necesitaArea && !(area > 0)) {
            msgError.textContent = "Por favor, ingresa un área válida en cm².";
            msgError.style.display = 'block';
            return;
        }
        if (especiesSeleccionadas.length < 2) {
            msgError.textContent = "Selecciona al menos dos especies para evaluar la compatibilidad.";
            msgError.style.display = 'block';
            return;
        }

        msgError.style.display = 'none';
        
        // Capacidad en el formato que espera el servidor (servidor.py -> construir_tanque):
        // acuático -> número (litros) | terrestre -> número (cm²) | mixto -> objeto {litros, area}
        let capacidad;
        if (habitat === 'acuatico') {
            capacidad = litros;
        } else if (habitat === 'mixto') {
            capacidad = { litros: litros, area: area };
        } else {
            capacidad = area;
        }

        // 2. Estructura JSON que exige el servidor
        const datosConsulta = {
            especies: especiesSeleccionadas,
            tanque_tipo: habitat,
            tanque_capacidad: capacidad
        };

        if(espiralCarga) espiralCarga.style.display = 'block';

        // 3. Conexión HTTP hacia la API en Render (la URL se configura en config.js)
        fetch(CONFIG.API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosConsulta)
        })
        .then(response => {
            // Si el servidor responde con un error (400/500), se trata como fallo de conexión
            if (!response.ok) throw new Error('Respuesta ' + response.status);
            return response.json();
        })
        .then(data => {
            if(espiralCarga) espiralCarga.style.display = 'none';
            contenedorResultados.style.display = 'block';
            
            // Mostrar la estrella central (empieza oculta con display: none en el HTML)
            estrellaCentro.style.display = 'block';
            reiniciarAnimacion(estrellaCentro);
            
            if(data.viable) {
                estrellaCentro.textContent = "Ecosistema Viable";
                estrellaCentro.style.color = "#34d399";
            } else {
                estrellaCentro.textContent = "Conflictos Encontrados";
                estrellaCentro.style.color = "#ff4d6d";
            }

            // Monitores de diagnóstico en el panel de Resultados (solo dibuja; no toca la petición)
            mostrarResultados(data, { habitat, litros, area, especies: especiesSeleccionadas });
        })
        .catch(error => {
            if(espiralCarga) espiralCarga.style.display = 'none';
            msgError.textContent = "Error de conexión con el servidor. Verifica que Render esté activo.";
            msgError.style.display = 'block';
        });
    });

    const btnLimpiar = document.getElementById('btn-limpiar');

    btnLimpiar.addEventListener('click', () => {
        inputHabitat.value = '';
        inputLitros.value = inputLitros.defaultValue;
        inputArea.value = inputArea.defaultValue;
        actualizarDeslizador(inputLitros, valorLitros, 'L');
        actualizarDeslizador(inputArea, valorArea, 'cm²');
        actualizarCamposCapacidad(); // Vuelve a mostrar solo el deslizador de litros
        cambiarFondo('');            // Vuelve al fondo general

        const tarjetasActivas = document.querySelectorAll('.tarjeta-especie.seleccionada');
        tarjetasActivas.forEach(tarjeta => {
            tarjeta.classList.remove('seleccionada');
        });

        msgError.style.display = 'none';
        contenedorResultados.style.display = 'none';
        monitores.replaceChildren();
        monitorEspera.style.display = 'block';
        if(estrellaCentro) estrellaCentro.style.display = 'none';
    });

    // =====================================================================
    // MENÚ FLOTANTE: el interruptor del título lo despliega y lo oculta
    // =====================================================================
    const btnMenu = document.getElementById('btn-menu');
    const menuFlotante = document.getElementById('menu-flotante');

    function alternarMenu(abrir) {
        const mostrar = (typeof abrir === 'boolean') ? abrir : !menuFlotante.classList.contains('abierto');
        menuFlotante.classList.toggle('abierto', mostrar);
        btnMenu.setAttribute('aria-expanded', String(mostrar));
        btnMenu.setAttribute('aria-label', mostrar ? 'Ocultar menú' : 'Mostrar menú');
    }

    btnMenu.addEventListener('click', () => alternarMenu());

    // El menú se cierra al elegir una opción, al hacer clic fuera de él o con la tecla Escape
    menuFlotante.querySelectorAll('a').forEach(enlace => {
        enlace.addEventListener('click', () => alternarMenu(false));
    });
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.bloque-titulo')) alternarMenu(false);
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') alternarMenu(false);
    });

    const btnEspecies = document.getElementById('link-especies');
    const btnManual = document.getElementById('link-manual');
    const modalEspecies = document.getElementById('modal-especies');
    const modalManual = document.getElementById('modal-manual');
    const btnCerrarEspecies = document.getElementById('cerrar-especies');
    const btnCerrarManual = document.getElementById('cerrar-manual');

    btnEspecies.addEventListener('click', (e) => {
        e.preventDefault();
        modalEspecies.style.display = 'flex';
    });

    btnManual.addEventListener('click', (e) => {
        e.preventDefault();
        modalManual.style.display = 'flex';
    });

    btnCerrarEspecies.addEventListener('click', () => {
        modalEspecies.style.display = 'none';
    });

    btnCerrarManual.addEventListener('click', () => {
        modalManual.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modalEspecies) modalEspecies.style.display = 'none';
        if (e.target === modalManual) modalManual.style.display = 'none';
    });
});