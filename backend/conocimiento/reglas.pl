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
    |           Motor de Inferencia y Reglas de Inferencia (reglas.pl).          |
    |                                                                            |
    |   ALUMNOS:                                                                 |
    |    - Valencia Villanueva Adrian                                            |
    |    - Nina Sofía Vazquez Guillen                                            |
    |____________________________________________________________________________|
    |                                                                            |
    |   ARQUITECTURA Y DISEÑO LÓGICO DEL MOTOR DE INFERENCIA, osea las REGLAS):  |
    |                                                                            |
    |   1. Carga Automática: Importación automática de hechos mediante:          |
    |      :- ensure_loaded(hechos).                                             |
    |                                                                            |
    |   2. Abstracción por Accesores: Encapsulamiento de la aridad de            |
    |      especie/12 para aislar las reglas de cambios estructurales en la BD.  |
    |                                                                            |
    |   3. Evaluación Ambiental y Manejo de 'na': Intersección de rangos numé-   |
    |      ricos (temperatura, pH, humedad) con guardas numéricas para ignorar   |
    |      átomos nulos sin generar errores de instanciación.                    |
    |                                                                            |
    |   4. Lógica de Comportamiento: Reglas de depredación basadas en escala     |
    |      de tamaño (proporción depredador/presa), territorialidad y agresión.  |
    |                                                                            |
    |   5. Normalización de Espacio: Patrón de emparejamiento sobre functores    |
    |      litros/1, cm2/1 y litros_y_cm2/2 para acumulados de hacinamiento.     |
    |____________________________________________________________________________|
*/

% Carga los hechos de la base de conocimiento.
:- ensure_loaded(hechos).

/*
ESTRUCTURA DE LOS HECHOS PARA ESPECIE/12:
    especie(id_nombre, clase, tipo_habitat, temp_min, temp_max, ph_min, ph_max,
            humedad_min, humedad_max, requerimiento_espacio, tamano_max_cm, temperamento).
*/


% Accesores para encapsular la aridad de especie/12 y aislar cambios estructurales en la BD.

temperamento(Id_nombre, Temperamento) :-
    especie(Id_nombre, _, _, _, _, _, _, _, _, _, _, Temperamento).

habitat(Id_nombre, Tipo_habitat) :-
    especie(Id_nombre, _, Tipo_habitat, _, _, _, _, _, _, _, _, _).

tamano(Id_nombre, Tamano_max_cm) :-
    especie(Id_nombre, _, _, _, _, _, _, _, _, _, Tamano_max_cm, _).

espacio(Id_nombre, Requerimiento_espacio) :-
    especie(Id_nombre, _, _, _, _, _, _, _, _, Requerimiento_espacio, _, _).

temperatura(Id_nombre, Temp_min, Temp_max) :-
    especie(Id_nombre, _, _, Temp_min, Temp_max, _, _, _, _, _, _, _).

ph(Id_nombre, Ph_min, Ph_max) :-
    especie(Id_nombre, _, _, _, _, Ph_min, Ph_max, _, _, _, _, _).

humedad(Id_nombre, Humedad_min, Humedad_max) :-
    especie(Id_nombre, _, _, _, _, _, _, Humedad_min, Humedad_max, _, _, _).


% Regla auxiliar que determina si dos rangos no se intersectan.

% Escenario 1: El máximo del primero es menor que el mínimo del segundo
sin_interseccion(_, Max1, Min2, _) :-
    Max1 < Min2.
% Escenario 2: El máximo del segundo es menor que el mínimo del primero
sin_interseccion(Min1, _, _, Max2) :-
    Max2 < Min1.


% Tabla de verdad de combinaciones permitidas (Tanque, Especie)
habitat_compatible(acuatico, acuatico).
habitat_compatible(terrestre_tropical, terrestre_tropical).
habitat_compatible(terrestre_desertico, terrestre_desertico).
habitat_compatible(mixto, mixto).
habitat_compatible(mixto, terrestre_tropical).
habitat_compatible(mixto, acuatico).


% Normalización de espacio: normalizar_espacio(Functor, Litros, Area)
% Caso 1: Si solo tiene litros, el área es 0
normalizar_espacio(litros(L), L, 0).

