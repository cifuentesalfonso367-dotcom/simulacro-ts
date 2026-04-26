# simulacro-ts
# Simulacro TS

Este proyecto es una aplicación construida con [Next.js](https://nextjs.org) y TypeScript, que utiliza Prisma como ORM para la base de datos.

## 🚀 Cómo empezar

Sigue estos pasos para configurar y ejecutar el proyecto de forma local.

### 1. Clonar el repositorio

Si aún no lo has hecho, clona el repositorio e ingresa a la carpeta:
```bash
git clone https://github.com/cifuentesalfonso367-dotcom/simulacro-ts.git
cd simulacro-ts
```

### 2. Instalar las dependencias

Ejecuta el siguiente comando para instalar todos los paquetes necesarios:

```bash
npm install
```

### 3. Configurar las variables de entorno

Este proyecto utiliza variables de entorno para manejar información sensible como conexiones a base de datos y secretos. 
El archivo `.env` **ya está protegido y no se subirá a GitHub** gracias a la configuración en `.gitignore`.

Crea un archivo llamado `.env` en la raíz de tu proyecto y copia el contenido que está en `.env.example`. Asegúrate de completar los valores reales para tu entorno local:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME?schema=public"
DIRECT_DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME?sslmode=require"
JWT_SECRET="replace-with-strong-random-secret"
JWT_REFRESH_SECRET="replace-with-strong-random-secret"
```

### 4. Ejecutar el servidor de desarrollo

Una vez configurado, puedes levantar el proyecto con:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación en funcionamiento.

## 📁 Estructura Principal

- `/app` o `/src/app` - Páginas y rutas de la aplicación Next.js.
- `/prisma` - Configuración de la base de datos y esquemas de Prisma.
- `.env` - Archivo donde van tus secretos (¡No lo subas a GitHub!).
