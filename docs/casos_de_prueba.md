# Casos de Prueba — Arquitecto de Ecosistemas

**Proyecto:** Sistema experto en Prolog para evaluar la convivencia de especies en un mismo hábitat.  

**Alcance:** 10 escenarios de prueba sobre la base de conocimientos de 24 especies.  

**Tipo de pruebas:** Caja negra (entrada → veredicto esperado)

## Criterios de referencia usados para derivar los resultados esperados

Los resultados esperados de este documento se calcularon con los siguientes criterios:

* **Ejemplares:** Se introduce **un ejemplar adulto por especie**, salvo que se indique otra cosa.
* **Temperatura:** Las especies son compatibles si sus rangos `temp_min`–`temp_max` tienen intersección. La temperatura de operación del hábitat es esa intersección.
* **pH:** Misma lógica de intersección. Un valor `na` significa "no aplica" (especie terrestre pura) y se ignora.
* **Humedad:** Misma lógica de intersección. Un valor `na` significa "no aplica" (especie acuática pura) y se ignora.
* **Espacio:** El sistema extraerá el valor numérico de los functores (`litros`, `cm2` o `litros_y_cm2`). El volumen/área del hábitat debe ser mayor o igual a la suma de estos requerimientos.
* **Depredación:** Hay conflicto cuando una especie `depredador` comparte hábitat con otra de `tamano_max_cm` lo bastante pequeño como para ser presa (cabe en su boca).
* **Territorialidad:** Hay conflicto cuando dos especies `territorial` comparten el mismo espacio.
* **Tipos de tanque:** acuario = hábitat `acuatico`; terrario = hábitat `terrestre_tropical` o `terrestre_desertico`; paludario = hábitat `mixto`.

## Resumen de casos

| # | Nombre | Categoría | Veredicto esperado |
|---|--------|-----------|--------------------|
| 1 | Acuario comunitario de especies pequeñas | Viable | Ecosistema viable |
| 2 | Terrario tropical húmedo | Viable | Ecosistema viable |
| 3 | Paludario con zona acuática y terrestre | Viable | Ecosistema viable |
| 4 | Óscar y guppy | Depredación | Conflicto biológico |
| 5 | Ajolote y camarón cereza | Depredación | Conflicto biológico |
| 6 | Betta y cíclido convicto | Territorialidad | Conflicto biológico |
| 7 | Uromastyx y anolis verde | Hábitat / humedad | Incompatibilidad de parámetros |
| 8 | Iguana verde y salamandra tigre | Temperatura | Incompatibilidad de parámetros |
| 9 | Acuario comunitario sobrepoblado | Hacinamiento | Espacio insuficiente |
| 10 | Terrario desértico reducido | Hacinamiento | Espacio insuficiente |

### Caso de Prueba 1: Acuario comunitario de especies pequeñas
* **Objetivo:** Verificar que el sistema acepta un ecosistema acuático con varias especies pacíficas cuyos rangos de temperatura y pH se cruzan en una franja estrecha, y que calcula correctamente los parámetros de operación del tanque.
* **Entrada Simulada:**
  * Especies: `pez_guppy`, `tetra_neon`, `corydora`, `camaron_cereza` (1 ejemplar de cada una).
  * Tipo de hábitat del tanque: `acuatico` (acuario).
  * Tamaño: 200 litros (por ejemplo, 100 × 40 × 50 cm).
* **Resultado Lógico Esperado:** **Ecosistema viable.**
  * Temperatura común: 22–26 °C (límite inferior del guppy y la corydora, límite superior del tetra y la corydora).
  * pH común: 6.8–7.0 (límite inferior del guppy, límite superior del tetra neón). La franja es estrecha pero existe.
  * Espacio: Requiere 140 L (20 + 40 + 60 + 20) y el tanque ofrece 200 L.
  * Temperamento: Las cuatro especies son `pacifico` y la más grande mide 7 cm, así que no hay riesgo de depredación ni territorialidad.

