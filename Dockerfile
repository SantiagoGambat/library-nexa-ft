# Etapa 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el código del proyecto
COPY . .

# Compilar aplicación
RUN npm run build


# Etapa 2: Producción
FROM nginx:alpine

# Eliminar configuración por defecto de nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copiar configuración personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar build de Vite
COPY --from=builder /app/dist /usr/share/nginx/html

# Puerto HTTP
EXPOSE 80

# Ejecutar nginx
CMD ["nginx", "-g", "daemon off;"]
