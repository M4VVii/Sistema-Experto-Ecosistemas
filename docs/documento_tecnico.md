<div align="center">
  <table>
    <tr>
      <td align="center" valign="middle">
        <img src="../logos/ipn.webp" alt="Logo IPN" width="100">
      </td>
      <td align="center" valign="middle">
        <strong>INSTITUTO POLITÉCNICO NACIONAL</strong><br>
        <strong>ESCUELA SUPERIOR DE CÓMPUTO</strong><br><br>
        Ingeniería en Inteligencia Artificial<br>
        Grupo: 3BM2 &nbsp;|&nbsp; Semestre: 2027-1<br>
        Docente: Morales Rodriguez Ursula Samantha
      </td>
      <td align="center" valign="middle">
        <img src="../logos/escom.webp" alt="Logo ESCOM" width="140">
      </td>
    </tr>
  </table>
</div>

<div align="justify">

## 1. Introducción
El "Arquitecto de Ecosistemas" es un sistema experto desarrollado bajo el paradigma lógico utilizando SWI-Prolog. Su objetivo principal es evaluar la viabilidad de un ecosistema en un acuario, un terrario o un paludario, analizando la compatibilidad entre múltiples especies y las características del entorno. El sistema detecta conflictos territoriales y de agresión, de depredación, térmicos, químicos (pH y humedad), de hábitat y de hacinamiento, y emite un diagnóstico que enumera cada conflicto encontrado y las especies involucradas.

La base de conocimientos contiene 24 especies (peces, invertebrados, anfibios y reptiles). El usuario elige el tipo de hábitat, indica la capacidad del recinto, selecciona al menos dos especies y recibe el veredicto del motor de inferencia.

Toda la lógica de decisión (hechos, reglas y diagnóstico) reside en Prolog. El resto del sistema (servidor web, contenedor e interfaz) existe para hacer accesible ese motor desde un navegador y desde la nube.

## 2. Arquitectura General del Sistema
El proyecto sigue una arquitectura cliente-servidor contenerizada, compuesta por cuatro piezas:

- **Motor de inferencia (SWI-Prolog):** Base de conocimientos, reglas de conflicto y orquestador de diagnóstico (`hechos.pl`, `reglas.pl` y `consultas.pl`).
- **Puente Prolog (`evaluar.pl`):** Predicado que recibe una evaluación, invoca al orquestador e imprime el resultado como JSON.
- **API REST (Python, Flask):** Servidor web (`servidor.py`) que recibe las peticiones HTTP, valida los datos, ejecuta el motor de Prolog y responde con un JSON. Se publica en producción con `gunicorn`.
- **Frontend:** Cliente web estático (HTML, CSS y JavaScript) que consume la API mediante `fetch`.
- **Despliegue:** Backend empaquetado con Docker y desplegado como un Web Service en la plataforma Render.

El servidor en Python se encarga únicamente del protocolo HTTP (CORS, validación de entrada, manejo de errores y serialización), no contiene ninguna regla del dominio. Cualquier cambio en el comportamiento del sistema experto se realiza en los archivos de Prolog.

**Flujo de una evaluación:**

```
 Navegador (frontend/index.html + frontend/app.js)
        │  POST /api/evaluar   (JSON: especies, tanque_tipo, tanque_capacidad)
        ▼
 servidor.py (Flask)  ── valida la entrada y arma el término tanque(Tipo, Capacidad)
        │  subprocess: swipl -q -g "evaluar_json([...], tanque(...))" -t halt evaluar.pl
        ▼
 evaluar.pl  ── comprueba que las especies existan y llama al orquestador
        │
        ▼
 consultas.pl ── diagnostico/3 y ecosistema_viable/2
        │              │
        │              ▼
        │         reglas.pl  ──►  hechos.pl (24 especies)
        ▼
 evaluar.pl imprime el JSON  ──►  servidor.py lo lee y lo devuelve al navegador
        │
        ▼
 JSON: { "viable": true|false, "conflictos": [...] }
        │
        ▼
 Navegador (mensaje central + monitores de diagnóstico)
```

### 2.1. Estructura del repositorio