% Caso 2: Si solo tiene cm2, los litros son 0
normalizar_espacio(cm2(A), 0, A).

% Caso 3: Si es mixto, extrae ambos valores directamente
normalizar_espacio(litros_y_cm2(L, A), L, A).


% Detección de conflictos de compatibilidad de temperamento entre especies.

conflicto_territorial_agresion(Id_nombre1, Id_nombre2) :-
    temperamento(Id_nombre1, territorial),
    temperamento(Id_nombre2, territorial).  

conflicto_territorial_agresion(Id_nombre1, _) :-
    temperamento(Id_nombre1, agresivo).

conflicto_territorial_agresion(_, Id_nombre2) :-
    temperamento(Id_nombre2, agresivo).


% Detección de conflicto por hábitat, recibe un Id_nombre y una estructura tanque(TipoTanque, Capacidad)

conflicto_habitat(Id_nombre, tanque(TipoTanque, _)) :-
    habitat(Id_nombre, HabitatEspecie),
    \+ habitat_compatible(TipoTanque, HabitatEspecie).


% Detección de conflictos de compatibilidad de temperatura entre especies.

conflicto_termico(Id_nombre1, Id_nombre2) :-
    temperatura(Id_nombre1, Min1, Max1),
    temperatura(Id_nombre2, Min2, Max2),
    sin_interseccion(Min1, Max1, Min2, Max2). % Predicado auxiliar para determinar si dos rangos no se intersectan.


% Detección de conflictos de compatibilidad de pH entre especies.
conflicto_quimico(Id_nombre1, Id_nombre2) :-
    ph(Id_nombre1, Min1, Max1),
    ph(Id_nombre2, Min2, Max2),
    number(Min1), number(Max1), number(Min2), number(Max2), % Verifica que los valores no sean 'na'
    sin_interseccion(Min1, Max1, Min2, Max2).


% Detección de conflictos de compatibilidad de humedad entre especies.
conflicto_quimico(Id_nombre1, Id_nombre2) :-
    humedad(Id_nombre1, Min1, Max1),
    humedad(Id_nombre2, Min2, Max2),
    number(Min1), number(Max1), number(Min2), number(Max2), % Verifica que los valores no sean 'na'
    sin_interseccion(Min1, Max1, Min2, Max2).


% Detección de conflictos de depredación entre especies. 
% Una presa es devorada si su tamaño es menor o igual al 50% del depredador

proporcion_presa(0.5).

conflicto_depredacion(Id_nombre1, Id_nombre2) :-
    se_come_a(Id_nombre1, Id_nombre2).
conflicto_depredacion(Id_nombre1, Id_nombre2) :-
    se_come_a(Id_nombre2, Id_nombre1).

se_come_a(Depredador, Presa) :-
    temperamento(Depredador, depredador),
    tamano(Depredador, TamanoDepredador),
    tamano(Presa, TamanoPresa),
    proporcion_presa(Prop),
    TamanoPresa =< TamanoDepredador * Prop.


% Detección de conflictos de compatibilidad de espacio entre especies (Hacinamiento).

% Predicado puente para que maplist pueda procesar cada especie
espacio_especie(Id_nombre, Litros, Area) :-
    espacio(Id_nombre, Requerimiento),
    normalizar_espacio(Requerimiento, Litros, Area).

% Regla principal de hacinamiento (evalúa toda la lista junta)
conflicto_hacinamiento(ListaEspecies, tanque(_, CapacidadTanque)) :-
    % 1. maplist recorre la lista de especies y extrae dos listas nuevas: litros y áreas
    maplist(espacio_especie, ListaEspecies, ListaLitros, ListaAreas),
    
    % 2. Sumamos los elementos de cada lista para obtener los requerimientos totales
    sum_list(ListaLitros, TotalLitrosReq),
    sum_list(ListaAreas, TotalAreaReq),
    
    % 3. Normalizamos la capacidad que ofrece el tanque para poder compararla
    normalizar_espacio(CapacidadTanque, TanqueLitros, TanqueArea),
    
    % 4. Hay conflicto si los litros/área requerido son mayores a los del tanque
    (TotalLitrosReq > TanqueLitros ; TotalAreaReq > TanqueArea).