> **Evidencia:** [Insertar captura de pantalla de la evaluación en Prolog o Interfaz Web aquí]

### Caso de Prueba 2: Terrario tropical húmedo
* **Objetivo:** Verificar que el sistema acepta un terrario con especies terrestres tropicales de distinta clase (anfibio y reptil) y que ignora el pH (valor `0`) al evaluar especies terrestres puras.
* **Entrada Simulada:**
  * Especies: `rana_ojos_rojos`, `gecko_crestado` (1 ejemplar de cada una).
  * Tipo de hábitat del tanque: `terrestre_tropical` (terrario).
  * Tamaño: 250 litros (por ejemplo, 100 × 50 × 50 cm; base de 5,000 cm²).
* **Resultado Lógico Esperado:** **Ecosistema viable.**
  * Temperatura Común: 22–27 °C.
  * Humedad común: 70–80 %.
  * pH: No se evalúa, porque ambas especies tienen `na`.
  * Espacio: Requiere 205 L (130 + 75) y el terrario ofrece 250 L.
  * Temperamento: Ambas son `pacifico`.

> **Evidencia:** [Insertar captura de pantalla de la evaluación en Prolog o Interfaz Web aquí]

### Caso de Prueba 3: Paludario con zona acuática y terrestre
* **Objetivo:** Verificar el manejo de una especie de hábitat `mixto` (que exige pH y humedad) combinada con una especie acuática pura (humedad `0`), validando que cada parámetro se evalúa solo donde aplica.
* **Entrada Simulada:**
  * Especies: `sapo_vientre_fuego`, `corydora` (1 ejemplar de cada una).
  * Tipo de hábitat del tanque: `mixto` (paludario).
  * Tamaño: 150 litros (por ejemplo, 100 × 40 × 40 cm, con zona acuática y zona terrestre).
* **Resultado Lógico Esperado:** **Ecosistema viable.**
  * Temperatura Común: 22–24 °C (límite inferior de la corydora, límite superior del sapo).
  * pH común: 6.5–7.5 en la zona acuática.
  * Humedad: 60–80 %, exigida solo por el sapo; la corydora tiene `0` y no aplica.
  * Espacio: Requiere 100 L (40 + 60) y el paludario ofrece 150 L.
  * Temperamento: Ambas son `pacifico`, y la corydora (7 cm) es más grande que el sapo (5 cm), así que no hay riesgo de depredación.

> **Evidencia:** [Insertar captura de pantalla de la evaluación en Prolog o Interfaz Web aquí]

### Caso de Prueba 4: Óscar y guppy
* **Objetivo:** Verificar que el sistema detecta un conflicto de depredación cuando un pez grande comparte tanque con uno que cabe en su boca, aunque temperatura, pH y espacio sean compatibles.
* **Entrada Simulada:**
  * Especies: `pez_oscar`, `pez_guppy` (1 ejemplar de cada una).
  * Tipo de hábitat del tanque: `acuatico` (acuario).
  * Tamaño: 600 litros (por ejemplo, 180 × 60 × 55 cm).
* **Resultado Lógico Esperado:** **Conflicto biológico (depredación).**
  * El óscar es `depredador` y alcanza 35 cm; el guppy es `pacifico` y mide 6 cm, por lo que es presa potencial.
  * Los demás parámetros sí son compatibles (temperatura 22–28 °C, pH 6.8–7.5, espacio 420 L requeridos de 600 L disponibles). El único motivo del rechazo se debe a la depredación.
  * Biológicamente, el óscar es un cíclido carnívoro oportunista que se alimenta de peces pequeños.

> **Evidencia:** [Insertar captura de pantalla de la evaluación en Prolog o Interfaz Web aquí]

### Caso de Prueba 5: Ajolote y camarón cereza
* **Objetivo:** Verificar que la detección de depredación funciona también con un anfibio acuático y un invertebrado, y que no depende de que ambos sean peces.
* **Entrada Simulada:**
  * Especies: `ajolote`, `camaron_cereza` (1 ejemplar de cada una).
  * Tipo de hábitat del tanque: `acuatico` (acuario).
  * Tamaño: 250 litros (por ejemplo, 100 × 50 × 50 cm).