```text
📦 arquitecto-ecosistemas
 ┣ 📂 backend/
 ┃ ┣ 📂 conocimiento/
 ┃ ┃ ┣ 📜 hechos.pl          # Base de conocimientos (24 especies, parámetros)
 ┃ ┃ ┣ 📜 reglas.pl          # Reglas lógicas de compatibilidad e inferencia
 ┃ ┃ ┗ 📜 consultas.pl       # Orquestador y diagnóstico (diagnostico/3)
 ┃ ┣ 📜 .dockerignore        # Exclusiones para el contenedor
 ┃ ┣ 📜 Dockerfile           # Contenedor para despliegue (Python + SWI-Prolog)
 ┃ ┣ 📜 evaluar.pl           # Puente Prolog → JSON
 ┃ ┣ 📜 requirements.txt     # Dependencias de Python
 ┃ ┗ 📜 servidor.py          # API REST (Flask + Gunicorn)
 ┣ 📂 frontend/
 ┃ ┣ 📂 imagenes/            # Recursos visuales (.webp/.jpg)
 ┃ ┣ 📜 index.html           # Interfaz de usuario
 ┃ ┣ 📜 styles.css           # Estilos de la interfaz
 ┃ ┣ 📜 app.js               # Lógica de cliente y Fetch API
 ┃ ┗ 📜 config.js            # Variables de entorno y URL del servidor
 ┣ 📂 docs/
 ┃ ┣ 📂 evidencias/          # Capturas de ejecución (Prolog, API y Web)
 ┃ ┣ 📜 casos_de_prueba.md   # Pruebas documentadas
 ┃ ┣ 📜 documento_tecnico.md # Entregable escrito
 ┃ ┗ 📜 presentacion.pdf     # Diapositivas de exposición
 ┣ 📂 logos/                 # Logos institucionales (IPN, ESCOM)
 ┣ 📜 LICENSE                # Licencia MIT del proyecto
 ┣ 📜 .gitignore             # Exclusión de archivos basura
 ┗ 📜 README.md              # Documentación principal
```

### 2.2. Tecnologías

| Componente | Tecnología | Detalle |
|---|---|---|
| Motor lógico | SWI-Prolog | Instalado vía `apt` en el contenedor, mismo motor usado en desarrollo. |
| API | Python 3.11 + Flask | Con `flask-cors` para CORS. |
| Servidor de producción | gunicorn | 2 procesos de trabajo y tiempo máximo de 30 s por petición. |
| Contenedor | Docker | Imagen basada en `python:3.11-slim` con SWI-Prolog instalado vía `apt`. |
| Nube | Render | Web Service (Docker) para el backend y Static Site para el frontend. |
| Frontend | HTML, CSS y JavaScript | Sin frameworks ni herramientas de compilación. |
| Tipografías | Google Fonts | Abril Fatface, Orbitron, Share Tech Mono y Poppins. |

## 3. Base de Conocimientos y Motor de Inferencia (Backend)
El sistema lógico está dividido en tres módulos principales para garantizar la separación de responsabilidades y la escalabilidad del código. La cadena de carga es `consultas.pl` → `reglas.pl` → `hechos.pl`, mediante `ensure_loaded/1`.

### 3.1. `hechos.pl` (Diccionario Biológico)
El motor de inferencia se alimenta de una base de datos lógica estructurada mediante el functor `especie/12`, el cual normaliza los requerimientos biológicos y físicos de cada animal en el ecosistema.

La firma de los hechos está diseñada de la siguiente manera:

`especie(id_nombre, clase, tipo_habitat, temp_min, temp_max, ph_min, ph_max, humedad_min, humedad_max, requerimiento_espacio, tamano_max_cm, temperamento).`

**Dominios y variables clave:**
* **clase:** `pez`, `invertebrado`, `anfibio` o `reptil`. La interfaz la usa para organizar las especies en pestañas.
* **tipo_habitat:** El sistema clasifica el entorno en cuatro categorías estrictas: `acuatico`, `terrestre_tropical`, `terrestre_desertico` y `mixto`.
* **Rangos de tolerancia (físico-químicos):** Las variables de temperatura (°C), pH y humedad (%) utilizan límites mínimos y máximos para permitir que `reglas.pl` calcule las intersecciones de compatibilidad mediante operadores relacionales.
* **Valores nulos:** Los parámetros que no aplican a una especie (por ejemplo, el pH en un reptil terrestre o la humedad en un pez) se representan con el átomo `na`, y las reglas los ignoran.
* **Espacio:** El `requerimiento_espacio` se expresa con functores que unifican las unidades según el hábitat: `litros(L)` para especies acuáticas, `cm2(A)` para terrestres y `litros_y_cm2(L, A)` para especies mixtas.
* **Comportamiento:** El `tamano_max_cm` y el `temperamento` (`pacifico`, `territorial`, `agresivo` o `depredador`) definen los cruces lógicos de agresión y depredación.

El catálogo completo de las 24 especies se encuentra en el Anexo A.

### 3.2. `reglas.pl` (Reglas de Conflicto)
Contiene la lógica matemática y biológica para cruzar las variables. Se programaron predicados que calculan intersecciones de rangos y validan compatibilidad.

**Abstracción por accesores:** Los predicados `temperamento/2`, `habitat/2`, `tamano/2`, `espacio/2`, `temperatura/3`, `ph/3` y `humedad/3` encapsulan la aridad de `especie/12`, de modo que las reglas no dependen de la estructura interna de los hechos.

**Intersección de rangos:** El predicado auxiliar `sin_interseccion/4` determina si dos rangos no se cruzan: el máximo de uno es menor que el mínimo del otro. Los parámetros con valor `na` se descartan con `number/1` antes de compararse.

**Las reglas se agrupan en tres tipos:**

