# 1. Utiliza la imagen oficial y preconfigurada de SWI-Prolog
FROM swipl:latest

# 2. Crea una carpeta llamada 'app' dentro del servidor de Render
WORKDIR /app

# 3. Copia tu servidor.pl y la carpeta 'conocimiento' adentro de la nube
COPY . /app

# 4. Expone el puerto (Render lo sobreescribirá dinámicamente)
EXPOSE 8000

# 5. Ejecuta Prolog, arranca el servidor y mantiene el proceso vivo
CMD ["swipl", "-s", "servidor.pl", "-g", "iniciar_servidor", "-t", "thread_get_message(_)"]