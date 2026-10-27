:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_json)).
:- use_module(library(http/http_cors)).

% 1. Cargar el orquestador y la base de conocimiento
:- ensure_loaded('conocimiento/consultas.pl').

% 2. Configurar CORS para permitir que el frontend se conecte sin bloqueos
:- set_setting(http:cors, [*]).

% 3. Definir la ruta web (Endpoint)
:- http_handler('/api/evaluar', evaluar_ecosistema, [method(post)]).

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
evaluar_ecosistema(Request) :-
    cors_enable,
    
    % Leer el JSON desde la página web
    http_read_json_dict(Request, DatosJSON),
    
    % Extraer las variables del JSON
    ListaEspecies = DatosJSON.get(especies),
    TipoTanque = DatosJSON.get(tanque_tipo),
    Capacidad = DatosJSON.get(tanque_capacidad),
    
    % Construir el tanque lógico y ejecutar el orquestador
    Tanque = tanque(TipoTanque, Capacidad),
    diagnostico(ListaEspecies, Tanque, ListaConflictos),
    
    % Determinar la viabilidad usando la regla original
    ( \+ evaluar_conflicto(ListaEspecies, Tanque, _, _) -> 
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

% 6. Predicado auxiliar para convertir functores a texto JSON
formatear_conflictos([], []).
formatear_conflictos([conflicto(Mensaje, Involucrados) | Resto], [_{mensaje: Mensaje, involucrados: InvString} | RestoJSON]) :-
    term_string(Involucrados, InvString),
    formatear_conflictos(Resto, RestoJSON).