| Tipo | Predicado | Criterio de conflicto |
|---|---|---|
| Par | `conflicto_territorial_agresion/2` | Ambas especies son `territorial`, o cualquiera de las dos es `agresivo`. |
| Par | `conflicto_termico/2` | Los rangos de temperatura no se intersectan. |
| Par | `conflicto_quimico/2` | Los rangos de pH o de humedad no se intersectan (si ambos valores aplican). |
| Par | `conflicto_depredacion/2` | Una especie `depredador` y otra cuyo tamaño máximo es menor o igual al 50 % del tamaño del depredador (`se_come_a/2`). |
| Individual | `conflicto_habitat/2` | La especie no es compatible con el tipo de tanque, según `habitat_compatible/2`. |
| Global | `conflicto_hacinamiento/2` | La suma de litros o la suma de cm² requeridos supera la capacidad del tanque. |

**Compatibilidad de hábitat:** La tabla `habitat_compatible(Tanque, Especie)` define las combinaciones permitidas:

| Tipo de tanque | Hábitats de especie aceptados |
|---|---|
| `acuatico` | `acuatico` |
| `terrestre_tropical` | `terrestre_tropical` |
| `terrestre_desertico` | `terrestre_desertico` |
| `mixto` | `mixto`, `terrestre_tropical`, `acuatico` |

**Hacinamiento y capacidad del tanque:** El predicado `normalizar_espacio/3` convierte cualquiera de los tres functores en un par (litros, área). La regla `conflicto_hacinamiento/2` usa `maplist/4` para extraer los litros y las áreas de cada especie, suma ambas listas con `sum_list/2` y las compara por separado con la capacidad del tanque. Por esta razón, la capacidad del tanque debe expresarse con el functor correspondiente a su tipo:

| Tipo de tanque | Capacidad | Functor en Prolog |
|---|---|---|
| `acuatico` | litros | `litros(L)` |
| `terrestre_tropical`, `terrestre_desertico` | cm² | `cm2(A)` |
| `mixto` | litros y cm² | `litros_y_cm2(L, A)` |

### 3.3. `consultas.pl` (Orquestador)
Es el núcleo de evaluación del sistema experto.
- **Catálogo de reglas:** El predicado `regla/3` registra el tipo de cada regla (par, individual o global), su nombre y el mensaje de error asociado. Agregar una regla nueva solo requiere definir el predicado y anotar una línea en el catálogo.
- **Generador de combinaciones:** Utiliza el predicado `pareja_de_lista/3` para evitar evaluaciones redundantes (ej. A contra A, o evaluar A-B y luego B-A).
- **Meta-programación:** `evaluar_conflicto/4` consulta el catálogo y usa `call/n` para ejecutar dinámicamente la validación según su tipo: pares de especies, una especie contra el entorno, o la lista completa contra el tanque.
- **Recolección:** `diagnostico/3` emplea `findall/3` para escanear todo el ecosistema en una sola pasada, recolectando todos los fallos como términos `conflicto(Mensaje, Involucrados)`, y `sort/2` elimina los duplicados.
- **Veredicto:** El predicado `ecosistema_viable/2` utiliza la negación por fallo (`\+`) para determinar que el entorno es viable únicamente si no se detecta ningún conflicto.

**Ejemplo de consulta directa en el intérprete:**

```prolog
?- diagnostico([pez_oscar, pez_guppy], tanque(acuatico, litros(600)), C).
C = [conflicto('Riesgo de depredacion', involucrados(pez_oscar, pez_guppy))].
```

**Mensajes que puede devolver el diagnóstico:**

| Mensaje | Origen |
|---|---|
| `Conflicto por agresion o territorialidad` | `conflicto_territorial_agresion/2` |
| `Incompatibilidad de temperatura` | `conflicto_termico/2` |
| `Incompatibilidad de pH o humedad` | `conflicto_quimico/2` |
| `Riesgo de depredacion` | `conflicto_depredacion/2` |
| `Especie incompatible con el tipo de tanque` | `conflicto_habitat/2` |
| `Falta de espacio (Hacinamiento)` | `conflicto_hacinamiento/2` |

El orden de los nombres dentro de `involucrados(...)` sigue el orden de la lista de especies recibida.

### 3.4. `evaluar.pl` (Puente hacia Python)
Es el único archivo de Prolog que conoce el formato JSON. Define el predicado `evaluar_json/2`, que el servidor ejecuta en un proceso de SWI-Prolog:

```bash
swipl -q -g "evaluar_json([pez_oscar, pez_guppy], tanque(acuatico, litros(600)))" -t halt evaluar.pl
```

Su comportamiento es el siguiente:
1. **Verifica las especies:** Si alguna no existe en `hechos.pl`, imprime un JSON de error (`{"error": "Especie desconocida", "especie": "..."}`) en lugar de continuar. Sin esta comprobación, una especie mal escrita no generaría ningún conflicto y el ecosistema se reportaría como viable.
2. **Evalúa:** Llama a `diagnostico/3` y a `ecosistema_viable/2` del orquestador.
3. **Serializa:** Convierte cada `conflicto(Mensaje, involucrados(a, b))` en un objeto `{"mensaje": ..., "involucrados": ["a", "b"]}` y lo imprime con `json_write_dict/3`, en una sola línea.

