# 🌍 Sistema Experto: Arquitecto de Ecosistemas (Acuarios, Terrarios y Paludarios)

**Práctica integradora 1er Parcial - Paradigmas de Programación**  
**Escuela Superior de Cómputo (ESCOM) - IPN**

## 1. Descripción del Proyecto y Problema que Resuelve
El **Arquitecto de Ecosistemas** es un sistema experto basado en programación lógica (Prolog) diseñado para prevenir desastres biológicos en entornos cerrados. 

**El Problema:** Las personas que inician en el acuarismo y la herpetología suelen mezclar peces, anfibios y reptiles basándose únicamente en la estética. Ignoran incompatibilidades críticas como diferencias de pH, humedad, riesgos de depredación o territorialidad, lo que resulta en el colapso del ecosistema.

**La Solución:** Este sistema no es una simple base de datos, ya que, utiliza un motor de inferencia lógica para evaluar múltiples parámetros ambientales y de comportamiento, deduciendo si una combinación específica de especies es viable y generando explicaciones detalladas de los conflictos biológicos.

## 2. Integrantes y Contribuciones
* **Valencia Villanueva Adrian (MAVV):** Diseño de reglas de inferencia en Prolog, configuración de Docker y despliegue del backend.
* **Vazquez Guillen Nina Sofia (NISO):** Desarrollo de la interfaz gráfica frontend, investigación biológica y diseño de la API HTTP.

## 3. Demo Pública
🔗 **[URL Pública de la Aplicación en Producción]** *(Se actualizará al completar el despliegue)*

## 4. Arquitectura del Sistema
El sistema separa claramente la capa de presentación de la capa de razonamiento lógico:

1. **Frontend (Vercel):** Interfaz web ligera en HTML/CSS/JS puro. Captura los parámetros del hábitat y las especies deseadas.
2. **Capa de Integración (API HTTP):** El servidor embebido de SWI-Prolog recibe la petición en formato JSON y la traduce a predicados lógicos, previniendo inyección de código.
3. **Motor de Inferencia (Render/Docker):** Los archivos `.pl` evalúan las reglas (unificación y backtracking) para encontrar conclusiones y generar una respuesta justificada.

## 5. Estructura de Carpetas
```text
📦 arquitecto-ecosistemas
 ┣ 📂 backend/
 ┃ ┣ 📂 conocimiento/
 ┃ ┃ ┣ 📜 hechos.pl          # Base de conocimientos (Especies, parámetros)
 ┃ ┃ ┣ 📜 reglas.pl          # Reglas lógicas de compatibilidad e inferencia
 ┃ ┃ ┗ 📜 consultas.pl       # Predicados de entrada para la API
 ┃ ┣ 📜 servidor.pl          # Servidor HTTP/JSON de Prolog
 ┃ ┗ 📜 Dockerfile           # Contenedor para despliegue
 ┣ 📂 frontend/ 
 ┃ ┣ 📜 index.html           # Interfaz de usuario
 ┃ ┣ 📜 styles.css           # Estilos de la interfaz
 ┃ ┣ 📜 app.js               # Lógica de cliente y Fetch API
 ┃ ┗ 📜 config.js            # Variables de entorno y URL del servidor
 ┣ 📂 docs/ 
 ┃ ┣ 📂 capturas/            # Evidencias visuales
 ┃ ┣ 📜 casos_de_prueba.md   # Pruebas documentadas
 ┃ ┗ 📜 documento_tecnico.md # Entregable escrito
 ┣ 📜 .gitignore             # Exclusión de archivos basura
 ┗ 📜 README.md              # Documentación principal
 ```
## 6. Instalación y Ejecución Local

**Requisitos Previos:**
* [SWI-Prolog](https://www.swi-prolog.org/) (v9.x+)
* Navegador Web moderno

**Pasos para ejecutar:**
1. Clonar el repositorio: `git clone https://github.com/M4VVii/Sistema-Experto-Ecosistemas.git`
2. Levantar el motor lógico (Backend):
   * Navegar a la carpeta `backend/`
   * Ejecutar: `swipl servidor.pl`
   * El servidor iniciará en `http://localhost:8080`
3. Levantar la interfaz (Frontend):
   * Abrir el archivo `frontend/index.html` en cualquier navegador web. Alternativamente, usar un servidor local como *Live Server* en VS Code.

## 7. Documentación de la API
El sistema experto expone los siguientes *endpoints* HTTP:

* `GET /salud`: Verifica el estado del servidor.
* `GET /api/especies`: Devuelve la lista de especies disponibles (leídas directamente de los hechos lógicos).
* `POST /api/evaluar`: Ejecuta el motor de inferencia.

**Ejemplo de Petición:**
```json
{
  "habitat": "paludario",
  "litros_agua": 120,
  "cm2_tierra": 600,
  "especies": ["pez_guppy", "rana_flecha"]
}
```

**Ejemplo de Respuesta:**
```json
{
  "veredicto": "conflicto_parametros",
  "razones": [
    {
      "regla": "incompatibilidad_ph",
      "especies": ["pez_guppy", "rana_flecha"],
      "detalle": "Los rangos de pH no tienen intersección viable."
    }
  ]
}
```

## 8. Ejemplos de Consultas y Resultados
* *(Sección en construcción: Se agregarán capturas del backtracking de SWI-Prolog en la consola y respuestas de la interfaz durante la Fase 1 y 3)*.

## 9. Procedimiento de Despliegue
* **Backend:** Contenerizado con Docker (`Dockerfile`) y desplegado como Web Service en plataformas compatibles con contenedores (Render / Railway).
* **Frontend:** Alojado como sitio estático en Vercel, realizando peticiones mediante Fetch API al backend contenerizado.

## 10. Pruebas y Validación
El sistema ha sido validado contra 10 casos de prueba rigurosos (positivos, negativos, y de límites). La documentación completa de las pruebas en consola e interfaz pública se encuentra en:  
👉 [docs/casos_de_prueba.md](docs/casos_de_prueba.md)

## 11. Declaración de Uso de Inteligencia Artificial
En estricto cumplimiento de las reglas de integridad académica, **ningún hecho, regla lógica o predicado del motor de inferencia en `.pl` ha sido generado o reescrito por IA**. Las herramientas de Inteligencia Artificial (Claude, Gemini) se utilizaron de manera asistida y declarada exclusivamente para: Estructurar, apoyar en comandos de Git, redactar el Dockerfile y orientar en el uso de la Fetch API de JavaScript.

## 12. Referencias
* [Documentación oficial de SWI-Prolog](https://www.swi-prolog.org/pldoc/doc_for?object=manual)
* [FishBase](https://www.fishbase.se/) - Base de datos global de especies de peces (utilizada para rangos de pH, temperatura y tamaño).
* [Seriously Fish](https://www.seriouslyfish.com/) - Portal de acuarismo avanzado (utilizado para compatibilidad de temperamentos y requerimientos de espacio).
* **RequerimientosProyecto1.pdf** - Lineamientos académicos proporcionado por la Dra. Morales Rodriguez Ursula Samantha de la Academia de Paradigmas de Programación de la ESCOM.

## WHISPER...

👁️‍🗨️ *¿Qué es el duelo, sino el amor perseverando?*  

**~By Visión (WandaVision)** ✨

---

***Repositorio mantenido por MAVV y NISO.*** 🫰