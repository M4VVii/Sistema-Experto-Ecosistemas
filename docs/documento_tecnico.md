<div align="center">

# INSTITUTO POLITÉCNICO NACIONAL
## ESCUELA SUPERIOR DE CÓMPUTO (ESCOM)

</div>

<div align="justify">

**Asignatura:** Paradigmas de Programación  
**Práctica N°:** 1  
**Docente:** Dra. Morales Rodriguez Ursula Samantha  

**TÍTULO:** Sistema Experto - Arquitecto de Ecosistemas  
**ALUMNOS:**  
- Valencia Villanueva Adrian (MAVV)  
- Nina Sofía Vazquez Guillen (NISO)  

## 1. Introducción
El "Arquitecto de Ecosistemas" es un sistema experto desarrollado bajo el paradigma lógico utilizando SWI-Prolog. Su objetivo principal es evaluar la viabilidad de un ecosistema en un acuario, un terrario o un paludario, analizando la compatibilidad entre múltiples especies y las características del entorno. El sistema detecta conflictos territoriales y de agresión, de depredación, térmicos, químicos (pH y humedad), de hábitat y de hacinamiento, y emite un diagnóstico que enumera cada conflicto encontrado y las especies involucradas.

La base de conocimientos contiene 24 especies (peces, invertebrados, anfibios y reptiles). El usuario elige el tipo de hábitat, indica la capacidad del recinto, selecciona al menos dos especies y recibe el veredicto del motor de inferencia.

## 2. Arquitectura General del Sistema
El proyecto sigue una arquitectura cliente-servidor contenerizada:
- **Motor de Inferencia y Backend:** Desarrollado íntegramente en SWI-Prolog.
- **API REST Nativa:** Implementada mediante las bibliotecas HTTP internas de Prolog, eliminando la necesidad de lenguajes intermediarios.
- **Frontend:** Cliente web estático (HTML, CSS y JavaScript) que consume la API mediante `fetch`.
- **Despliegue:** Backend empaquetado mediante Docker y desplegado como un Web Service en la plataforma Render.

Flujo de una evaluación:

```
 Navegador (index.html + app.js)
        │  POST /api/evaluar   (JSON: especies, tanque_tipo, tanque_capacidad)
        ▼
 servidor.pl  ── construye tanque(Tipo, Capacidad)
        │
        ▼
 consultas.pl ── diagnostico/3 y ecosistema_viable/2
        │              │
        │              ▼
        │         reglas.pl  ──►  hechos.pl (24 especies)
        ▼
 JSON: { "viable": true|false, "conflictos": [...] }
        │
        ▼
 Navegador (muestra el veredicto)
```

### 2.1. Estructura del repositorio

```
proyecto/
├── servidor.pl            % API REST (backend)
├── Dockerfile             % Imagen del backend
├── .dockerignore          % Excluye el frontend y la documentación de la imagen
├── conocimiento/
│   ├── hechos.pl          % Base de conocimientos (24 especies)
│   ├── reglas.pl          % Reglas de conflicto
│   └── consultas.pl       % Orquestador y diagnóstico
├── index.html             % Estructura de la interfaz
├── styles.css             % Estilos
├── app.js                 % Lógica del cliente
├── config.js              % URL de la API
├── imagenes/              % Fondo e imágenes de las especies (.webp)
├── casos_de_prueba.md     % Catálogo de pruebas
└── documento_tecnico.md   % Este documento
```

## 3. Base de Conocimientos y Motor de Inferencia (Backend)
El sistema lógico está dividido en tres módulos principales para garantizar la separación de responsabilidades y la escalabilidad del código. La cadena de carga es `consultas.pl` → `reglas.pl` → `hechos.pl`, mediante `ensure_loaded/1`.

### 3.1. `hechos.pl` (Diccionario Biológico)
El motor de inferencia se alimenta de una base de datos lógica estructurada mediante el functor `especie/12`, el cual normaliza los requerimientos biológicos y físicos de cada animal en el ecosistema.

La firma de los hechos está diseñada de la siguiente manera:

`especie(id_nombre, clase, tipo_habitat, temp_min, temp_max, ph_min, ph_max, humedad_min, humedad_max, requerimiento_espacio, tamano_max_cm, temperamento).`