## 4. API REST (`servidor.py`)
El servidor está implementado con Flask. Recibe la evaluación del navegador, la valida, la entrega al motor de Prolog y devuelve el resultado.

### 4.1. Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/evaluar` | Evalúa un ecosistema y devuelve el veredicto y los conflictos. |
| `OPTIONS` | `/api/evaluar` | Petición previa (*preflight*) del navegador; la responde `flask-cors`. |
| `GET` | `/` | Comprobación de salud: devuelve `{"estado": "ok"}`. |

**Puerto:** En producción, `gunicorn` escucha en la variable de entorno `PORT` (la asigna Render) y usa el puerto 8000 cuando no existe. En pruebas locales, `python3 servidor.py` usa el mismo criterio.

### 4.2. Solicitud
El cuerpo es un JSON con la lista de especies, el tipo de tanque y la capacidad. La forma de `tanque_capacidad` depende del tipo de tanque:

```json
{ "especies": ["pez_oscar", "pez_guppy"], "tanque_tipo": "acuatico", "tanque_capacidad": 600 }
```

```json
{ "especies": ["sapo_vientre_fuego", "corydora"], "tanque_tipo": "mixto",
  "tanque_capacidad": { "litros": 150, "area": 2000 } }
```

| `tanque_tipo` | `tanque_capacidad` | Término construido para Prolog |
|---|---|---|
| `acuatico` | número (litros) | `tanque(acuatico, litros(L))` |
| `terrestre_tropical`, `terrestre_desertico` | número (cm²) | `tanque(Tipo, cm2(A))` |
| `mixto` | objeto `{ "litros": L, "area": A }` | `tanque(mixto, litros_y_cm2(L, A))` |

### 4.3. Validación de la entrada
Antes de invocar a Prolog, el servidor valida cada dato y responde con HTTP 400 si alguno es incorrecto:

| Validación | Mensaje de error |
|---|---|
| El cuerpo no es un JSON válido (o falta el encabezado `Content-Type: application/json`) | `El cuerpo debe ser un JSON válido` |
| `especies` no es una lista de 2 a 24 elementos | `Se requiere una lista de 2 a 24 especies` |
| Algún identificador no tiene formato de átomo simple (minúsculas, dígitos y `_`) | `Identificador de especie inválido` |
| Hay especies repetidas | `Hay especies repetidas` |
| `tanque_tipo` no es uno de los cuatro valores permitidos | `Tipo de tanque inválido` |
| La capacidad no es un número, o no está entre 1 y 1,000,000,000 | `La capacidad en litros debe ser un número` / `... número positivo válido` (en terrestres, `El área ...`) |
| En un tanque mixto, la capacidad no es un objeto con `litros` y `area` | `Para un tanque mixto la capacidad debe incluir litros y area` |
| La especie tiene buen formato, pero no existe en `hechos.pl` | `{"error": "Especie desconocida", "especie": "..."}` (la detecta `evaluar.pl`) |

### 4.4. Invocación del motor de Prolog
- El comando se arma como una lista de argumentos (`['swipl', '-q', '-g', meta, '-t', 'halt', 'evaluar.pl']`) y se ejecuta sin intérprete de comandos (`shell`).
- La meta de Prolog (`meta`) solo se construye con datos ya validados: identificadores de especie, un tipo de tanque de la lista permitida y números enteros. Ningún texto del navegador llega al código Prolog sin validar.
- El proceso se ejecuta con la entrada estándar cerrada, desde la carpeta del servidor y con un límite de 20 segundos.
- Se revisa el código de salida del proceso. Si Prolog falla, la API responde con error y no con un falso resultado "viable".
- La salida estándar se interpreta como JSON y se devuelve al navegador.

### 4.5. Respuesta

**Evaluación correcta (HTTP 200):**

```json
{ "viable": true, "conflictos": [] }
```

```json
{
  "viable": false,
  "conflictos": [
    { "mensaje": "Riesgo de depredacion", "involucrados": ["pez_oscar", "pez_guppy"] }
  ]
}
```

**Códigos de estado:**

| Código | Situación | Cuerpo |
|---|---|---|
| 200 | Evaluación realizada (viable o no) | `{ "viable": ..., "conflictos": [...] }` |
| 400 | Datos de entrada incorrectos | `{ "error": "<mensaje>" }` |
| 500 | Falla interna al ejecutar Prolog (error, tiempo agotado o salida ilegible) | `{ "error": "Error procesando la consulta" }` |

### 4.6. CORS y seguridad
- **CORS:** Como el frontend y el backend se sirven desde orígenes distintos, se habilita `flask-cors`, que también responde la petición previa `OPTIONS` que el navegador envía antes de un `POST` con `Content-Type: application/json`.
- **Sin modo de depuración:** El servidor no se ejecuta con `debug=True`, que expone un depurador interactivo. En producción se usa `gunicorn`.
- **Sin ejecución de código externo:** La validación estricta de la entrada (sección 4.3) evita la inyección de código Prolog a través de la API.

