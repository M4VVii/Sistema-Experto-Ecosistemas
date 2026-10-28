FROM python:3.11-slim

WORKDIR /app

# Desactivar avisos interactivos de Debian
ENV DEBIAN_FRONTEND=noninteractive

# Instalar SWI-Prolog desde los repositorios actualizados de Debian
RUN apt-get update && apt-get install -y --no-install-recommends \
    swi-prolog \
    && rm -rf /var/lib/apt/lists/*

# Instalar dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código del backend
COPY . .

# Puerto dinámico para Render y entorno local
ENV PORT=8000
EXPOSE 8000

CMD ["sh", "-c", "gunicorn -w 2 -b 0.0.0.0:${PORT} servidor:app"]