**Dominios y variables clave:**
* **tipo_habitat:** El sistema clasifica el entorno en cuatro categorías estrictas: `acuatico`, `terrestre_tropical`, `terrestre_desertico` y `mixto`.
* **Rangos de tolerancia (físico-químicos):** Las variables de temperatura (°C), pH y humedad (%) utilizan límites mínimos y máximos para permitir que `reglas.pl` calcule las intersecciones de compatibilidad mediante operadores relacionales.
* **Valores nulos:** Los parámetros que no aplican a una especie (por ejemplo, el pH en un reptil terrestre o la humedad en un pez) se representan con el átomo `na`, y las reglas los ignoran.
* **Espacio:** El `requerimiento_espacio` se expresa con functores que unifican las unidades según el hábitat: `litros(L)` para especies acuáticas, `cm2(A)` para terrestres y `litros_y_cm2(L, A)` para especies mixtas.
* **Comportamiento:** El `tamano_max_cm` y el `temperamento` (`pacifico`, `territorial`, `agresivo` o `depredador`) definen los cruces lógicos de agresión y depredación.

### 3.2. `reglas.pl` (Reglas de Conflicto)
Contiene la lógica matemática y biológica para cruzar las variables. Se programaron predicados que calculan intersecciones de rangos y validan compatibilidad.

**Abstracción por accesores.** Los predicados `temperamento/2`, `habitat/2`, `tamano/2`, `espacio/2`, `temperatura/3`, `ph/3` y `humedad/3` encapsulan la aridad de `especie/12`, de modo que las reglas no dependen de la estructura interna de los hechos.

**Intersección de rangos.** El predicado auxiliar `sin_interseccion/4` determina si dos rangos no se cruzan: el máximo de uno es menor que el mínimo del otro. Los parámetros con valor `na` se descartan con `number/1` antes de compararse.

Las reglas se agrupan en tres tipos:

| Tipo | Predicado | Criterio de conflicto |
|---|---|---|
| Par | `conflicto_territorial_agresion/2` | Ambas especies son `territorial`, o cualquiera de las dos es `agresivo`. |
| Par | `conflicto_termico/2` | Los rangos de temperatura no se intersectan. |
| Par | `conflicto_quimico/2` | Los rangos de pH o de humedad no se intersectan (si ambos valores aplican). |
| Par | `conflicto_depredacion/2` | Una especie `depredador` y otra cuyo tamaño máximo es menor o igual al 50 % del tamaño del depredador (`se_come_a/2`). |
| Individual | `conflicto_habitat/2` | La especie no es compatible con el tipo de tanque, según `habitat_compatible/2`. |
| Global | `conflicto_hacinamiento/2` | La suma de litros o la suma de cm² requeridos supera la capacidad del tanque. |

**Compatibilidad de hábitat.** La tabla `habitat_compatible(Tanque, Especie)` define las combinaciones permitidas:

| Tipo de tanque | Hábitats de especie aceptados |
|---|---|
| `acuatico` | `acuatico` |
| `terrestre_tropical` | `terrestre_tropical` |
| `terrestre_desertico` | `terrestre_desertico` |
| `mixto` | `mixto`, `terrestre_tropical`, `acuatico` |

**Hacinamiento y capacidad del tanque.** El predicado `normalizar_espacio/3` convierte cualquiera de los tres functores en un par (litros, área). La regla `conflicto_hacinamiento/2` usa `maplist/4` para extraer los litros y las áreas de cada especie, suma ambas listas con `sum_list/2` y las compara por separado con la capacidad del tanque. Por esta razón, la capacidad del tanque debe expresarse con el functor correspondiente a su tipo:

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

Ejemplo de consulta directa en el intérprete:

```prolog
?- diagnostico([pez_oscar, pez_guppy], tanque(acuatico, litros(600)), C).
C = [conflicto('Riesgo de depredacion', involucrados(pez_oscar, pez_guppy))].
```

Mensajes que puede devolver el diagnóstico:

| Mensaje | Origen |
|---|---|
| `Conflicto por agresion o territorialidad` | `conflicto_territorial_agresion/2` |
| `Incompatibilidad de temperatura` | `conflicto_termico/2` |
| `Incompatibilidad de pH o humedad` | `conflicto_quimico/2` |
| `Riesgo de depredacion` | `conflicto_depredacion/2` |
| `Especie incompatible con el tipo de tanque` | `conflicto_habitat/2` |
| `Falta de espacio (Hacinamiento)` | `conflicto_hacinamiento/2` |