## 5. Contenerización y Despliegue en la Nube
Para garantizar la portabilidad y cumplir con los requisitos de infraestructura, el backend se empaquetó utilizando Docker.

### 5.1. Dockerfile
- **Imagen base:** `python:3.11-slim`, una distribución ligera de Python 3.11 sobre Debian que evita problemas de repositorios obsoletos y mantiene la imagen compacta.
- **SWI-Prolog:** La imagen base incluye únicamente Python, por lo que se instala el motor lógico desde los repositorios oficiales mediante `apt-get install -y swi-prolog`.
- **Dependencias:** Se instalan a partir de `requirements.txt` (`flask`, `flask-cors` y `gunicorn`).
- **Código:** Se copian `servidor.py`, `evaluar.pl` y la carpeta `conocimiento/` a `/app`. Se expone el puerto 8000 como valor por defecto.
- **Arranque:** `gunicorn -w 2 -b 0.0.0.0:${PORT:-8000} --timeout 30 servidor:app`, es decir, 2 procesos de trabajo escuchando en el puerto que asigne la nube.

### 5.2. `.dockerignore`
Excluye la carpeta `frontend/` (`index.html`, `app.js`, `styles.css`, `config.js` e `imagenes/`), la documentación (`*.md`), los archivos de control de versiones y el entorno local (`venv/`, `__pycache__/`), de modo que la imagen contiene únicamente `servidor.py`, `evaluar.pl`, `requirements.txt` y la carpeta `conocimiento/`.

### 5.3. Render
- **Backend:** Se despliega como un Web Service a partir del Dockerfile, lo que proporciona una URL pública HTTPS. Integra el repositorio de GitHub y construye la imagen automáticamente en cada `git push`. Render asigna el puerto mediante la variable `PORT`.
- **Frontend:** Como el cliente es estático y no requiere compilación, se publica como Static Site de Render apuntando al directorio `frontend/`. Su única configuración es la URL del backend en `frontend/config.js`.

## 6. Interfaz de Usuario y Conexión Web (Frontend)
El cliente está formado por cuatro archivos dentro de `frontend/` (`index.html`, `styles.css`, `app.js` y `config.js`) y la subcarpeta `frontend/imagenes/`. No usa frameworks ni herramientas de compilación.

### 6.1. Diseño visual
La interfaz sigue un estilo "Bio-Tech / Laboratorio de Biología" con *glassmorphism*:

- **Paneles de cristal:** Fondos oscuros semitransparentes con `backdrop-filter: blur(12px)`, bordes delgados y resplandores sutiles en cian y verde esmeralda.
- **Paleta:** Cian (`#22d3ee`) y verde esmeralda (`#34d399`) sobre fondos oscuros; rojo (`#ff4d6d`) para alertas.
- **Tipografía:** *Abril Fatface* para el título principal (con degradado y contorno de neón), *Orbitron* para encabezados y botones, *Share Tech Mono* para las lecturas de laboratorio y *Poppins* para los textos.
- **Distribución:** Cuadrícula de tres columnas con CSS Grid: formulario y selección de especies (izquierda), botón de evaluación y mensaje de resultado (centro) y diagnóstico (derecha). En pantallas menores a 1280 px se reorganiza en una sola columna.
- **Fondos dinámicos:** El fondo de la página cambia según el tipo de ecosistema elegido. Se definen cinco clases en el `<body>`, cada una con una imagen y un degradado oscuro que mantiene legible el texto:

| Clase del `<body>` | Se activa con | Imagen |
|---|---|---|
| `fondo-general` | Sin selección (por defecto) | `imagenes/fondo-inicio.webp` |
| `fondo-acuatico` | Acuático (Acuario) | `imagenes/fondo-acuatico.webp` |
| `fondo-terrestre-tropical` | Terrestre Tropical | `imagenes/fondo-tropical.webp` |
| `fondo-terrestre-desertico` | Terrestre Desértico | `imagenes/fondo-desertico.webp` |
| `fondo-mixto` | Mixto (Paludario) | `imagenes/fondo-mixto.webp` |

  Como CSS no puede animar el paso entre dos imágenes de fondo, el cambio se suaviza con una capa auxiliar (`#fondo-transicion`): `app.js` copia en ella el fondo anterior, cambia la clase del `<body>` y desvanece la capa en 0.5 s.
- **Animaciones:** Levitación continua del botón "Evaluar" y del mensaje de resultado, resplandor de neón intenso al pasar el ratón sobre el botón, indicador de carga con anillos de escáner, burbuja de error flotante y encendido progresivo de los monitores de diagnóstico. Se respeta la preferencia del sistema de reducir el movimiento (`prefers-reduced-motion`).

