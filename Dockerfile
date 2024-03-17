# Usa la imagen oficial de Node.js como base
FROM node:20

# Establece el directorio de trabajo en /usr/src/app
WORKDIR /usr/src/app

# Copia los archivos de package.json y package-lock.json a /usr/src/app
COPY package*.json ./

# Instala las dependencias de la aplicación
RUN npm install

# Instala la CLI de NestJS globalmente
RUN npm install -g @nestjs/cli
# Copia el resto de la aplicación al directorio de trabajo
COPY . .

# Construye la aplicación
RUN npm run build

# Expone el puerto 3000 en el contenedor
EXPOSE 4500

# Construye la aplicación y luego la inicia
CMD ["npm", "run", "start:prod"]