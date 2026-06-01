# Backend IPSS - API REST con Hono, Prisma y PostgreSQL

API REST para gestion de notas personales por categoria. Construida con Hono, Prisma ORM, PostgreSQL y TypeScript.

## Descripcion

Backend del sistema IPSS que expone endpoints REST para que el frontend (React Native / Expo) pueda crear, leer, actualizar y eliminar notas organizadas por categorias.

## Tecnologias

| Capa | Libreria |
|---|---|
| Framework HTTP | Hono |
| ORM | Prisma |
| Base de datos | PostgreSQL |
| Validacion | Zod |
| Runtime | Node.js (tsx) |
| Lenguaje | TypeScript |

## Estructura del Proyecto

```
backend-ipss/
  src/
    index.ts                          # Punto de entrada: servidor Hono, middlewares, rutas
    controllers/
      notes.controller.ts             # Logica HTTP: recibe request, valida, llama al repositorio
      categories.controller.ts
    repositories/
      notes.repository.ts             # Acceso a datos: queries de Prisma
      categories.repository.ts
    routes/
      notes.routes.ts                 # Definicion de endpoints REST
      categories.routes.ts
    schemas/
      notes.schema.ts                 # Esquemas Zod para validar payloads
      categories.schema.ts
    lib/
      prisma.ts                       # Instancia de PrismaClient con adapter pg
      prisma-error.ts                 # Parser de errores de Prisma a respuestas HTTP
    generated/prisma/                 # Cliente Prisma generado (gitignoreado)
  prisma/
    schema.prisma                     # Modelo de datos
    migrations/                       # Migraciones SQL
  .env                                # Variables de entorno (no commiteado)
  package.json
  tsconfig.json
```

## Arquitectura

El proyecto sigue una arquitectura en capas:

```
Request HTTP
  -> Router       (routes/)       define metodo y path
    -> Controller (controllers/)   parsea parametros, valida body con Zod, llama al repositorio
      -> Repository (repositories/) ejecuta queries con Prisma
        -> PostgreSQL
```

Cada capa tiene una responsabilidad unica:
- **Routes**: solo asocia metodos HTTP con controladores.
- **Controllers**: extraen datos del request, validan con Zod, devuelven respuestas JSON con codigos HTTP adecuados.
- **Repositories**: encapsulan las consultas a la base de datos; no conocen HTTP ni Hono.
- **Schemas**: definen la forma esperada de los payloads con Zod (usados en create y update).

## Requisitos Previos

- Node.js 18+
- PostgreSQL corriendo (local o remoto)
- npm

## Instalacion

1. Clonar el repositorio e instalar dependencias:

```bash
git clone <URL-DEL-REPO>
cd backend-ipss
npm install
```

2. Configurar variables de entorno. Crear un archivo `.env` en la raiz:

```env
DATABASE_URL=postgresql://usuario:password@localhost:5433/notesdb
PORT=3000
```

3. Ejecutar las migraciones de Prisma para crear las tablas:

```bash
npx prisma migrate dev
```

4. Generar el cliente de Prisma (si no se genero automaticamente):

```bash
npx prisma generate
```

## Ejecucion

### Modo desarrollo (con hot-reload)

```bash
npm run dev
```

### Modo produccion

```bash
npm start
```

El servidor se ejecuta en `http://localhost:3000`.

## Scripts Disponibles

| Comando | Descripcion |
|---|---|
| `npm run dev` | Inicia el servidor con tsx watch (reload automatico) |
| `npm start` | Inicia el servidor con tsx |
| `npm run build` | Compila TypeScript a JavaScript en dist/ |
| `npm run prisma:migrate` | Ejecuta migraciones pendientes |
| `npm run prisma:studio` | Abre Prisma Studio (explorador visual de la BD) |
| `npm run prisma:generate` | Regenera el cliente de Prisma |

## Modelo de Datos

### Category

| Campo | Tipo | Descripcion |
|---|---|---|
| id | Int (autoincrement) | Identificador unico |
| name | String (unique) | Nombre de la categoria |

### Note

| Campo | Tipo | Descripcion |
|---|---|---|
| id | Int (autoincrement) | Identificador unico |
| title | String | Titulo de la nota |
| content | String | Contenido de la nota |
| createdAt | DateTime | Fecha de creacion (auto) |
| updatedAt | DateTime | Fecha de actualizacion (auto) |
| categoryId | Int (FK) | Categoria a la que pertenece |

Relacion: `Category 1 -> N Note`. Al eliminar una categoria que tiene notas asociadas, la base de datos rechaza la operacion (ON DELETE RESTRICT).

## Endpoints de la API

Base URL: `http://localhost:3000`

### Raiz

```
GET /
```
Respuesta: `{ "status": "ok", "message": "API de Notas - IPSS" }`