## 4. API REST Nativa (`servidor.pl`)
Para la comunicación con el frontend, se implementó la **Alternativa C** de la rúbrica (servicio web directo en Prolog). Se utilizaron los módulos `http/thread_httpd`, `http/http_dispatch`, `http/http_json` y `http/http_cors`.

**Endpoint:** `POST /api/evaluar`

**Puerto:** `iniciar_servidor/0` lee la variable de entorno `PORT` (la asigna Render) y usa el puerto 8000 cuando no existe, lo que permite el mismo código en la nube y en local.

**Solicitud.** El cuerpo es un JSON con la lista de especies, el tipo de tanque y la capacidad. La forma de `tanque_capacidad` depende del tipo de tanque:

```json
{ "especies": ["pez_oscar", "pez_guppy"], "tanque_tipo": "acuatico", "tanque_capacidad": 600 }
```

```json
{ "especies": ["sapo_vientre_fuego", "corydora"], "tanque_tipo": "mixto",
  "tanque_capacidad": { "litros": 150, "area": 2000 } }
```

| `tanque_tipo` | `tanque_capacidad` |
|---|---|
| `acuatico` | número (litros) |
| `terrestre_tropical`, `terrestre_desertico` | número (cm²) |
| `mixto` | objeto `{ "litros": L, "area": A }` |

**Procesamiento.** El manejador lee el JSON con `http_read_json_dict/3` y la opción `value_string_as(atom)`, para que los textos lleguen como átomos y unifiquen con los de `hechos.pl`. Después, `construir_capacidad/3` convierte la capacidad al functor que espera `reglas.pl` (`litros/1`, `cm2/1` o `litros_y_cm2/2`), ensambla `tanque(Tipo, Capacidad)` y consulta al orquestador (`diagnostico/3` y `ecosistema_viable/2`).

**Respuesta.** Un JSON con el veredicto y la lista de conflictos:

```json
{ "viable": true, "conflictos": [] }
```

```json
{
  "viable": false,
  "conflictos": [
    { "mensaje": "Riesgo de depredacion", "involucrados": "involucrados(pez_oscar,pez_guppy)" }
  ]
}
```

**CORS.** Como el frontend y el backend se sirven desde orígenes distintos, se configuró `http/http_cors` (`set_setting(http:cors, [*])`). Además, el endpoint acepta el método `OPTIONS`: el navegador lo envía como petición previa (*preflight*) antes de un `POST` con `Content-Type: application/json`, y el servidor responde con los encabezados CORS correspondientes.

## 5. Contenerización y Despliegue en la Nube
Para garantizar la portabilidad y cumplir con los requisitos de infraestructura, el backend lógico fue empaquetado utilizando Docker.
- **Dockerfile:** Basado en la imagen oficial `swipl:9.0.4`, la misma versión de SWI-Prolog usada en desarrollo, fijada para que un despliegue futuro no cambie de versión inesperadamente. Copia el proyecto a `/app`, expone el puerto 8000 y arranca `servidor.pl` con `iniciar_servidor`. El proceso se mantiene vivo mediante `thread_get_message(_)`.
- **`.dockerignore`:** Excluye el frontend, las imágenes y la documentación, de modo que la imagen contiene únicamente `servidor.pl` y la carpeta `conocimiento/`.
- **Render (backend):** El contenedor se despliega como un Web Service, lo que proporciona una URL pública HTTPS, integrando el repositorio de GitHub y construyendo la imagen automáticamente en cada `git push`. Render asigna el puerto mediante la variable `PORT`.
- **Render (frontend):** Como el cliente es estático y no requiere compilación, puede publicarse como Static Site de Render. Su única configuración es la URL del backend en `config.js`.

## 6. Interfaz de Usuario y Conexión Web (Frontend)
El cliente está formado por cuatro archivos (`index.html`, `styles.css`, `app.js` y `config.js`) y la carpeta `imagenes/`. No usa frameworks ni herramientas de compilación.

