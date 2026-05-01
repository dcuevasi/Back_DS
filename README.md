# Backend IPSS - API REST con Hono

API REST para la aplicación de TODO List construida con Hono y TypeScript.

## 📋 Descripción

Backend de la aplicación IPSS (Sistema de Gestión de Tareas) que proporciona una API REST para:
- Crear, leer, actualizar y eliminar tareas (CRUD)
- Validación de datos
- Manejo de errores
- CORS habilitado para frontend

## 🚀 Características

- **Framework**: Hono (TypeScript)
- **Runtime**: Node.js
- **Base de datos**: En memoria (puede extenderse a una BD real)
- **API**: REST con CORS habilitado
- **Logging**: Logger integrado

## 📦 Requisitos Previos

- Node.js 18+ 
- npm o yarn

## 🔧 Instalación

1. Clonar el repositorio:
```bash
git clone <URL-DEL-REPO>
cd backend-ipss
```

2. Instalar dependencias:
```bash
npm install
```

## ▶️ Ejecución

### Modo Desarrollo
Inicia el servidor con hot-reload:
```bash
npm run dev
```

El servidor se ejecutará en `http://localhost:3000`

### Modo Producción
Compilar TypeScript:
```bash
npm run build
```

Ejecutar código compilado:
```bash
npm start
```

## 📡 Endpoints de la API

### Health Check
```http
GET /health
```
Respuesta:
```json
{ "ok": true }
```

### Obtener Todas las Tareas
```http
GET /todos
```
Respuesta:
```json
[
  {
    "id": "uuid",
    "title": "Mi tarea",
    "completed": false,
    "createdAt": "2024-01-01T10:00:00.000Z"
  }
]
```

### Obtener Tarea por ID
```http
GET /todos/:id
```

### Crear Nueva Tarea
```http
POST /todos
Content-Type: application/json

{
  "title": "Nueva tarea",
  "completed": false
}
```

### Actualizar Tarea
```http
PUT /todos/:id
Content-Type: application/json

{
  "title": "Tarea actualizada",
  "completed": true
}
```

### Eliminar Tarea
```http
DELETE /todos/:id
```

## 🔌 Configuración

### Variables de Entorno
Crear archivo `.env` en la raíz del proyecto:

```env
PORT=3000
```

## 🌐 Conectar desde Frontend

Para conectar el frontend (Expo/React Native) desde otro dispositivo:

1. Obtener la IP local del PC:
   - Windows: `ipconfig` (buscar IPv4)
   - Linux/Mac: `ifconfig`

2. Configurar variable de entorno en el frontend:
```bash
export EXPO_PUBLIC_API_URL="http://TU_IP_LOCAL:3000"
```

3. Verificar que PC y dispositivo estén en la misma red Wi-Fi

## 📁 Estructura del Proyecto

```
backend-ipss/
├── src/
│   └── index.ts           # Punto de entrada de la aplicación
├── dist/                  # Código compilado (generado)
├── package.json           # Dependencias del proyecto
├── tsconfig.json          # Configuración de TypeScript
├── .gitignore             # Archivos a ignorar en Git
└── README.md              # Este archivo
```

## 🛠️ Herramientas de Desarrollo

- **TypeScript**: Lenguaje tipado
- **tsx**: Ejecutor de TypeScript para desarrollo
- **tsc**: Compilador de TypeScript

## 📝 Notas

- Los datos se almacenan en memoria y se pierden al reiniciar
- Para producción, reemplazar el almacenamiento en memoria con una base de datos real
- CORS está habilitado para todas las direcciones (`*`)

## 📄 Licencia

Este proyecto es privado

## 👤 Autor

Proyecto de Desarrollo de Aplicaciones Móvil