### Notas

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/notes` | Listar todas las notas (incluye su categoria) |
| GET | `/notes/:id` | Obtener una nota por ID |
| POST | `/notes` | Crear una nota |
| PATCH | `/notes/:id` | Actualizar una nota (parcial) |
| DELETE | `/notes/:id` | Eliminar una nota |

#### POST /notes

Body:
```json
{
  "title": "Titulo de la nota",
  "content": "Contenido de la nota",
  "categoryId": 1
}
```

Respuesta (201):
```json
{
  "id": 1,
  "title": "Titulo de la nota",
  "content": "Contenido de la nota",
  "createdAt": "2026-05-09T21:00:00.000Z",
  "updatedAt": "2026-05-09T21:00:00.000Z",
  "categoryId": 1,
  "category": { "id": 1, "name": "Personal" }
}
```

#### PATCH /notes/:id

Body (todos los campos son opcionales):
```json
{
  "title": "Nuevo titulo",
  "content": "Nuevo contenido",
  "categoryId": 2
}
```

#### DELETE /notes/:id

Respuesta (200):
```json
{ "message": "Nota eliminada" }
```

### Categorias

| Metodo | Ruta | Descripcion |
|---|---|---|
| GET | `/categories` | Listar todas las categorias |
| GET | `/categories/:id` | Obtener una categoria por ID |
| POST | `/categories` | Crear una categoria |
| DELETE | `/categories/:id` | Eliminar una categoria |

#### POST /categories

Body:
```json
{ "name": "Trabajo" }
```

Respuesta (201):
```json
{ "id": 1, "name": "Trabajo" }
```

#### DELETE /categories/:id

Si la categoria tiene notas asociadas, la eliminacion falla con error 422 (ON DELETE RESTRICT).

Respuesta exitosa (200):
```json
{ "message": "Categoria eliminada" }
```

## Manejo de Errores

La API devuelve errores en este formato:

```json
{ "error": "Mensaje descriptivo del error" }
```

### Codigos de error comunes

| HTTP | Causa | Ejemplo |
|---|---|---|
| 400 | ID invalido o datos faltantes | `GET /notes/abc` |
| 404 | Registro no encontrado | `DELETE /notes/999` |
| 409 | Valor duplicado (unique) | Crear categoria con nombre ya existente |
| 422 | Violacion de FK (referencia inexistente o restrict) | Eliminar categoria con notas asociadas |
| 500 | Error interno del servidor | |

Los errores de Prisma se parsean en `src/lib/prisma-error.ts`, que traduce los codigos de error de Prisma (P2002, P2003, P2025, etc.) a codigos HTTP y mensajes en espanol.

La validacion de payloads usa Zod. Si el body no cumple el esquema, se devuelve 400 con los detalles:

```json
{
  "errors": [
    { "code": "too_small", "minimum": 1, "type": "string", "message": "El titulo es obligatorio", "path": ["title"] }
  ]
}
```

## Middlewares

- `cors()`: Habilitado para todos los origenes. Permite que el frontend (web, iOS, Android) se conecte sin restricciones.
- `logger()`: Registra cada request en consola (metodo, path, status, tiempo de respuesta).
- `dotenv/config`: Carga las variables del archivo `.env` al iniciar.

## Conectar desde el Frontend

El frontend (Expo / React Native) debe configurar la variable `EXPO_PUBLIC_API_URL` apuntando a este servidor:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.50:3000   # IP local de la maquina donde corre el backend
```

Consideraciones segun plataforma:
- **iOS Simulator**: `localhost` funciona directamente.
- **Android Emulator**: usar `10.0.2.2` en lugar de `localhost`.
- **Dispositivo fisico**: usar la IP local de la maquina (ambos en la misma red WiFi).
- **Web (navegador)**: `localhost` funciona si el backend corre en la misma maquina.

## Solucion de Problemas

### Error de conexion a PostgreSQL

Si al iniciar aparece `Error: connect ECONNREFUSED`, verificar que PostgreSQL este corriendo y que `DATABASE_URL` en `.env` sea correcta (puerto, usuario, password, nombre de BD).

```bash
psql -U postgres -c "SELECT 1"
```

### Tablas no existen (relation does not exist)

Ejecutar las migraciones:

```bash
npx prisma migrate dev
```

Si la base de datos no existe, crearla primero:

```bash
createdb notesdb
```

### Puerto 3000 ocupado

Windows:
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

Linux/Mac:
```bash
lsof -i :3000
kill -9 <PID>
```

### Error "Record to delete does not exist" al eliminar nota

Si el frontend intenta eliminar una nota que ya fue eliminada (por otra sesion o dispositivo), la API devuelve 404. El frontend debe manejar este caso eliminando la nota del estado local aunque el servidor devuelva error.

### No se pueden eliminar categorias con notas asociadas

La base de datos tiene `ON DELETE RESTRICT` en la FK de Note -> Category. Para eliminar una categoria, primero hay que eliminar o reasignar todas sus notas. Si se necesita eliminar en cascada, se debe modificar la migracion inicial y usar `ON DELETE CASCADE`.

### CORS bloqueando requests desde el frontend

El middleware `cors()` permite todos los origenes por defecto. Si aun asi hay errores CORS, verificar que el frontend este usando la URL correcta (sin `/` al final) y que no haya un proxy intermedio modificando los headers.

### Prisma Client no esta actualizado con el esquema

Despues de modificar `schema.prisma`, regenerar el cliente:

```bash
npx prisma generate
```

## Uso de IA

Se utilizo DeepSeek (OpenCode) como asistente de desarrollo. La IA contribuyo en:

- Definir la estructura de los puntos clave a implementar para cumplir la rubrica
- Sugerir workarounds para compatibilidad entre plataformas (web vs nativo)
- Asistir en la implementacion del codigo de autenticacion, middleware y upload

## Licencia

Este proyecto es privado.

## Autor

Proyecto de Desarrollo de Aplicaciones Moviles - IPSS
