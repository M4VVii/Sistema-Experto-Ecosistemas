import json
import math
import os
import re
import subprocess

from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Habilita CORS (incluida la petición previa OPTIONS) para la interfaz web

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ARCHIVO_PROLOG = os.path.join(BASE_DIR, 'evaluar.pl')

TIPOS_TANQUE = {'acuatico', 'terrestre_tropical', 'terrestre_desertico', 'mixto'}
ID_ESPECIE = re.compile(r'[a-z][a-z0-9_]{0,49}')  # Solo átomos simples de Prolog
MAX_ESPECIES = 24
MAX_CAPACIDAD = 1_000_000_000


class DatosInvalidos(ValueError):
    """La petición no cumple el formato esperado (se responde con HTTP 400)."""


def entero_positivo(valor, campo):
    """Acepta solo números reales positivos. Excluye bool (que en Python es int), NaN e infinito."""
    if isinstance(valor, bool) or not isinstance(valor, (int, float)):
        raise DatosInvalidos(f'{campo} debe ser un número')
    try:
        valido = math.isfinite(valor) and 1 <= valor <= MAX_CAPACIDAD
    except OverflowError:  # Enteros gigantes que no caben en un float
        valido = False
    if not valido:
        raise DatosInvalidos(f'{campo} debe ser un número positivo válido')
    return int(valor)


def validar_especies(especies):
    if not isinstance(especies, list) or not 2 <= len(especies) <= MAX_ESPECIES:
        raise DatosInvalidos(f'Se requiere una lista de 2 a {MAX_ESPECIES} especies')
    for e in especies:
        if not isinstance(e, str) or not ID_ESPECIE.fullmatch(e):
            raise DatosInvalidos('Identificador de especie inválido')
    if len(set(especies)) != len(especies):
        raise DatosInvalidos('Hay especies repetidas')
    return especies


def construir_tanque(tipo, capacidad):
    """Arma el término tanque/2 con el functor de espacio que espera reglas.pl:
    litros(L) para acuático, cm2(A) para terrestres y litros_y_cm2(L, A) para mixto."""
    if not isinstance(tipo, str) or tipo not in TIPOS_TANQUE:
        raise DatosInvalidos('Tipo de tanque inválido')

    if tipo == 'acuatico':
        litros = entero_positivo(capacidad, 'La capacidad en litros')
        return f'tanque(acuatico, litros({litros}))'

    if tipo == 'mixto':
        if not isinstance(capacidad, dict):
            raise DatosInvalidos('Para un tanque mixto la capacidad debe incluir litros y area')
        litros = entero_positivo(capacidad.get('litros'), 'La capacidad en litros')
        area = entero_positivo(capacidad.get('area'), 'El área')
        return f'tanque(mixto, litros_y_cm2({litros}, {area}))'

    area = entero_positivo(capacidad, 'El área')
    return f'tanque({tipo}, cm2({area}))'


def consultar_prolog(especies, tanque):
    """Ejecuta evaluar_json/2 (evaluar.pl) en un proceso de SWI-Prolog y devuelve su JSON.
    Los datos ya fueron validados, así que solo contienen átomos simples y números."""
    meta = f"evaluar_json([{', '.join(especies)}], {tanque})"
    try:
        proceso = subprocess.run(
            ['swipl', '-q', '-g', meta, '-t', 'halt', ARCHIVO_PROLOG],
            capture_output=True,
            text=True,
            cwd=BASE_DIR,
            stdin=subprocess.DEVNULL,
            timeout=20,
        )
    except subprocess.TimeoutExpired:
        raise RuntimeError('Prolog tardó demasiado en responder')

    if proceso.returncode != 0:
        raise RuntimeError(f'Prolog terminó con código {proceso.returncode}: {proceso.stderr.strip()}')

    return json.loads(proceso.stdout)


@app.route('/')
def salud():
    return jsonify({'estado': 'ok'})


@app.route('/api/evaluar', methods=['POST'])
def evaluar():
    datos = request.get_json(silent=True)
    if not isinstance(datos, dict):
        return jsonify({'error': 'El cuerpo debe ser un JSON válido'}), 400

    try:
        especies = validar_especies(datos.get('especies'))
        tanque = construir_tanque(datos.get('tanque_tipo'), datos.get('tanque_capacidad'))
    except DatosInvalidos as e:
        return jsonify({'error': str(e)}), 400

    try:
        resultado = consultar_prolog(especies, tanque)
    except (RuntimeError, OSError, json.JSONDecodeError) as e:
        print(f'Error al consultar Prolog: {e}', flush=True)
        return jsonify({'error': 'Error procesando la consulta'}), 500

    if 'error' in resultado:  # Por ejemplo, una especie que no existe en hechos.pl
        return jsonify(resultado), 400

    return jsonify(resultado)


if __name__ == '__main__':
    # Solo para pruebas locales. En producción se usa gunicorn (ver Dockerfile).
    app.run(host='127.0.0.1', port=int(os.environ.get('PORT', 8000)), debug=False)