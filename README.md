# Coffee Tracker

Tu base de datos personal de cafes de especialidad. Registra, puntua y descubre patrones en los cafes que pruebas.

![Nuxt 3](https://img.shields.io/badge/Nuxt-3-00DC82?logo=nuxt.js&logoColor=white)
![Vue 3](https://img.shields.io/badge/Vue-3-4FC08D?logo=vue.js&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-ready-5A0FC8?logo=pwa&logoColor=white)
![License: Polyform Noncommercial](https://img.shields.io/badge/License-Polyform%20NC%201.0-blue)

---

## Que hace

- **Registra cafes** con variedad, proceso, origen, notas de sabor y foto
- **Puntua degustaciones** con ratings detallados (aroma, acidez, dulzura, cuerpo, balance)
- **Guarda recetas** de preparacion (V60, AeroPress, Chemex, etc.)
- **Organiza tostadores** con info de contacto y rating
- **Wishlist** de cafes que quieres probar
- **Dashboard** con estadisticas y patrones de preferencia
- **Cuentas de usuario** con email/password y Google
- **PWA instalable** en tu celular como app nativa

## Stack

| Capa | Tecnologia |
|------|-----------|
| Frontend | Nuxt 3, Vue 3, TypeScript |
| Estilos | Tailwind CSS |
| Base de datos | Firebase Firestore |
| Storage | Firebase Storage (fotos) |
| Auth | Firebase Authentication |
| State | Pinia |
| Validacion | VeeValidate + Zod |
| Hosting | Vercel |

Todo funciona dentro de la **capa gratuita** de Firebase y Vercel.

## Requisitos previos

- [Node.js](https://nodejs.org/) 18+
- Una cuenta en [Firebase](https://console.firebase.google.com/)
- (Opcional) Una cuenta en [Vercel](https://vercel.com/) para deploy

## Instalacion

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/coffee-tracker.git
cd coffee-tracker
npm install
```

### 2. Configura Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/) y crea un proyecto
2. Habilita **Firestore Database** (modo produccion)
3. Habilita **Storage**
4. Habilita **Authentication** con los proveedores:
   - Email/Password
   - Google
5. En Authentication > Settings, verifica que este activo **"Link accounts that use the same email"**

### 3. Variables de entorno

Copia el archivo de ejemplo y llena tus credenciales de Firebase:

```bash
cp .env.example .env
```

```env
NUXT_PUBLIC_FIREBASE_API_KEY=tu-api-key
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
NUXT_PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.firebasestorage.app
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
NUXT_PUBLIC_FIREBASE_APP_ID=tu-app-id
```

Las credenciales las encuentras en Firebase Console > Project Settings > General > Your apps > Web app.

### 4. Reglas de Firestore

En Firebase Console > Firestore > Rules, pega estas reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{collection}/{docId} {
      allow read, write: if request.auth != null
        && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null
        && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

### 5. Reglas de Storage

En Firebase Console > Storage > Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
        && request.resource.size < 5 * 1024 * 1024;
    }
  }
}
```

### 6. Arranca el proyecto

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) y crea tu cuenta.

## Deploy en Vercel

### Opcion A: Desde GitHub (recomendado)

1. Sube tu repo a GitHub
2. Ve a [vercel.com/new](https://vercel.com/new) e importa el repositorio
3. Agrega las variables de entorno (las mismas del `.env`)
4. Click en **Deploy**
5. Agrega tu dominio de Vercel (`tu-app.vercel.app`) en Firebase Console > Authentication > Settings > Authorized domains

### Opcion B: CLI

```bash
npm i -g vercel
vercel
```

## Estructura del proyecto

```
coffee-tracker/
├── assets/css/          # Tailwind base styles
├── components/
│   ├── ui/              # Button, Card, Input, Modal, Rating...
│   ├── coffee/          # CoffeeCard, CoffeeForm, CoffeeFilters
│   ├── roaster/         # RoasterCard, RoasterForm, RoasterSelect
│   ├── tasting/         # TastingCard, TastingForm, TastingRatings
│   ├── recipe/          # RecipeCard, RecipeForm
│   ├── dashboard/       # StatsOverview, Charts, Favorites
│   └── layout/          # Sidebar, Navbar, BottomNav
├── composables/         # useFirebase, useAuth, useCoffees...
├── layouts/             # default.vue
├── middleware/           # auth.global.ts
├── pages/               # Rutas de la app
├── plugins/             # firebase.client.ts
├── stores/              # Pinia stores
├── types/               # TypeScript interfaces
└── utils/               # constants, formatters, validators
```

## Colecciones de Firestore

| Coleccion | Descripcion |
|-----------|-------------|
| `roasters` | Tostadores de cafe |
| `coffees` | Cafes con origen, variedad, proceso |
| `tastings` | Degustaciones con ratings 1-10 |
| `recipes` | Recetas de preparacion |
| `wishlist` | Cafes por probar |

Todos los documentos incluyen `userId` para aislamiento de datos por cuenta.

## Limites gratuitos

| Servicio | Limite |
|----------|--------|
| Firestore | 1 GB storage, 50K lecturas/dia, 20K escrituras/dia |
| Storage | 5 GB storage, 1 GB descarga/dia |
| Auth | Ilimitado |
| Vercel | 100 GB bandwidth/mes |

Mas que suficiente para uso personal.

## Personaliza tu Coffee Tracker

Algunas ideas para extender el proyecto:

- Agregar mas metodos de preparacion en `utils/constants.ts`
- Cambiar la paleta de colores en `tailwind.config.ts`
- Agregar nuevas variedades a la lista en `utils/constants.ts`
- Crear nuevos campos en los tipos (`types/index.ts`) y formularios

## Licencia

Este proyecto esta bajo la licencia [Polyform Noncommercial 1.0.0](LICENSE).

**Puedes:** usar, copiar, estudiar y modificar el codigo para cualquier proposito no comercial (proyectos personales, educacion, investigacion, hobby).

**No puedes:** usar el codigo o derivados con fines comerciales sin autorizacion del autor.

---

Hecho con mucho cafe por [Alfredo Romero](https://github.com/alfredoromero)

> *Si, este proyecto fue construido con IA ([Claude Code](https://claude.ai/code)). El humano puso el cafe, el criterio y las ideas. La IA puso las manos (que no tiene) en el teclado (que tampoco tiene). Ningun barista fue reemplazado en el proceso.*
