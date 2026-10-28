% ==============================================================================
%  evaluar.pl - Puente entre el servidor Python y el motor del sistema experto.
%  Imprime en la salida estandar el resultado de la evaluacion como JSON.
%
%  Uso (lo invoca servidor.py):
%      swipl -q -g "evaluar_json([pez_oscar, pez_guppy], tanque(acuatico, litros(600)))" \
%            -t halt evaluar.pl
%
%  Colocalo junto a servidor.py y a la carpeta 'conocimiento/'.
% ==============================================================================

:- use_module(library(http/json)).
:- ensure_loaded('conocimiento/consultas.pl').

% evaluar_json(+Especies, +Tanque)
% Si alguna especie no existe en hechos.pl responde con un error (evita un
% falso "viable" por ids mal escritos); si no, imprime viabilidad y conflictos.
evaluar_json(Especies, Tanque) :-
    (   member(E, Especies),
        \+ especie(E, _, _, _, _, _, _, _, _, _, _, _)
    ->  Resultado = _{error: "Especie desconocida", especie: E}
    ;   diagnostico(Especies, Tanque, Conflictos),
        (   ecosistema_viable(Especies, Tanque)
        ->  Viable = true
        ;   Viable = false
        ),
        maplist(conflicto_a_dict, Conflictos, ConflictosDict),
        Resultado = _{viable: Viable, conflictos: ConflictosDict}
    ),
    json_write_dict(current_output, Resultado, [width(0)]),
    nl.

% conflicto(Mensaje, involucrados(a, b)) -> {"mensaje": ..., "involucrados": ["a", "b"]}
conflicto_a_dict(conflicto(Mensaje, Involucrados),
                 _{mensaje: Mensaje, involucrados: Lista}) :-
    Involucrados =.. [involucrados | Lista].