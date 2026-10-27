document.addEventListener('DOMContentLoaded', () => {
    
    const especiesJSON = [
  { nombre: "Pez Guppy", habitat: "Acuático", temperamento: "Pacífico", temp: "22-28°C", ph: "6.8-7.8", espacio: "20 L", tamano: "6 cm", img: "imagenes/pezguppy.jpg" },
  { nombre: "Tetra Neón", habitat: "Acuático", temperamento: "Pacífico", temp: "20-26°C", ph: "5.0-7.0", espacio: "40 L", tamano: "4 cm", img: "imagenes/tetraneon.jpg" },
  { nombre: "Corydora", habitat: "Acuático", temperamento: "Pacífico", temp: "22-26°C", ph: "6.0-7.8", espacio: "60 L", tamano: "7 cm", img: "imagenes/corydora.jpg" },
  { nombre: "Camarón Cereza", habitat: "Acuático", temperamento: "Pacífico", temp: "18-28°C", ph: "6.5-8.0", espacio: "20 L", tamano: "4 cm", img: "imagenes/camaroncereza.jpg" },
  { nombre: "Pez Betta", habitat: "Acuático", temperamento: "Territorial", temp: "24-28°C", ph: "6.0-7.5", espacio: "20 L", tamano: "7 cm", img: "imagenes/pezbetta.jpg" },
  { nombre: "Pez Oscar", habitat: "Acuático", temperamento: "Depredador", temp: "22-28°C", ph: "6.0-7.5", espacio: "400 L", tamano: "35 cm", img: "imagenes/pezoscar.jpg" },
  { nombre: "Cíclido Convicto", habitat: "Acuático", temperamento: "Agresivo", temp: "22-28°C", ph: "6.5-8.0", espacio: "150 L", tamano: "15 cm", img: "imagenes/ciclidoconvicto.jpg" },
  { nombre: "Piraña Vientre Rojo", habitat: "Acuático", temperamento: "Depredador", temp: "24-28°C", ph: "6.0-7.5", espacio: "400 L", tamano: "30 cm", img: "imagenes/piranavientrerojo.jpg" },
  { nombre: "Goldfish", habitat: "Acuático", temperamento: "Pacífico", temp: "15-24°C", ph: "6.5-8.0", espacio: "150 L", tamano: "30 cm", img: "imagenes/goldfish.jpg" },
  { nombre: "Ajolote", habitat: "Acuático", temperamento: "Depredador", temp: "14-20°C", ph: "6.5-8.0", espacio: "150 L", tamano: "30 cm", img: "imagenes/ajolote.jpg" },
  { nombre: "Rana Flecha", habitat: "Terrestre Tropical", temperamento: "Territorial", temp: "22-27°C", ph: "N/A", espacio: "400 cm2", tamano: "5 cm", img: "imagenes/ranaflecha.jpg" },
  { nombre: "Rana Ojos Rojos", habitat: "Terrestre Tropical", temperamento: "Pacífico", temp: "22-28°C", ph: "N/A", espacio: "1300 cm2", tamano: "7 cm", img: "imagenes/ranaojosrojos.jpg" },
  { nombre: "Sapo Vientre Fuego", habitat: "Mixto", temperamento: "Pacífico", temp: "18-24°C", ph: "6.5-7.5", espacio: "40 L y 400 cm2", tamano: "5 cm", img: "imagenes/sapovientrefuego.jpg" },
  { nombre: "Salamandra Tigre", habitat: "Mixto", temperamento: "Depredador", temp: "15-22°C", ph: "6.5-7.5", espacio: "75 L y 750 cm2", tamano: "25 cm", img: "imagenes/salamandratigre.jpg" },
  { nombre: "Tortuga Orejas Rojas", habitat: "Mixto", temperamento: "Depredador", temp: "22-28°C", ph: "6.5-8.0", espacio: "300 L y 3000 cm2", tamano: "30 cm", img: "imagenes/tortugaorejasrojas.jpg" },
  { nombre: "Iguana Verde", habitat: "Terrestre Tropical", temperamento: "Pacífico", temp: "24-32°C", ph: "N/A", espacio: "40000 cm2", tamano: "180 cm", img: "imagenes/iguanaverde.jpg" },
  { nombre: "Gecko Crestado", habitat: "Terrestre Tropical", temperamento: "Pacífico", temp: "22-27°C", ph: "N/A", espacio: "750 cm2", tamano: "20 cm", img: "imagenes/geckocrestado.jpg" },
  { nombre: "Camaleón Velo", habitat: "Terrestre Tropical", temperamento: "Territorial", temp: "24-29°C", ph: "N/A", espacio: "4500 cm2", tamano: "60 cm", img: "imagenes/camaleonvelo.jpg" },
  { nombre: "Anolis Verde", habitat: "Terrestre Tropical", temperamento: "Territorial", temp: "22-30°C", ph: "N/A", espacio: "750 cm2", tamano: "20 cm", img: "imagenes/anolisverde.jpg" },
  { nombre: "Dragón Barbudo", habitat: "Terrestre Desértico", temperamento: "Pacífico", temp: "24-35°C", ph: "N/A", espacio: "4500 cm2", tamano: "55 cm", img: "imagenes/dragonbarbudo.jpg" },
  { nombre: "Gecko Leopardo", habitat: "Terrestre Desértico", temperamento: "Pacífico", temp: "24-32°C", ph: "N/A", espacio: "1100 cm2", tamano: "25 cm", img: "imagenes/geckoleopardo.jpg" },
  { nombre: "Uromastyx", habitat: "Terrestre Desértico", temperamento: "Pacífico", temp: "27-40°C", ph: "N/A", espacio: "4500 cm2", tamano: "40 cm", img: "imagenes/uromastyx.jpg" },
  { nombre: "Serpiente Maíz", habitat: "Terrestre Tropical", temperamento: "Depredador", temp: "22-28°C", ph: "N/A", espacio: "1500 cm2", tamano: "150 cm", img: "imagenes/serpientemaiz.jpg" },
  { nombre: "Pitón Bola", habitat: "Terrestre Tropical", temperamento: "Depredador", temp: "25-32°C", ph: "N/A", espacio: "2800 cm2", tamano: "150 cm", img: "imagenes/pitonbola.jpg" }

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
    
    // --- 1. CARGA DINÁMICA DE LA CUADRÍCULA (USANDO EL JSON TEMPORAL) ---
    const cuadricula = document.getElementById('cuadricula');
    cuadricula.innerHTML = ''; // Limpiamos la cuadrícula

    especiesJSON.forEach(especie => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-especie';
        tarjeta.dataset.id = especie.nombre; // Usamos el nombre como identificador
        
        tarjeta.innerHTML = `
            <img src="${especie.img}" alt="${especie.nombre}">
            <span>${especie.nombre}</span>
        `;

        // Activamos el destello al hacer clic
        tarjeta.addEventListener('click', () => {
            tarjeta.classList.toggle('seleccionada');
        });

        cuadricula.appendChild(tarjeta);
    });

    // --- 2. LÓGICA DEL BOTÓN EVALUAR ---
    const btnEvaluar = document.getElementById('btn-evaluar');
    const inputLitros = document.getElementById('litros');
    const inputHabitat = document.getElementById('tipo-habitat');
    const msgError = document.querySelector('.burbuja-error');
    const espiralCarga = document.getElementById('cargando');
    const contenedorResultados = document.getElementById('resultados-contenido');
    const estrellaCentro = document.getElementById('estrella-resultado');


    btnEvaluar.addEventListener('click', () => {
        const habitat = inputHabitat.value;
        const litros = inputLitros.value;
        
        // Recolectar solo las tarjetas que tienen la luz encendida
        const tarjetasActivas = document.querySelectorAll('.tarjeta-especie.seleccionada');
        
        // Extraer los nombres de las especies seleccionadas
        const especiesSeleccionadas = Array.from(tarjetasActivas).map(tarjeta => tarjeta.dataset.id);

        // Validaciones en orden
        if (!habitat) {
            msgError.textContent = "Por favor, selecciona el tipo de ecosistema.";
            msgError.style.display = 'block';
            return;
        }
        if (!litros || litros <= 0) {
            msgError.textContent = "Por favor, ingresa una cantidad válida de litros.";
            msgError.style.display = 'block';
            return;
        }
        if (especiesSeleccionadas.length < 2) {
            msgError.textContent = "Selecciona al menos dos especies para evaluar la compatibilidad.";
            msgError.style.display = 'block';
            return;
        }

        msgError.style.display = 'none';

        // Armar la estructura del JSON para Prolog
        const datosConsulta = {
            ecosistema: habitat,
            volumen_litros: parseInt(litros),
            especies: especiesSeleccionadas
        };

        // Imprimir el resultado temporalmente en la consola del navegador
        console.log("JSON listo para enviar a Prolog:", JSON.stringify(datosConsulta, null, 2));
        
        // Aquí conectaremos el fetch hacia Render más adelante
    });

    // --- 3. LÓGICA DEL BOTÓN NUEVA CONSULTA ---
    const btnLimpiar = document.getElementById('btn-limpiar');

    btnLimpiar.addEventListener('click', () => {

        inputHabitat.value = '';
        // 1. Limpiar los litros de agua
        inputLitros.value = '';

        // 2. Quitar el brillo de todas las tarjetas seleccionadas
        const tarjetasActivas = document.querySelectorAll('.tarjeta-especie.seleccionada');
        tarjetasActivas.forEach(tarjeta => {
            tarjeta.classList.remove('seleccionada');
        });

        // 3. Ocultar los mensajes, animaciones y resultados
        msgError.style.display = 'none';
        contenedorResultados.style.display = 'none';
        estrellaCentro.style.display = 'none';
    });

    // ... (Aquí termina el código del botón Nueva Consulta) ...

    // --- 4. LÓGICA DE LAS VENTANAS MODALES ---
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