<div align="center">

# 🌍 Sistema Experto: Arquitecto de Ecosistemas (Acuarios, Terrarios y Paludarios)

**Práctica integradora 1er Parcial - Paradigmas de Programación**  
**Escuela Superior de Cómputo (ESCOM) - IPN**

</div>

<div align="justify">

## 1. Descripción del Proyecto y Problema que Resuelve
El **Arquitecto de Ecosistemas** es un sistema experto basado en programación lógica (Prolog) diseñado para prevenir desastres biológicos en entornos cerrados. 

**El Problema:** Las personas que inician en el acuarismo y la herpetología suelen mezclar peces, anfibios y reptiles basándose únicamente en la estética. Ignoran incompatibilidades críticas como diferencias de pH, humedad, riesgos de depredación o territorialidad, lo que resulta en el colapso del ecosistema.

**La Solución:** Este sistema no es una simple base de datos, ya que, utiliza un motor de inferencia lógica para evaluar múltiples parámetros ambientales y de comportamiento, deduciendo si una combinación específica de especies es viable y generando explicaciones detalladas de los conflictos biológicos.

## 2. Integrantes y Contribuciones
* **Valencia Villanueva Adrian (MAVV):** Diseño de reglas de inferencia en Prolog, configuración de Docker y despliegue del backend.
* **Vazquez Guillen Nina Sofia (NISO):** Desarrollo de la interfaz gráfica frontend, investigación biológica y diseño de la API HTTP.