* **Resultado Lógico Esperado:** **Conflicto biológico (depredación).**
  * El ajolote es `depredador` (hasta 30 cm) y el camarón cereza es `pacifico` (4 cm), presa potencial.
  * Los parámetros sí se cruzan (temperatura 18–20 °C, pH 6.5–8.0, espacio 170 L requeridos de 250 L disponibles). El rechazo se debe solo a la depredación.
  * Biológicamente, el ajolote es carnívoro y captura con succión cualquier presa pequeña que encuentre.

> **Evidencia:** [Insertar captura de pantalla de la evaluación en Prolog o Interfaz Web aquí]

### Caso de Prueba 6: Betta y cíclido convicto
* **Objetivo:** Verificar que el sistema detecta un conflicto por territorialidad entre dos especies que defienden espacio, aunque el tanque sea amplio y los parámetros coincidan.
* **Entrada Simulada:**
  * Especies: `pez_betta`, `ciclido_convicto` (1 ejemplar de cada una).
  * Tipo de hábitat del tanque: `acuatico` (acuario).
  * Tamaño: 300 litros (por ejemplo, 120 × 50 × 50 cm).
* **Resultado Lógico Esperado:** **Conflicto biológico (territorialidad).**
  * Ambas especies son `territorial`. El convicto (15 cm) es más grande y agresivo que el betta (7 cm), así que el betta saldría perjudicado.
  * Los demás parámetros son compatibles (temperatura 24–28 °C, pH 6.5–7.5, espacio 170 L requeridos de 300 L disponibles). El rechazo se debe solo a la territorialidad.

> **Evidencia:** [Insertar captura de pantalla de la evaluación en Prolog o Interfaz Web aquí]

### Caso de Prueba 7: Uromastyx y anolis verde
* **Objetivo:** Verificar que el sistema rechaza la mezcla de una especie desértica con una tropical cuando la temperatura sí coincide pero la humedad no, de modo que se aísle la incompatibilidad de hábitat.
* **Entrada Simulada:**
  * Especies: `uromastyx` (`terrestre_desertico`), `anolis_verde` (`terrestre_tropical`), 1 ejemplar de cada una.
  * Tipo de hábitat del tanque: terrario.
  * Tamaño: 600 litros (por ejemplo, 150 × 60 × 67 cm).
* **Resultado Lógico Esperado:** **Incompatibilidad de parámetros (hábitat y humedad).**
  * Las temperaturas sí se cruzan (27–30 °C), por lo que ese parámetro no es el motivo del rechazo.
  * Humedad: El uromastyx requiere 10–20 % y el anolis 60–80 %. No hay intersección posible.
  * Los tipos de hábitat son distintos (`terrestre_desertico` frente a `terrestre_tropical`).
  * El espacio alcanza (525 L requeridos de 600 L disponibles) y se evalúa un solo anolis, así que no hay conflicto de territorialidad.
  * Biológicamente, un uromastyx en humedad alta sufre problemas respiratorios y de piel; un anolis en ambiente árido se deshidrata.

> **Evidencia:** [Insertar captura de pantalla de la evaluación en Prolog o Interfaz Web aquí]

### Caso de Prueba 8: Iguana verde y salamandra tigre
* **Objetivo:** Verificar que el sistema detecta un choque de temperaturas (rangos sin intersección) aunque la humedad y el espacio sean compatibles.
* **Entrada Simulada:**
  * Especies: `iguana_verde` (`terrestre_tropical`), `salamandra_tigre` (`mixto`), 1 ejemplar de cada una.
  * Tipo de hábitat del tanque: terrario.
  * Tamaño: 5,000 litros (recinto de 250 × 200 × 100 cm).
