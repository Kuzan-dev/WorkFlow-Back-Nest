# Use Node.js versión 20
FROM node:20

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de la aplicación
COPY . .

# Instalar las dependencias
RUN npm install

# Exponer el puerto en el que la aplicación escucha
EXPOSE 4500

# Comando para iniciar la aplicación
CMD ["npm", "start"]