## 3. Demo Pública
🔗 **Aplicación Web (Frontend):** [https://arquitecto-ecosistemas-web.onrender.com](https://arquitecto-ecosistemas-web.onrender.com)  
🔗 **API REST (Backend):** [https://arquitecto-ecosistemas.onrender.com](https://arquitecto-ecosistemas.onrender.com)

## 4. Arquitectura del Sistema
El sistema tiene una arquitectura híbrida (Python + Prolog) que separa claramente la capa de presentación, la capa de integración y la capa de razonamiento lógico:

1. **Frontend (Render Static Site):** Interfaz web estática en HTML/CSS/JS puro con diseño Bio-Tech (Glassmorphism), fondos dinámicos por hábitat y pestañas taxonómicas. Captura los parámetros del hábitat y las especies deseadas.
2. **API REST (Python / Flask + Gunicorn):** `servidor.py` recibe peticiones JSON, valida estrictamente las entradas para evitar inyección de código e invoca a Prolog mediante subprocesos aislados (`subprocess`), usando `evaluar.pl` como puente JSON.
3. **Motor de Inferencia (SWI-Prolog):** Los módulos `hechos.pl` (24 especies), `reglas.pl` y `consultas.pl` evalúan la compatibilidad térmica, química (pH/humedad), territorial, de depredación, de hábitat y de hacinamiento (unificación y backtracking), y generan una respuesta justificada.

## 5. Estructura de Carpetas
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
 ┃ ┣ 📂 img/                 # Evidencias visuales
 ┃ ┣ 📜 casos_de_prueba.md   # Pruebas documentadas
 ┃ ┗ 📜 documento_tecnico.md # Entregable escrito
 ┣ 📜 .gitignore             # Exclusión de archivos basura
 ┗ 📜 README.md              # Documentación principal
```

## 6. Instalación y Ejecución Local

**Requisitos Previos:**
* [Python](https://www.python.org/) (3.11+)
* [SWI-Prolog](https://www.swi-prolog.org/) (v9.x+)
* [Docker](https://www.docker.com/) *(opcional, para levantar el backend en contenedor)*
* Navegador Web moderno

**Pasos para ejecutar:**
1. Clonar el repositorio: `git clone https://github.com/M4VVii/Sistema-Experto-Ecosistemas.git`
2. Levantar el backend (API + motor lógico):
   * Entrar a la carpeta `backend/`, crear y activar un entorno virtual, e instalar las dependencias:
     ```bash
     cd backend
     python3 -m venv venv && source venv/bin/activate
     pip install -r requirements.txt
     ```
     *(En Debian/Ubuntu/Mint, si falla la creación del entorno: `sudo apt install python3-venv`)*
   * Ejecutar: `python3 servidor.py`
   * El servidor iniciará por defecto en `http://localhost:8000`
   * **Alternativa con Docker** (desde `backend/`):
     ```bash
     docker build -t arquitecto-api .
     docker run --rm -p 8000:8000 arquitecto-api
     ```
3. Levantar la interfaz (Frontend):
   * Verificar la URL de la API en `frontend/config.js`. Para pruebas locales debe apuntar al backend local:
     ```javascript
     const CONFIG = {
         API_URL: 'http://localhost:8000/api/evaluar'
         // Producción: 'https://arquitecto-ecosistemas.onrender.com/api/evaluar'
     };
     ```
   * Entrar a `frontend/` y servir la carpeta con un servidor local:
     ```bash
     cd frontend
     python3 -m http.server 5500
     ```
   * Abrir `http://localhost:5500` en el navegador.

## 7. Documentación de la API
La API REST (Flask) expone el siguiente *endpoint* HTTP principal para la evaluación lógica:

* `POST /api/evaluar`: Valida la entrada, ejecuta el motor de inferencia en Prolog y devuelve el veredicto.
* `GET /`: Comprobación de salud (`{"estado": "ok"}`).

El formato de `tanque_capacidad` depende del tipo de tanque:

| `tanque_tipo` | `tanque_capacidad` |
|---|---|
| `acuatico` | Número (litros) |
| `terrestre_tropical`, `terrestre_desertico` | Número (cm²) |
| `mixto` | Objeto `{ "litros": L, "area": A }` |

**Ejemplo de Petición (JSON enviado por la UI):**
```json
{
  "especies": ["pez_oscar", "pez_guppy"],
  "tanque_tipo": "acuatico",
  "tanque_capacidad": 600
}
```

**Ejemplo de Petición para un tanque mixto:**
```json
{
  "especies": ["sapo_vientre_fuego", "corydora"],
  "tanque_tipo": "mixto",
  "tanque_capacidad": { "litros": 150, "area": 2000 }
}
```

**Ejemplo de Respuesta (Generada por el motor Prolog a través de la API):**
```json
{
  "viable": false,
  "conflictos": [
    {
      "mensaje": "Riesgo de depredacion",
      "involucrados": ["pez_oscar", "pez_guppy"]
    }
  ]
}
```

**Errores:** Si los datos de entrada son incorrectos, la API responde con HTTP `400` y un cuerpo `{"error": "<mensaje>"}`; si falla la ejecución de Prolog, responde con HTTP `500`.

## 8. Ejemplos de Consultas y Resultados
Consulta directa al motor de inferencia en SWI-Prolog (sin servidor ni interfaz), desde la carpeta `backend/`:

```bash
swipl conocimiento/consultas.pl
```

```prolog
?- diagnostico([pez_oscar, pez_guppy], tanque(acuatico, litros(600)), C).
C = [conflicto('Riesgo de depredacion', involucrados(pez_oscar, pez_guppy))].

?- ecosistema_viable([pez_oscar, pez_guppy], tanque(acuatico, litros(600))).
false.

?- diagnostico([pez_guppy, tetra_neon, corydora, camaron_cereza], tanque(acuatico, litros(200)), C).
C = [].

?- diagnostico([goldfish, corydora, pez_guppy, tetra_neon], tanque(acuatico, litros(100)), C).
C = [conflicto('Falta de espacio (Hacinamiento)', involucrados(todos))].
```

* **Primera consulta:** El óscar es depredador (35 cm) y el guppy mide 6 cm, menos del 50 % de su tamaño, por lo que el motor reporta riesgo de depredación y `ecosistema_viable/2` falla.
* **Segunda consulta:** Un acuario de 200 L con cuatro especies pacíficas y compatibles devuelve una lista vacía de conflictos: el ecosistema es viable.
* **Tercera consulta:** Las cuatro especies suman 270 L de requerimiento y el tanque ofrece 100 L, por lo que se reporta hacinamiento.

La capacidad del tanque se expresa con el functor correspondiente a su tipo: `litros(L)`, `cm2(A)` o `litros_y_cm2(L, A)`. El mismo resultado se obtiene desde la API (sección 7) y desde la interfaz web.

## 9. Procedimiento de Despliegue
* **Backend:** Contenerizado con Docker (`Dockerfile`, que parte de `python:3.11-slim` con `swi-prolog` instalado vía `apt`) y desplegado como Web Service en la nube de Render. El servidor Flask se ejecuta con Gunicorn.
* **Frontend:** Alojado como sitio estático (Render Static Site), realizando peticiones mediante Fetch API al backend contenerizado. La URL del backend se configura en `frontend/config.js`.

## 10. Pruebas y Validación
El sistema ha sido validado contra 10 casos de prueba rigurosos (positivos, negativos, y de límites), ejecutados en 3 niveles: **Motor** (consultas directas a Prolog), **API** (peticiones HTTP) y **Web** (interfaz de usuario). Además, se documentan 12 pruebas de validación de entradas de la API (`PA-1` a `PA-12`). La documentación completa de las pruebas se encuentra en: [docs/casos_de_prueba.md](docs/casos_de_prueba.md)

## 11. Declaración de Uso de Inteligencia Artificial
En estricto cumplimiento de las reglas de integridad académica, **ningún hecho, regla lógica o predicado del motor de inferencia (`hechos.pl`, `reglas.pl` y `consultas.pl`) ha sido generado o reescrito por IA**. Las herramientas de Inteligencia Artificial se utilizaron de manera asistida y declarada exclusivamente para: Estructurar la arquitectura, apoyar en comandos de Git, redactar el Dockerfile, desarrollar la API REST en Python (Flask) y el puente JSON en Prolog (`evaluar.pl`), y orientar en el uso de la Fetch API de JavaScript.

## 12. Referencias
* [Documentación oficial de SWI-Prolog](https://www.swi-prolog.org/pldoc/doc_for?object=manual)
* [FishBase](https://www.fishbase.se/) - Base de datos global de especies de peces (utilizada para rangos de pH, temperatura y tamaño).
* [Seriously Fish](https://www.seriouslyfish.com/) - Portal de acuarismo avanzado (utilizado para compatibilidad de temperamentos y requerimientos de espacio).
* **RequerimientosProyecto1.pdf** - Lineamientos académicos proporcionado por la Dra. Morales Rodriguez Ursula Samantha de la Academia de Paradigmas de Programación de la ESCOM.

## WHISPER...

🦖🌿 *"La vida siempre se abre camino."*  

**~By Dr. Ian Malcolm (Jurassic Park)** ✨

---

***Repositorio mantenido por MAVV y NISO.*** 🫰

</div>