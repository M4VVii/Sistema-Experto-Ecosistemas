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
    const campoLitros = document.getElementById('campo-litros');
    const campoArea = document.getElementById('campo-area');
    const etiquetaArea = document.getElementById('etiqueta-area');
    const inputHabitat = document.getElementById('tipo-habitat');
    const msgError = document.querySelector('.burbuja-error');
    const espiralCarga = document.getElementById('cargando');
    const contenedorResultados = document.getElementById('resultados-contenido');
    const estrellaCentro = document.getElementById('estrella-resultado');

    // Muestra los campos de capacidad que corresponden al hábitat elegido:
    // acuático -> litros | terrestre -> cm² | mixto -> litros y cm²
    function actualizarCamposCapacidad() {
        const habitat = inputHabitat.value;

        if (habitat === 'terrestre_tropical' || habitat === 'terrestre_desertico') {
            campoLitros.style.display = 'none';
            campoArea.style.display = 'block';
            etiquetaArea.textContent = 'Área del terrario (cm²):';
            inputArea.placeholder = 'Ej. 4500';
        } else if (habitat === 'mixto') {
            campoLitros.style.display = 'block';
            campoArea.style.display = 'block';
            etiquetaArea.textContent = 'Área de tierra (cm²):';
            inputArea.placeholder = 'Ej. 2000';
        } else {
            // Acuático o sin selección: solo litros
            campoLitros.style.display = 'block';
            campoArea.style.display = 'none';
        }
    }

    inputHabitat.addEventListener('change', actualizarCamposCapacidad);

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
        
        // Capacidad en el formato que espera servidor.pl (construir_capacidad/3):
        // acuático -> número (litros) | terrestre -> número (cm²) | mixto -> objeto {litros, area}
        let capacidad;
        if (habitat === 'acuatico') {
            capacidad = litros;
        } else if (habitat === 'mixto') {
            capacidad = { litros: litros, area: area };
        } else {
            capacidad = area;
        }

        // 2. Estructura JSON mapeada a lo que exige servidor.pl
        const datosConsulta = {
            especies: especiesSeleccionadas,
            tanque_tipo: habitat,
            tanque_capacidad: capacidad
        };

        if(espiralCarga) espiralCarga.style.display = 'block';

        // 3. Conexión HTTP hacia la API de Prolog en Render (la URL se configura en config.js)
        fetch(CONFIG.API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosConsulta)
        })
        .then(response => response.json())
        .then(data => {
            if(espiralCarga) espiralCarga.style.display = 'none';
            contenedorResultados.style.display = 'block';
            
            // Mostrar la estrella central (empieza oculta con display: none en el HTML)
            estrellaCentro.style.display = 'block';
            
            if(data.viable) {
                estrellaCentro.textContent = "Ecosistema Viable";
                estrellaCentro.style.color = "#4CAF50";
            } else {
                estrellaCentro.textContent = "Conflictos Encontrados";
                estrellaCentro.style.color = "#F44336";
                // Aquí Nina puede mapear 'data.conflictos' para listarlos en el HTML
                console.log(data.conflictos); 
            }
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
        inputLitros.value = '';
        inputArea.value = '';
        actualizarCamposCapacidad(); // Vuelve a mostrar solo el campo de litros

        const tarjetasActivas = document.querySelectorAll('.tarjeta-especie.seleccionada');
        tarjetasActivas.forEach(tarjeta => {
            tarjeta.classList.remove('seleccionada');
        });

        msgError.style.display = 'none';
        contenedorResultados.style.display = 'none';
        if(estrellaCentro) estrellaCentro.style.display = 'none';
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