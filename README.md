# Auth API - Portfolio

API REST para autenticación y gestión de usuarios. Proyecto hecho con Node.js, Express, TypeScript y MongoDB. Pensado para incluir en portafolio.

## Características

- Registro / Login (bcrypt + JWT)
- Refresh tokens con cookie httpOnly
- Roles (ADMIN / USER)
- Endpoints para gestión de usuarios (CRUD)
- Documentación Swagger en `/api/docs`

## Requisitos

- Node 18+
- npm
- MongoDB (Atlas o local)

## Variables de entorno (ver `.env.example`)

## Instalar y ejecutar (desarrollo)

```bash
npm install
cp .env.example .env
# editar .env
npm run dev
```

## Documentación

Abrir: http://localhost:3000/api/docs

## Deploy (rápido)

Se puede desplegar en Railway / Render / Heroku. Añadir Dockerfile y variables de entorno.

## Notas de seguridad

- Usar HTTPS y secure=true en cookies en producción.
- Considerar hashear refresh tokens en DB para mayor seguridad.