### 6.2. Componentes de la interfaz
- **Cabecera y menú flotante:** El título "Arquitecto de ecosistemas" aparece centrado en la parte superior. La cabecera es fija (`position: sticky`), por lo que permanece visible al hacer scroll. En la esquina inferior derecha del título hay un interruptor luminoso que despliega hacia abajo el menú con dos opciones: "Enciclopedia de especies" y "Guía Rápida", que abren ventanas modales. El menú se cierra al elegir una opción, al hacer clic fuera de él o con la tecla Escape.
- **Tipo de ecosistema y capacidad:** Un selector define el hábitat. La capacidad se ajusta con deslizadores (`input type="range"`) cuyo valor se muestra en tiempo real: litros (de 10 a 1,000 L, en pasos de 10) y área (de 100 a 60,000 cm², en pasos de 100). La página muestra el deslizador adecuado: litros para un acuario, área para un terrario, o ambos para un paludario mixto.
- **Selección de especies con pestañas:** Las tarjetas de las 24 especies se organizan en pestañas por clase taxonómica: Todos, Peces, Anfibios, Reptiles e Invertebrados. Las pestañas funcionan como interruptores de un panel de laboratorio (la activa se ilumina con neón cian). Las tarjetas seleccionadas se resaltan en verde esmeralda. La selección se conserva al cambiar de pestaña.
- **Filtro inteligente por ecosistema:** Al elegir el tipo de ecosistema, la página bloquea las pestañas de las clases que no tienen especies compatibles:

| Ecosistema | Pestañas bloqueadas |
|---|---|
| Sin selección | Ninguna |
| Acuático (Acuario) | Reptiles |
| Terrestre Tropical | Peces e Invertebrados |
| Terrestre Desértico | Peces y Anfibios |
| Mixto (Paludario) | Ninguna |

  La pestaña "Todos" no muestra las clases bloqueadas. Si la pestaña activa queda bloqueada, la página vuelve a "Todos", y las especies seleccionadas de una clase bloqueada se quitan de la selección para que no se envíen a la API.
- **Botón y mensaje central:** El botón "Evaluar" y el mensaje de resultado ("Ecosistema Viable" en verde o "Conflictos Encontrados" en rojo) levitan en el centro de la pantalla.
- **Panel de resultados (monitores de diagnóstico):** Muestra el diagnóstico como monitores de laboratorio. Un monitor principal resume el veredicto (hábitat, capacidad, número de especies y de conflictos) y se agrega un monitor de alerta por cada conflicto, con su tipo y las especies involucradas. El panel ajusta su altura a la ventana y las tarjetas se desplazan dentro de él con una barra de scroll propia, estilizada en tonos oscuros y cian. Antes de evaluar, un monitor "en espera" indica que el sistema aguarda una muestra.

**Etiqueta que muestra cada monitor de alerta según el mensaje de la API:**

| Mensaje de la API | Etiqueta en el monitor |
|---|---|
| `Riesgo de depredacion` | Depredación |
| `Conflicto por agresion o territorialidad` | Agresión / territorio |
| `Incompatibilidad de temperatura` | Temperatura |
| `Incompatibilidad de pH o humedad` | Químico |
| `Especie incompatible con el tipo de tanque` | Hábitat |
| `Falta de espacio (Hacinamiento)` | Espacio |

- **Ventanas modales:** La Enciclopedia de especies (con los parámetros de cada especie) y la Guía Rápida se cierran con la `×` o haciendo clic fuera de la ventana.
- **Nueva consulta:** El botón correspondiente restablece el formulario, los deslizadores, la pestaña activa, las tarjetas seleccionadas, el fondo y los resultados.

### 6.3. Lógica del cliente (`frontend/app.js`)
- **Catálogo de especies:** El arreglo `especiesJSON` contiene las 24 especies con su `id` (el mismo átomo que usa `hechos.pl`), su `clase` (el campo `clase` de `hechos.pl`), nombre, hábitat, temperamento, parámetros, espacio, tamaño e imagen `.webp`. A partir de él se generan las tarjetas de selección y la Enciclopedia de especies.
- **Renderizado con filtro:** `renderizarTarjetas(filtro)` crea las tarjetas la primera vez y después solo muestra u oculta según la clase. Las tarjetas ocultas permanecen en el DOM para conservar la selección.
- **Validaciones previas:** Antes de enviar, se verifica que haya un hábitat seleccionado, que la capacidad sea un número positivo y que se hayan elegido al menos dos especies. Los errores se muestran en una burbuja sobre el botón.
- **Interpretación del diagnóstico:** Una función dibuja los monitores a partir de la respuesta. Los textos del servidor se insertan con `textContent` (nunca como HTML), de modo que no pueden inyectar código en la página. Acepta las especies involucradas como lista o como texto.

