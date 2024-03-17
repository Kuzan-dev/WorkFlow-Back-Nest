# Usa la imagen oficial de Node.js como base
FROM node:20

# Establece el directorio de trabajo en /usr/src/app
WORKDIR /usr/src/app

# Copia los archivos de package.json y package-lock.json a /usr/src/app
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install --production

# Instala la CLI de NestJS globalmente
RUN npm install -g @nestjs/cli
# Copia el resto de la aplicación al directorio de trabajo
COPY . .

# Expone el puerto 3000 en el contenedor
EXPOSE 4500

# Comando para iniciar la aplicación cuando el contenedor se ejecute
CMD ["npm", "start"]