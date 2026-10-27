:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_json)).
:- use_module(library(http/http_cors)).
%:- use_module(library(settings)). CORRECCIÓN: Se carga explícitamente la librería de settings

% 1. Cargar el orquestador y la base de conocimiento
:- ensure_loaded('conocimiento/consultas.pl').

% 2. Configurar CORS para permitir que el frontend se conecte sin bloqueos
% CORRECCIÓN: Se usa set_setting_default y el asterisco entre comillas simples
%:- set_setting_default(http:cors, ['*']).

% 3. Definir la ruta web (Endpoint)
% Se acepta también OPTIONS, que es la petición previa (preflight) del navegador
:- http_handler('/api/evaluar', evaluar_ecosistema, [methods([post, options])]).

% 4. Iniciar el servidor dinámicamente
iniciar_servidor :-
    % Lee el puerto que asigna Render, o usa el 8000 si estás en local
    ( getenv('PORT', PuertoTexto) -> 
        atom_number(PuertoTexto, Puerto) 
    ; 
        Puerto = 8000 
    ),
    http_server(http_dispatch, [port(Puerto)]).

% 5. Manejador principal de las peticiones web

% Responder al preflight del navegador (200 con cuerpo vacío y encabezados CORS)
evaluar_ecosistema(Request) :-
    option(method(options), Request), !,
    cors_enable(Request, [methods([post])]),
    format('~n').

evaluar_ecosistema(Request) :-
    cors_enable,
    
    % Leer el JSON desde la página web
    % value_string_as(atom) convierte los textos del JSON en átomos, como en hechos.pl
    http_read_json_dict(Request, DatosJSON, [value_string_as(atom)]),
    
    % Extraer las variables del JSON
    ListaEspecies = DatosJSON.get(especies),
    TipoTanque = DatosJSON.get(tanque_tipo),
    CapacidadJSON = DatosJSON.get(tanque_capacidad),
    
    % reglas.pl espera la capacidad como functor litros/1, cm2/1 o litros_y_cm2/2
    construir_capacidad(TipoTanque, CapacidadJSON, Capacidad),
    
    % Construir el tanque lógico y ejecutar el orquestador
    Tanque = tanque(TipoTanque, Capacidad),
    diagnostico(ListaEspecies, Tanque, ListaConflictos),
    
    % Determinar la viabilidad usando la regla original del orquestador
    ( ecosistema_viable(ListaEspecies, Tanque) -> 
        Viable = true
    ; 
        Viable = false
    ),
    
    % Formatear los errores de Prolog a JSON
    formatear_conflictos(ListaConflictos, ConflictosJSON),
    
    % Enviar respuesta HTTP 200 OK con el JSON final
    reply_json_dict(_{
        viable: Viable,
        conflictos: ConflictosJSON
    }).

% 6. Convierte la capacidad que manda la web en el functor que usa reglas.pl
construir_capacidad(acuatico, Litros, litros(Litros)) :-
    number(Litros), !.
construir_capacidad(terrestre_tropical, Area, cm2(Area)) :-
    number(Area), !.
construir_capacidad(terrestre_desertico, Area, cm2(Area)) :-
    number(Area), !.
construir_capacidad(mixto, Datos, litros_y_cm2(Litros, Area)) :-
    is_dict(Datos),
    Litros = Datos.get(litros),
    Area = Datos.get(area),
    number(Litros), number(Area).

% 7. Predicado auxiliar para convertir functores a texto JSON
formatear_conflictos([], []).
formatear_conflictos([conflicto(Mensaje, Involucrados) | Resto], [_{mensaje: Mensaje, involucrados: InvString} | RestoJSON]) :-
    term_string(Involucrados, InvString),
    formatear_conflictos(Resto, RestoJSON).