### 6.4. Comunicación con la API
- **Petición:** El cliente arma el JSON con el formato descrito en la sección 4.2 y lo envía con `fetch(CONFIG.API_URL, ...)`. La URL se define en `frontend/config.js`, que permite alternar entre `localhost` (pruebas locales) y la URL pública de Render.
- **Orden de las especies:** Las especies se envían en el orden del catálogo, no en el orden en que se hizo clic. Esto no cambia el resultado, aunque el orden de los nombres dentro de `involucrados` puede diferir del de una consulta directa en Prolog.
- **Manejo de errores:** Si el servidor responde con un código de error (400 o 500) o no está disponible, la página muestra el mensaje "Error de conexión con el servidor" y no un resultado.

## 7. Casos de Prueba
El sistema se sometió a pruebas de caja negra mediante un catálogo de 10 escenarios sobre la base de conocimientos de 24 especies. Cada caso define las especies, el tipo y la capacidad del tanque, y el veredicto esperado, de modo que, en general, cada uno aísla un solo motivo de rechazo. Los criterios de referencia, la entrada completa de cada caso, el razonamiento del resultado esperado y las evidencias de ejecución están en el documento `casos_de_prueba.md`.

| # | Escenario | Tanque | Veredicto esperado |
|---|---|---|---|
| 1 | Acuario comunitario de especies pequeñas | Acuático, 200 L | Viable |
| 2 | Terrario tropical húmedo | Terrestre tropical, 5,000 cm² | Viable |
| 3 | Paludario con zona acuática y terrestre | Mixto, 150 L y 2,000 cm² | Viable |
| 4 | Óscar y guppy | Acuático, 600 L | Conflicto: depredación |
| 5 | Ajolote y camarón cereza | Acuático, 250 L | Conflicto: depredación |
| 6 | Betta y cíclido convicto | Acuático, 300 L | Conflicto: agresión / territorialidad |
| 7 | Uromastyx y anolis verde | Terrestre desértico, 9,000 cm² | Conflicto: hábitat y humedad |
| 8 | Iguana verde y salamandra tigre | Mixto, 200 L y 50,000 cm² | Conflicto: temperatura |
| 9 | Acuario comunitario sobrepoblado | Acuático, 100 L | Conflicto: hacinamiento |
| 10 | Terrario desértico reducido | Terrestre desértico, 3,000 cm² | Conflicto: hacinamiento |

Las pruebas se ejecutan en tres niveles, que comparten el mismo orquestador (`consultas.pl`) y por lo tanto deben producir el mismo veredicto:

1. **Motor:** consultas directas a `diagnostico/3` y `ecosistema_viable/2` en el intérprete de SWI-Prolog. No intervienen el servidor ni la interfaz.
2. **API:** peticiones HTTP al servidor Flask (por ejemplo, con `curl`), que además permiten probar la validación de entradas incorrectas.
3. **Interfaz web:** el flujo completo, desde el formulario del navegador hasta los monitores de diagnóstico.

## 8. Instalación y Ejecución Local
Los comandos se ejecutan desde la carpeta raíz del proyecto. Se requiere SWI-Prolog, Python 3 y, opcionalmente, Docker.

**Motor de inferencia en consola (sin servidor):**

```bash
swipl conocimiento/consultas.pl
```

**Dependencias de Python** (entorno virtual, por ejemplo en Linux Mint):

```bash
sudo apt install -y python3 python3-venv python3-pip
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Servidor (API) en local:**

```bash
python3 servidor.py
```

O con Docker:

```bash
docker build -t arquitecto-api .
docker run --rm -p 8000:8000 arquitecto-api
```

**Frontend:** En `frontend/config.js`, activa la URL local y desactiva la de producción:

```javascript
const CONFIG = {
    API_URL: 'http://localhost:8000/api/evaluar',
    // API_URL: '[https://TU-APLICACION.onrender.com/api/evaluar](https://TU-APLICACION.onrender.com/api/evaluar)'
};
```

Después entra a la carpeta `frontend/`, sirve los archivos estáticos y abre `http://localhost:5500`:

```bash
cd frontend
python3 -m http.server 5500
```

Para el despliegue, se reemplaza `TU-APLICACION` por el dominio real del Web Service de Render.

## 9. Limitaciones y Trabajo Futuro
- **Variables consideradas:** El sistema solo evalúa temperatura, pH, humedad, espacio, tamaño y temperamento. No considera otros factores biológicos, como toxinas cutáneas, patógenos o el estrés al mezclar anfibios con reptiles o con peces, por lo que un resultado viable no sustituye el criterio de un especialista.
- **Ejemplares:** La evaluación supone un ejemplar adulto por especie.
- **Depredación:** Se basa en una proporción fija del 50 % del tamaño máximo del depredador y no distingue etapas juveniles.
- **Base de conocimientos:** Está limitada a 24 especies. Agregar una nueva implica registrarla en `hechos.pl` y en el arreglo `especiesJSON` de `frontend/app.js`, con el mismo identificador y la misma clase en ambos.
- **Rendimiento:** El servidor inicia un proceso de SWI-Prolog y carga la base de conocimientos en cada petición. Para el volumen de uso de esta práctica es suficiente; para un uso intensivo convendría mantener el motor cargado en memoria.
- **Disponibilidad:** El servicio en Render puede tardar en responder la primera petición tras un periodo de inactividad.
- **Fondos:** Las imágenes de fondo por ecosistema se reemplazan editando las rutas `url(...)` de las cinco clases `fondo-*` en `frontend/styles.css`.
- **Trabajo futuro:** Considerar el número de ejemplares por especie, incluir recomendaciones para resolver cada conflicto y ampliar el catálogo de especies.