* **Resultado Lógico Esperado:** **Incompatibilidad de parámetros (temperatura).**
  * La iguana requiere 24–32 °C y la salamandra 15–22 °C. Hay una brecha de 2 °C entre el máximo de la salamandra y el mínimo de la iguana, así que no existe una temperatura que sirva a ambas.
  * La humedad sí se cruza (70–80 %) y el espacio alcanza (4,075 L requeridos de 5,000 L disponibles). El rechazo se debe solo a la temperatura.
  * La salamandra es `depredador`, pero la iguana mide 180 cm y no es presa, así que no debe reportarse depredación.
  * Biológicamente, la salamandra tigre sufre estrés térmico por encima de unos 22 °C, mientras que la iguana necesita calor sostenido para digerir y regular su metabolismo.

> **Evidencia:** [Insertar captura de pantalla de la evaluación en Prolog o Interfaz Web aquí]

### Caso de Prueba 9: Acuario comunitario sobrepoblado
* **Objetivo:** Verificar que el sistema detecta hacinamiento por la suma de espacios mínimos cuando todas las especies son pacíficas y sus parámetros son compatibles.
* **Entrada Simulada:**
  * Especies: `goldfish`, `corydora`, `pez_guppy`, `tetra_neon` (1 ejemplar de cada una).
  * Tipo de hábitat del tanque: `acuatico` (acuario).
  * Tamaño: 100 litros (100 × 40 × 25 cm; base de 4,000 cm²).
* **Resultado Lógico Esperado:** **Espacio insuficiente (hacinamiento).**
  * Requerido: 270 L (150 + 60 + 20 + 40). Disponible: 100 L, con un déficit de 170 L.
  * Los parámetros sí son compatibles (temperatura 22–24 °C, pH 6.8–7.0) y las cuatro especies son `pacifico`. El rechazo se debe solo al volumen.
  * Biológicamente, el goldfish adulto llega a 30 cm y produce mucho desecho; en poco volumen el amoníaco se acumula y estresa al resto de las especies.

> **Evidencia:** [Insertar captura de pantalla de la evaluación en Prolog o Interfaz Web aquí]

### Caso de Prueba 10: Terrario desértico reducido
* **Objetivo:** Verificar que el sistema detecta hacinamiento en un terrario, incluso cuando el volumen ya es insuficiente para la especie más exigente por sí sola.
* **Entrada Simulada:**
  * Especies: `dragon_barbudo`, `gecko_leopardo` (1 ejemplar de cada una).
  * Tipo de hábitat del tanque: `terrestre_desertico` (terrario).
  * Tamaño: 300 litros (100 × 60 × 50 cm; base de 6,000 cm²).
* **Resultado Lógico Esperado:** **Espacio insuficiente (hacinamiento).**
  * Requerido: 560 L (450 + 110). Disponible: 300 L, con un déficit de 260 L.
  * El dragón barbudo, por sí solo, ya requiere 450 L, más de lo que ofrece el terrario.
  * Los parámetros sí son compatibles (temperatura 24–32 °C, humedad 30–40 %) y ambas especies son `pacifico`. El rechazo se debe solo al volumen.
  * Biológicamente, el espacio reducido impide crear el gradiente térmico (zona de asoleo y zona fría) que necesitan los reptiles desérticos para termorregular.

> **Evidencia:** [Insertar captura de pantalla de la evaluación en Prolog o Interfaz Web aquí]

## Notas

* Estos casos validan la **lógica del sistema sobre los datos de la base de conocimientos**. No sustituyen el criterio de un acuaterariófilo experto.
* Los casos 2 y 3 salen viables según los parámetros de los hechos, pero en la práctica se desaconseja mezclar anfibios con reptiles o con peces en un mismo recinto debido a las toxinas cutáneas, patógenos y estrés. Ya que este proyecto tiene limitaciónes,porque solo considera temperatura, pH, humedad, espacio, tamaño y temperamento.
* Cada caso aísla **un solo motivo de rechazo** para que, si una prueba falla, sea fácil identificar qué parte de las reglas la causó.
* Los volúmenes y dimensiones del tanque son ejemplos, lo que importa para la prueba es el volumen en litros.