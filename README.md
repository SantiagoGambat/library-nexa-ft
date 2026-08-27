# Library Nexa Frontend

Aplicación web para la gestión de una biblioteca desarrollada con React, TypeScript y Vite.

## Tecnologías

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- React Router
- React Hook Form
- Lucide React
- Docker
- Nginx

## Requisitos

- Docker

No es necesario instalar Node.js, npm ni Nginx localmente.

## Variables de entorno

El proyecto incluye un archivo `.env.example` con la configuración necesaria.

Primero, copia el archivo, en la raiz de proyecto poner este comando: 

    cp .env.example .env

El archivo `.env` debe contener:

    VITE_API_URL=http://localhost:8080/api/v1

Si el backend se encuentra en otra dirección, modifica `VITE_API_URL` según corresponda.

## Ejecución con Docker

Construir la imagen:

    docker build -t library-nexa .

Ejecutar el contenedor:

    docker run -d \
      -p 5173:80 \
      --name library-nexa \
      library-nexa

La aplicación estará disponible en:


    http://localhost:8080

## Comandos útiles

Ver el contenedor:

    docker ps

Ver los logs:

    docker logs -f library-nexa

Detener el contenedor:

    docker stop library-nexa

Eliminar el contenedor:

    docker rm library-nexa

## Estructura

    frontend/
    ├── src/
    ├── public/
    ├── .env
    ├── .env.example
    ├── Dockerfile
    ├── nginx.conf
    ├── .dockerignore
    ├── .gitignore
    ├── package.json
    ├── package-lock.json
    ├── tsconfig.json
    ├── vite.config.ts
    └── README.md
