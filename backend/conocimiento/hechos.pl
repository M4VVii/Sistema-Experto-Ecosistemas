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
    |           Base de Conocimientos (hechos.pl).                               |
    |                                                                            |
    |   ALUMNOS:                                                                 |
    |    - Valencia Villanueva Adrian                                            |
    |    - Nina Sofía Vazquez Guillen                                            |
    |____________________________________________________________________________|
    |                                                                            |
    |   CRITERIOS DE CLASIFICACIÓN Y DISEÑO LÓGICO DE LOS HECHOS:                |
    |                                                                            |
    |   1. Valores Nulos (na): Para evitar errores matemáticos, los parámetros   |
    |      que no aplican (ej. pH en reptiles) se evalúan con el átomo 'na'.     |
    |                                                                            |
    |   2. Espacio: Se usan functores lógicos para unificar unidades: litros(L)  |
    |      para acuáticos, cm2(Area) para terrestres, y litros_y_cm2(L, Area)    |
    |      para hábitats mixtos.                                                 |
    |                                                                            |
    |   3. Temperaturas: Rangos en °C. En reptiles heliófilos el punto de        |
    |      asoleo será mayor al temp_max registrado aquí.                        |
    |                                                                            |
    |   4. Hábitats Mixtos: Especies que requieren agua y tierra tienen valores  |
    |      numéricos tanto en rangos de pH como en humedad.                      |
    |                                                                            |
    |   5. Clasificaciones: El camaleón y la serpiente del maíz se catalogaron   |
    |      como 'terrestre_tropical' por ser el entorno con variables más afines.|
    |                                                                            |
    |   6. Temperamentos:                                                        |
    |      - pacifico: Conviven sin problema con otras de tamaño similar.        |
    |      - territorial: Defienden su espacio (ej. betta, camaleón).            |
    |      - agresivo: Hostiles por naturaleza (ej. cíclido convicto).           |
    |      - depredador: Comerán lo que quepa en su boca (ej. óscar, tortuga).   |
    |____________________________________________________________________________|
*/

/*
ESTRUCTURA DE HECHOS:
    especie(id_nombre, clase, tipo_habitat, temp_min, temp_max, ph_min, ph_max,
            humedad_min, humedad_max, requerimiento_espacio, tamano_max_cm, temperamento).
*/

% Peces e Invertebrados (Acuáticos)
especie(pez_guppy,              pez,          acuatico, 22, 28, 6.8, 7.8,
        na, na, litros(20),  6,  pacifico).

especie(tetra_neon,             pez,          acuatico, 20, 26, 5.0, 7.0,
        na, na, litros(40),  4,  pacifico).

especie(corydora,               pez,          acuatico, 22, 26, 6.0, 7.8,
        na, na, litros(60),  7,  pacifico).

especie(camaron_cereza,         invertebrado, acuatico, 18, 28, 6.5, 8.0,
        na, na, litros(20),  4,  pacifico).

especie(pez_betta,              pez,          acuatico, 24, 28, 6.0, 7.5,
        na, na, litros(20),  7,  territorial).

especie(pez_oscar,              pez,          acuatico, 22, 28, 6.0, 7.5,
        na, na, litros(400), 35, depredador).

especie(ciclido_convicto,       pez,          acuatico, 22, 28, 6.5, 8.0,
      na, na, litros(150), 15, agresivo).

especie(pirana_vientre_rojo,    pez,          acuatico, 24, 28, 6.0, 7.5,
      na, na, litros(400), 30, depredador).

especie(goldfish,               pez,          acuatico, 15, 24, 6.5, 8.0,
      na, na, litros(150), 30, pacifico).


% Anfibios (Acuáticos y Mixtos)
especie(ajolote,                anfibio,      acuatico, 14, 20, 6.5, 8.0,
        na, na, litros(150), 30, depredador).

especie(rana_flecha,            anfibio,      terrestre_tropical, 22, 27, na,  na,
        80, 100, cm2(400),   5,  territorial).

especie(rana_ojos_rojos,        anfibio,      terrestre_tropical, 22, 28, na,  na,
        70, 90,  cm2(1300),  7,  pacifico).

especie(sapo_vientre_fuego,     anfibio,      mixto, 18, 24, 6.5, 7.5,
        60, 80,  litros_y_cm2(40, 400), 5, pacifico).

especie(salamandra_tigre,       anfibio,      mixto, 15, 22, 6.5, 7.5,
        70, 80,  litros_y_cm2(75, 750), 25, depredador).


% Reptiles (Mixtos y Terrestres)
especie(tortuga_orejas_rojas,   reptil,       mixto, 22, 28, 6.5, 8.0,
        50, 70,  litros_y_cm2(300, 3000), 30, depredador).

especie(iguana_verde,           reptil,       terrestre_tropical, 24, 32, na,  na,
        60, 80,  cm2(40000), 180, pacifico).

especie(gecko_crestado,         reptil,       terrestre_tropical, 22, 27, na,  na,
        60, 80,  cm2(750),   20,  pacifico).

especie(camaleon_velo,          reptil,       terrestre_tropical, 24, 29, na,  na,
       40, 60,  cm2(4500),  60,  territorial).

especie(anolis_verde,           reptil,       terrestre_tropical, 22, 30, na,  na,
        60, 80,  cm2(750),   20,  territorial).

especie(dragon_barbudo,         reptil,       terrestre_desertico, 24, 35, na,  na,
        30, 40,  cm2(4500),  55,  pacifico).

especie(gecko_leopardo,         reptil,       terrestre_desertico, 24, 32, na,  na,
        30, 40,  cm2(1100),  25,  pacifico).

especie(uromastyx,              reptil,       terrestre_desertico, 27, 40, na,  na,
        10, 20,  cm2(4500),  40,  pacifico).

especie(serpiente_maiz,         reptil,       terrestre_tropical, 22, 28, na,  na,
        40, 60,  cm2(1500),  150, depredador).

especie(piton_bola,             reptil,       terrestre_tropical, 25, 32, na,  na,
        50, 70,  cm2(2800),  150, depredador).