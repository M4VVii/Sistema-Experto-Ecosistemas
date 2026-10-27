/*  ______________________________________________________________________________
    |                                                                            |
    |                       INSTITUTO POLITÉCNICO NACIONAL                       |
    |                        ESCUELA SUPERIOR DE CÓMPUTO                         |
    |                                                                            |
    |                  Asignatura: Paradigmas de Programación                    |
    |                  Práctica N°: 1                                            |
    |                  Docente: Dra. Morales Rodriguez Ursula Samantha           |
    |                                                                            |
    |   TÍTULO: Sistema Experto - Arquitecto de Ecosistemas.                     |
    |           Orquestador y Diagnóstico (consultas.pl).                        |
    |                                                                            |
    |   ALUMNOS:                                                                 |
    |    - Valencia Villanueva Adrian                                            |
    |    - Nina Sofía Vazquez Guillen                                            |
    |____________________________________________________________________________|
    |                                                                            |
    |   DESCRIPCIÓN Y DISEÑO LÓGICO DEL ORQUESTADOR:                             |
    |                                                                            |
    |   1. Dependencias: Carga automáticamente el archivo 'reglas.pl', el cual   |
    |      a su vez hereda la base de conocimientos 'hechos.pl'.                 |
    |                                                                            |
    |   2. Catálogo Dinámico: Utiliza el predicado 'regla/3' para centralizar    |
    |      las validaciones (par, individual o global) y sus mensajes de error.  |
    |                                                                            |
    |   3. Meta-programación: Emplea 'call' para ejecutar dinámicamente las      |
    |      reglas de conflicto basándose en el catálogo, aislando la lógica.     |
    |                                                                            |
    |   4. Recolección de Datos: Implementa 'findall' para recopilar todos los   |
    |      fallos de compatibilidad en un solo escaneo para el frontend.         |
    |                                                                            |
    |   5. Veredicto Final: El predicado 'ecosistema_viable' aplica la negación  |
    |      por fallo (\+) para certificar que el entorno es 100% seguro.         |
    |____________________________________________________________________________|
*/

% Carga las reglas y la base de conocimiento.
:- ensure_loaded(reglas).

% ORQUESTADOR Y DIAGNÓSTICO

% Generador de combinaciones únicas. 
% Parte la lista original para extraer dos especies distintas (E1 y E2).
% Evita que Prolog compare a un pez consigo mismo (A,A) o que duplique 
% evaluaciones invirtiendo el orden (evaluar A,B y luego B,A).
pareja_de_lista(E1, E2, Lista) :-
    append(_, [E1 | Resto], Lista),
    member(E2, Resto).

% Catálogo del sistema experto (Base de conocimiento).
% Define qué reglas existen, de qué tipo son y qué mensaje de error lanzan.
% Las reglas nuevas, solo se anotan aquí y el sistema la integra.
regla(par, conflicto_territorial_agresion, 'Conflicto por agresion o territorialidad').
regla(par, conflicto_termico, 'Incompatibilidad de temperatura').
regla(par, conflicto_quimico, 'Incompatibilidad de pH o humedad').
regla(par, conflicto_depredacion, 'Riesgo de depredacion').
regla(individual, conflicto_habitat, 'Especie incompatible con el tipo de tanque').
regla(global, conflicto_hacinamiento, 'Falta de espacio (Hacinamiento)').

% Evaluador. Usa "call" para ejecutar reglas a partir de su nombre.
% Caso 1: Reglas de pares (evalúan especies de dos en dos).
evaluar_conflicto(Lista, _, NombreRegla, involucrados(E1, E2)) :-
    regla(par, NombreRegla, _),
    pareja_de_lista(E1, E2, Lista),
    call(NombreRegla, E1, E2). % Ejecuta dinámicamente la regla almacenada en la variable NombreRegla.

% Caso 2: Reglas individuales (evalúan una especie contra el entorno).
evaluar_conflicto(Lista, Tanque, NombreRegla, involucrados(E1)) :-
    regla(individual, NombreRegla, _),
    member(E1, Lista),
    call(NombreRegla, E1, Tanque).

% Caso 3: Reglas globales (evalúan toda la lista junta, como el hacinamiento).
evaluar_conflicto(Lista, Tanque, NombreRegla, involucrados(todos)) :-
    regla(global, NombreRegla, _),
    call(NombreRegla, Lista, Tanque).

% Recolector de errores.
% findall ejecuta evaluar_conflicto repetidamente hasta agotar las combinaciones,
% guardando cada fallo (Mensaje + Involucrados) en la lista ConflictosBrutos.
% sort elimina cualquier error duplicado y entrega la ListaConflictos limpia.
diagnostico(Lista, Tanque, ListaConflictos) :-
    findall(
        conflicto(Mensaje, Involucrados),
        (evaluar_conflicto(Lista, Tanque, Regla, Involucrados), regla(_, Regla, Mensaje)),
        ConflictosBrutos
    ),
    sort(ConflictosBrutos, ListaConflictos).

% Regla de viabilidad.
% El ecosistema es viable ÚNICAMENTE SI el evaluador de conflictos no logra encontrar ningún error.
ecosistema_viable(ListaEspecies, Tanque) :-
    \+ evaluar_conflicto(ListaEspecies, Tanque, _, _).