## Anexo A. Catálogo de especies
Datos de `hechos.pl` (24 especies). `N/A` indica que el parámetro no aplica a la especie (`na`).

| ID | Clase | Hábitat | Temp. (°C) | pH | Humedad (%) | Espacio mínimo | Tamaño máx. (cm) | Temperamento |
|---|---|---|---|---|---|---|---|---|
| `pez_guppy` | pez | `acuatico` | 22–28 | 6.8–7.8 | N/A | 20 L | 6 | pacifico |
| `tetra_neon` | pez | `acuatico` | 20–26 | 5.0–7.0 | N/A | 40 L | 4 | pacifico |
| `corydora` | pez | `acuatico` | 22–26 | 6.0–7.8 | N/A | 60 L | 7 | pacifico |
| `camaron_cereza` | invertebrado | `acuatico` | 18–28 | 6.5–8.0 | N/A | 20 L | 4 | pacifico |
| `pez_betta` | pez | `acuatico` | 24–28 | 6.0–7.5 | N/A | 20 L | 7 | territorial |
| `pez_oscar` | pez | `acuatico` | 22–28 | 6.0–7.5 | N/A | 400 L | 35 | depredador |
| `ciclido_convicto` | pez | `acuatico` | 22–28 | 6.5–8.0 | N/A | 150 L | 15 | agresivo |
| `pirana_vientre_rojo` | pez | `acuatico` | 24–28 | 6.0–7.5 | N/A | 400 L | 30 | depredador |
| `goldfish` | pez | `acuatico` | 15–24 | 6.5–8.0 | N/A | 150 L | 30 | pacifico |
| `ajolote` | anfibio | `acuatico` | 14–20 | 6.5–8.0 | N/A | 150 L | 30 | depredador |
| `rana_flecha` | anfibio | `terrestre_tropical` | 22–27 | N/A | 80–100 | 400 cm² | 5 | territorial |
| `rana_ojos_rojos` | anfibio | `terrestre_tropical` | 22–28 | N/A | 70–90 | 1,300 cm² | 7 | pacifico |
| `sapo_vientre_fuego` | anfibio | `mixto` | 18–24 | 6.5–7.5 | 60–80 | 40 L + 400 cm² | 5 | pacifico |
| `salamandra_tigre` | anfibio | `mixto` | 15–22 | 6.5–7.5 | 70–80 | 75 L + 750 cm² | 25 | depredador |
| `tortuga_orejas_rojas` | reptil | `mixto` | 22–28 | 6.5–8.0 | 50–70 | 300 L + 3,000 cm² | 30 | depredador |
| `iguana_verde` | reptil | `terrestre_tropical` | 24–32 | N/A | 60–80 | 40,000 cm² | 180 | pacifico |
| `gecko_crestado` | reptil | `terrestre_tropical` | 22–27 | N/A | 60–80 | 750 cm² | 20 | pacifico |
| `camaleon_velo` | reptil | `terrestre_tropical` | 24–29 | N/A | 40–60 | 4,500 cm² | 60 | territorial |
| `anolis_verde` | reptil | `terrestre_tropical` | 22–30 | N/A | 60–80 | 750 cm² | 20 | territorial |
| `dragon_barbudo` | reptil | `terrestre_desertico` | 24–35 | N/A | 30–40 | 4,500 cm² | 55 | pacifico |
| `gecko_leopardo` | reptil | `terrestre_desertico` | 24–32 | N/A | 30–40 | 1,100 cm² | 25 | pacifico |
| `uromastyx` | reptil | `terrestre_desertico` | 27–40 | N/A | 10–20 | 4,500 cm² | 40 | pacifico |
| `serpiente_maiz` | reptil | `terrestre_tropical` | 22–28 | N/A | 40–60 | 1,500 cm² | 150 | depredador |
| `piton_bola` | reptil | `terrestre_tropical` | 25–32 | N/A | 50–70 | 2,800 cm² | 150 | depredador |

## Anexo B. Configuración

| Elemento | Dónde se define | Valor |
|---|---|---|
| Puerto del servidor | Variable de entorno `PORT` | 8000 si no existe (Render la asigna) |
| URL de la API | `CONFIG.API_URL` en `frontend/config.js` | `http://localhost:8000/api/evaluar` (local) o la URL de Render (producción) |
| Imagen base del contenedor | `FROM` en el `Dockerfile` | `python:3.11-slim` (con `swi-prolog` vía `apt`) |
| Tiempo máximo de Prolog | `timeout` en `servidor.py` | 20 s |
| Tiempo máximo de una petición | `--timeout` de `gunicorn` en el `Dockerfile` | 30 s |

</div>