### 6.1. Diseño visual
- **Tema bioluminiscente:** Fondo de imagen con desenfoque y oscurecimiento, y paleta de lila (`#d884ff`) y azul celeste (`#60e5ff`) sobre fondos oscuros.
- **Cajas de cristal:** Paneles translúcidos con `backdrop-filter`, bordes redondeados y sombras.
- **Tipografía:** *Abril Fatface* para títulos y *Poppins* para los textos, cargadas desde Google Fonts.
- **Distribución:** Cuadrícula de tres columnas con CSS Grid: formulario y selección de especies (izquierda), botón de evaluación y animaciones (centro), y resultados (derecha). En pantallas menores a 1280 px se reorganiza en una sola columna.
- **Animaciones:** Espiral de carga, estrella de resultado, burbuja de error flotante y efectos de brillo en botones y tarjetas. Se respeta la preferencia del sistema de reducir el movimiento (`prefers-reduced-motion`).

### 6.2. Lógica del cliente (`app.js`)
- **Catálogo de especies:** El arreglo `especiesJSON` contiene las 24 especies con su `id` (el mismo átomo que usa `hechos.pl`), nombre, hábitat, temperamento, parámetros, espacio, tamaño e imagen `.webp`. A partir de él se generan las tarjetas de selección y la Enciclopedia de especies.
- **Campos de capacidad dinámicos:** Al elegir el hábitat, la página muestra el campo adecuado: litros para un acuario, área en cm² para un terrario, o ambos para un paludario mixto.
- **Validaciones previas:** Antes de enviar, se verifica que haya un hábitat seleccionado, que la capacidad sea un número positivo y que se hayan elegido al menos dos especies. Los errores se muestran en una burbuja sobre el botón.
- **Petición al backend:** Arma el JSON con el formato descrito en la sección 4 y lo envía con `fetch(CONFIG.API_URL, ...)`. La URL se define en `config.js`, que permite alternar entre `localhost` (pruebas locales) y la URL pública de Render.
- **Resultado:** La estrella central muestra "Ecosistema Viable" (verde) o "Conflictos Encontrados" (rojo). Si falla la conexión con el servidor, se muestra un mensaje de error.
- **Ventanas modales:** La Enciclopedia de especies y la Guía Rápida se abren desde el menú y se cierran con la `×` o haciendo clic fuera de la ventana.
- **Nueva consulta:** El botón correspondiente limpia el formulario, las tarjetas seleccionadas y los resultados.

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

Las pruebas se ejecutan en dos niveles: directamente sobre el motor, mediante consultas a `diagnostico/3` y `ecosistema_viable/2` en el intérprete de SWI-Prolog, y de extremo a extremo, desde la interfaz web contra el servidor.

## 8. Instalación y Ejecución Local
Los comandos se ejecutan desde la carpeta raíz del proyecto.

**Motor de inferencia en consola:**

```bash
swipl conocimiento/consultas.pl
```

**Servidor (API) en local:**

```bash
swipl -s servidor.pl -g iniciar_servidor -t "thread_get_message(_)"
```

O con Docker:

```bash
docker build -t arquitecto-api .
docker run --rm -p 8000:8000 arquitecto-api
```

**Frontend:** En `config.js`, activa la URL local y desactiva la de producción:

```javascript
const CONFIG = {
    API_URL: 'http://localhost:8000/api/evaluar',
    // API_URL: 'https://TU-APLICACION.onrender.com/api/evaluar'
};
```

Después sirve la carpeta del frontend y abre `http://localhost:5500`:

```bash
python3 -m http.server 5500
```

Para el despliegue, se reemplaza `TU-APLICACION` por el dominio real del Web Service de Render.

## 9. Limitaciones y Trabajo Futuro
- **Variables consideradas:** El sistema solo evalúa temperatura, pH, humedad, espacio, tamaño y temperamento. No considera otros factores biológicos, como toxinas cutáneas, patógenos o el estrés al mezclar anfibios con reptiles o con peces, por lo que un resultado viable no sustituye el criterio de un especialista.
- **Ejemplares:** La evaluación supone un ejemplar adulto por especie.
- **Depredación:** Se basa en una proporción fija del 50 % del tamaño máximo del depredador y no distingue etapas juveniles.
- **Base de conocimientos:** Está limitada a 24 especies. Agregar una nueva implica registrarla en `hechos.pl` y en el arreglo `especiesJSON` de `app.js`, con el mismo identificador en ambos.
- **Detalle de conflictos en la interfaz:** La API devuelve la lista completa de conflictos, pero la página muestra por ahora solo el veredicto. Como mejora, el panel de Resultados puede listar cada conflicto y las especies involucradas.
- **Disponibilidad:** El servicio en Render puede tardar en responder la primera petición tras un periodo de inactividad.

</div>