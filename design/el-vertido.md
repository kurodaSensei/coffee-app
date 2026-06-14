# El Vertido · Sorbo Pour

> Documento de arquitectura, diseño visual y plan de implementación.
> Versión 0.1 · borrador para revisión antes de codear.

---

## 1 · Visión y nombres

### 1.1 Lo que es

Una experiencia de preparación de café — pero **integrada al diario de Sorbo**, no paralela. La diferencia respecto a herramientas existentes (Aura Brew, Brewing Buddy, etc.) está en tres ejes:

1. **El café manda, no el método** — empieza preguntando qué café vas a verter, y desde ahí se sugiere todo lo demás
2. **Inteligencia que aprende contigo y con la comunidad** — recetas, ratios y métodos se recomiendan en función del perfil del café cruzado con outcomes reales
3. **Cierra el ciclo** — al terminar el vertido, te lleva al wizard de cata pre-llenado, alimentando el sistema

### 1.2 Naming

| Contexto | Nombre | Uso |
|---|---|---|
| **Feature interna en sorbo.app** | **El Vertido** | "Inicia el vertido", "Vertido — Paso 02 / 06" |
| **Producto público / Lite** | **Sorbo Pour** | `pour.sorbo.app` · marketing-friendly · PWA propia |

Justificación:
- **El Vertido** mantiene el tono editorial-español de Sorbo (junto a "Mi colección", "Tus catas", "La comunidad", "Tu wishlist"). Tiene presencia, evoca el gesto físico.
- **Sorbo Pour** funciona para audiencia bilingüe/internacional, brandea la cuenta Sorbo, mantiene la palabra Pour que comunica claro el dominio (café de especialidad), corto y memorable.

---

## 2 · Lenguaje visual propio

> El reto: hacer algo claramente Sorbo, no un clon estético de Aura Brew. La paleta y la tipografía ya existen — lo que se construye nuevo es el **lenguaje cinético y atmosférico**.

### 2.1 El sustrato (background dinámico)

**Lo que NO hacemos**: un glow estático centrado tipo Aura Brew.

**Lo que hacemos**: una capa de **niebla derivante** que respira en el fondo, con cambio de temperatura cromática a lo largo del journey.

```
[Café]        [Método]      [Receta]      [Ajuste]      [Vertido]     [Cierre]
moss          moss/jungle   jungle        jungle/amber  amber/honey   honey/paper
(frío)        (foco)        (foco)        (calentando)  (cálido)      (resolución)
```

Implementación:
- SVG con dos blobs radiales (`filter: blur(80px)`) que se desplazan en bucle de 30s a velocidades distintas
- CSS `transform: translate3d()` animado con `cubic-bezier(0.4, 0, 0.2, 1)`
- La temperatura cromática se transiciona en 800ms cuando cambia el stage, no instantáneamente
- Respeta `prefers-reduced-motion`: niebla queda estática

Stack: SVG + CSS (cero JS, cero canvas). Performance ~ free.

### 2.2 Gránulos descendentes (durante el Vertido)

Durante el cronómetro, una capa **muy sutil** de puntos honey caen verticalmente del top de la pantalla a velocidad constante. Abstrae "vertido en curso" sin literalismo.

- 8-12 puntos simultáneos máximo (no contaminar la lectura del timer)
- Tamaño 1.5-2.5px, opacidad 0.15-0.35
- Velocidad: 4-8s caída
- Fade-out antes de tocar el borde inferior
- Se pausan cuando el timer está en pausa (sincronización emocional)
- Se aceleran muy ligeramente al alcanzar el water target de la fase (feedback de "logro")

Implementación: un componente Vue `<RitualParticles>` con 12 `<div>` posicionados absolutamente, animados con `@keyframes` CSS individuales con `animation-delay` aleatorio determinístico (seed por session).

### 2.3 Sellos editoriales por stage

En lugar de iconos genéricos (Lucide), **un sello SVG hand-drawn** por stage. Pequeño (32-40px), italic, color honey, posicionado top-center del card de cada stage.

| Stage | Sello |
|---|---|
| Café | Silueta de grano de café con un trazo italic, una hojita |
| Método | Glifo abstracto del método (V60 = triángulo invertido; Chemex = reloj de arena; French Press = cilindro; Aeropress = pistón; etc.) |
| Receta | Glifo de firma manuscrita, una línea fluida en cursiva |
| Ajuste | Pequeña dial o balanza minimalista |
| Vertido | Onda concéntrica desde el centro, una sola línea |
| Cierre | Taza con vapor saliendo (3 ondulaciones honey) |

Estos sellos son la identidad visual del Vertido y se reusan en thumbnails, OG images, etc.

### 2.4 Visualización del cronómetro — la columna líquida

**Lo que NO hacemos**: el arco circular tipo Aura Brew.

**Lo que hacemos**: una **columna líquida vertical** que se llena de honey desde abajo conforme avanza la fase.

```
┌─────────────────────────────────┐
│                                 │
│   Bloom · La floración          │  ← eyebrow editorial (mono caps)
│                                 │
│   00:38                         │  ← time remaining (DM Serif Display 72px)
│   / 00:40                       │  ← duración total (mono 14px)
│                                 │
│            ┃░░░░░░░░░┃          │  ← columna líquida que llena con honey
│            ┃▓▓▓▓▓▓░░░┃          │
│            ┃▓▓▓▓▓▓▓▓░┃          │
│            ┃▓▓▓▓▓▓▓▓▓┃ ← lleno  │
│                                 │
│   43 g de agua                  │  ← water target (italic honey)
│                                 │
│   [Pausa] [Saltar] [Atrás]      │  ← controles
│                                 │
└─────────────────────────────────┘
```

Detalles:
- Vasija silueta de 80x180px, line-art honey, en el centro
- El "líquido" interno usa `clip-path: inset()` animado para subir desde el bottom
- Color del líquido: gradient `from-honey to-amber-dark`
- Al alcanzar 100% antes de que termine la fase: el contorno parpadea suavemente (anticipa el cambio de fase)
- Al pasar a la siguiente fase: la vasija se "vacía" en 300ms con animación de drain, luego se rellena para la próxima

Implementación: SVG inline con `<rect clip-path>` y CSS `transition: clip-path`. Performance excelente.

### 2.5 Transiciones entre stages — Wash

**Lo que NO hacemos**: fade simple.

**Lo que hacemos**: un **wash radial** desde el punto de tap del botón "Continuar". Una onda de color expande desde el origen, cubre la pantalla, y al salir revela el siguiente stage.

```
@touch-point [Continuar]
   ●  →  ◯  →  ◯◯◯  →  ████  →  [next stage]
   400ms ease-out, cubic-bezier(0.25, 0.46, 0.45, 0.94)
```

Implementación:
- Componente `<RitualTransition>` que captura coordenadas del último click
- Renderiza un `<div>` absolute con `clip-path: circle()` animado de 0 a screen-radius
- Mientras el wash expande, el stage actual se desvanece + traslada -8px
- Cuando el wash llega al 80%, el siguiente stage se renderiza con scale-up 0.96 → 1
- Color del wash: honey con `opacity: 0.4` (no opaco, deja ver la transición)

Es el toque distintivo más fuerte. No lo he visto en otra app de café.

### 2.6 Sonidos generativos

**Filosofía**: el sonido apoya, no compite. Default OFF (no sorprender). Activable con un icono discreto top-right del wizard.

| Evento | Sonido | Característica |
|---|---|---|
| Ambient pasivo | Drone moss-toned | -45dB, sinusoidal 80Hz + 120Hz, opcional |
| Tap en card | Tick acústico | Wood-like, 50ms, -30dB |
| Continuar | Subir tono breve | Sine 440Hz → 660Hz, 200ms, -25dB |
| Cambio de fase | Campana golpeada una vez | 880Hz con decay 1s, -22dB |
| Vertido milestone | Gota | 200Hz with quick rise & decay, -28dB |
| Completion | Tono cálido sostenido | 528Hz, fade-in 0.5s + sustain 1.5s + fade-out 1s, -20dB |

**Implementación**: Web Audio API completamente generativo. Cero archivos de audio. El composable `useRitualSound()` instancia un `AudioContext` con osciladores y filtros.

```ts
// pseudocodigo
function playTick() {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = 800
  gain.gain.setValueAtTime(0.05, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05)
  osc.connect(gain).connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.05)
}
```

Ventajas:
- Cero peso (no descargas)
- Personalizable en runtime
- No bloquea ningún flujo si el usuario tiene mute

### 2.7 Haptic choreography

| Evento | Patrón |
|---|---|
| Tap en card | 10ms light |
| Continuar | 20ms medium |
| Cambio de fase | 20ms + 60ms gap + 20ms (eco doble) |
| Pausa / saltar | 10ms light |
| Completion | 15ms × 3 con gap de 80ms (success cascade) |

Reusa `useHaptic` existente. Las nuevas patrones se agregan como `useHaptic().pattern(['light', 80, 'light', 80, 'light'])`.

---

## 3 · El flujo end-to-end

### 3.1 Entry points

| Desde | Pre-fill |
|---|---|
| `/app/coffees/[id]` (detalle de café) → "Verter este café" | `coffee=this` → arranca en stage 2 |
| `/app/recipes/[id]` (detalle de receta) → "Verter esta receta" | `coffee=?` `method=recipe.method` `recipe=this` → pregunta café o salta a 4 |
| `/app/methods` → tap en método → "Verter con este método" | `method=this` → arranca en stage 1 sin café |
| Dashboard `¿Preparas café?` | sin contexto → arranca en stage 1 |

### 3.2 Stages

#### Stage 1 · Café — *"El protagonista"*

Display: sello del grano, eyebrow "01 / 06 · CAFÉ", título "El protagonista", subtitle italic "¿Qué vas a verter hoy?"

Contenido:
- **Búsqueda inline** (input "Busca tu café…")
- **Lista de tus cafés** (top 6, scrolleable, MoodCard reducida)
- **CTA secundario**: "Sin café específico" (modo plano, salta a 2)
- **CTA terciario**: "Café nuevo" → inline quick-add (3 campos: nombre, roast, process) sin guardar permanente al catálogo

Behavior: tap en un café → mini-resumen aparece bajo el card: "*Natural · Tarqui · medio-claro*". Botón "Continuar" se activa.

#### Stage 2 · Método — *"El acercamiento"*

Display: sello del método (cambia según selección), eyebrow "02 / 06 · MÉTODO".

Contenido:
- **3 cards destacadas** con métodos recomendados por el algoritmo, cada una con:
  - Glifo abstracto del método
  - Nombre + ratio sugerido
  - Razón corta italic: *"Los naturales se lucen con vertidos lentos y filtros precisos."*
- **"Otros métodos"** expandible con la lista completa de activos
- Si vienes desde una receta: el método de la receta aparece como **"Tu receta sugiere V60"** card pre-seleccionada, con opción "Cambiar de método" desplegable

Behavior: tap en una card → wash hacia ese card → continuar.

#### Stage 3 · Receta — *"El plan"*

Display: sello firma, eyebrow "03 / 06 · RECETA".

Contenido (3 tabs editorialmente diseñados, no segmented):
- **"De tus recetas"** — top 3 matches con tu colección
- **"De la comunidad"** — top 3 matches públicos
- **"Sin receta"** — modo libre

Cada match incluye:
- Card con nombre + autor (si comunidad)
- Parámetros principales (dosis · ratio · tiempo total)
- **Razones del match** en italic mono pequeño: *"Mismo método · ratio en rango · 87% de matches recientes en cafés similares"*
- Tap → expandible para preview completa de steps

CTA "Sin receta" abre un mini-form: solo dosis + ratio + meta de tiempo. Salta a stage 5 directo.

#### Stage 4 · Ajuste — *"La medida"*

Display: sello dial, eyebrow "04 / 06 · AJUSTE".

Contenido:
- Display centrado: **dosis** (slider 8-40g) + agua calculada en tiempo real
- Toggle "Ajustar ratio manualmente" con presets ±0.5 alrededor del sugerido
- Sugerencia de molienda (Fine ⟷ Coarse) con justificación italic
- Si vienes desde una receta: muestra los originales como referencia ("La receta original usa 18g / 288g · 1:16")

Behavior: cambios actualizan el agua en tiempo real, transición suave (400ms ease) del número.

#### Stage 5 · Vertido — *"El presente"*

Display: la columna líquida (sección 2.4). Background entra en modo amber/honey.

Detalles ya descritos en 2.4. Adicional:
- En la transición de fase, el sello del método pulsa con un wash
- El número del time-remaining late suavemente con la cadencia 1Hz (sutil)

#### Stage 6 · Cierre — *"La taza"*

Display: sello taza con vapor, eyebrow "06 / 06 · TU TAZA". Background vuelve a moss/paper.

Contenido — 3 cards verticales:
- **"Catarla en detalle"** (primary, honey button) — wizard de cata pre-llenado
- **"Solo guardar el momento"** — un mini-form: 3 emojis para satisfacción rápida (great/good/meh) + opcional una sola frase
- **"Listo, sin registro"** — vuelve al lugar de entrada

Detalle creativo: cuando seleccionas una opción, una **animación de "guardado"** corre — el sello se anima a un "stamp" effect (rotate ligeramente, scale-up, settle) y un wash celebrative cruza la pantalla. Total ~600ms.

---

## 4 · Sistema de inteligencia — Affinity Score

### 4.1 No es ML. Es scoring por reglas + capa de aprendizaje colaborativo.

Razón: con el volumen de data que tendremos en beta cerrada (<200 usuarios el primer año), un modelo entrenado sufriría de cold-start. Reglas heurísticas + collaborative scoring entregan valor desde el día 1.

### 4.2 Perfilado del café (`CoffeeProfile`)

Función pura, deriva un perfil de bucket desde los atributos del café:

```ts
type CoffeeProfile = {
  process: CoffeeProcess        // washed, natural, honey, ...
  roastBand: 'light' | 'mid' | 'dark'    // bucketed roastLevel
  flavorClass: 'fruit' | 'choco' | 'floral' | 'nut' | 'spice' | 'mixed'
  scoreBand: 'casual' | 'specialty' | 'topShelf'
}

function coffeeToProfile(c: Coffee): CoffeeProfile {
  return {
    process: c.process || 'other',
    roastBand: bucketRoast(c.roastLevel),
    flavorClass: classifyNotes(c.flavorNotes ?? []),
    scoreBand: bucketScore(c.scaScore),
  }
}
```

`profileKey = "${process}|${roastBand}|${flavorClass}|${scoreBand}"` — esto es la "llave" con la que indexamos afinidades.

### 4.3 Recomendación de método

```ts
function recommendMethods(coffee: Coffee | null): MethodSuggestion[]
```

Implementación:
- Tabla heurística `ROAST × METHOD` con scores 0-3
- Adjuntos por process: naturales +1.5 en V60/Chemex; anaeróbicos +1.5 en V60/Aeropress
- Adjunto por SCA: ≥88 +1 en métodos de precisión (V60, Kalita)
- Devuelve top N con razones en lenguaje natural

### 4.4 Recomendación de ratio

```ts
function recommendRatio(coffee: Coffee | null, method: BrewMethod): RatioSuggestion
```

Base ratio por método (no es ratio quemado *en el código del usuario* — vive en utilities y se ajusta):

```ts
const BASE_RATIO: Record<BrewMethod, number> = {
  v60: 16.5, chemex: 17, kalita: 16, origami: 16.5,
  aeropress: 15, french_press: 15, moka: 10, espresso: 2,
  cold_brew: 8, phin: 12, siphon: 15, suiren: 15, other: 16,
}
```

Ajustes por café:
- Tueste light/medium_light → -0.5
- Tueste dark → +1
- Process natural → +0.3
- Altitud >1800m → -0.3
- (V2 — preferencia detectada del usuario por sus ratings históricos)

Devuelve `{ ratio: number, reason: string }`.

### 4.5 Matching de recetas

```ts
function matchRecipes(coffee: Coffee | null, method: BrewMethod): MatchResult[]
```

Pool: tus recetas + recetas comunidad del mismo método (max 50 fetched).

Scoring de cada receta candidata:
```
score(r, coffee) = 
    w.ratio       * proximityScore(recipeRatio, recommendedRatio, 1.5)
  + w.popularity  * log(r.usageCount + 1)
  + w.affinity    * profileAffinity(r.id, coffeeProfile)
  + w.isOwn       * (r.userId === currentUserId ? 1 : 0)
  + w.recency     * recencyBoost(r.lastUsedAt)
```

Pesos default:
- `w.ratio: 4.0`
- `w.popularity: 1.5`
- `w.affinity: 3.0`
- `w.isOwn: 0.8`
- `w.recency: 0.5`

Devuelve top 3 por tab (tuyas / comunidad) con razones humanas.

### 4.6 La capa de aprendizaje colaborativo

**Idea**: cada ritual completado genera un `RitualOutcome`. Cuando un usuario cata el resultado, se registra `cataRating`. Estos outcomes son la señal de "qué tan bien funciona la receta R con cafés de perfil P".

**Privacidad**: los outcomes son **privados por default**. Sumar afinidad colectiva requiere un toggle opt-in en settings: *"Contribuir mis outcomes anónimos para mejorar las recomendaciones de la comunidad"*.

**Cómputo del affinity score**:
1. Trigger: cada vez que se completa un ritual con `recipeId` set
2. Lee outcomes anteriores de esa receta (limit 50, ordenados por created desc)
3. Filtra los que coinciden por `profileKey`
4. Promedio normalizado de ratings y satisfacción
5. Cache en `recipes/{id}.affinityByProfile[profileKey] = { uses, avgRating, avgSat }`
6. Actualización: cada N outcomes nuevos (5), o on-demand cuando se necesita

Cero Cloud Functions. Todo client-side con un debounce.

### 4.7 Por qué esto funciona sin ML

- En beta cerrada con <100 outcomes totales, las reglas heurísticas mandan
- A medida que crece la base, el peso `w.affinity` puede subir si el usuario quiere (configurable más adelante)
- Cuando llegue a >10k outcomes, podríamos plantar ML, pero el sistema actual será robusto y explicable hasta ese punto

---

## 5 · Modelo de datos

### 5.1 Nuevas interfaces

```ts
// types/index.ts

export type CoffeeProcess = 'washed' | 'natural' | 'honey' | 'anaerobic' | ...

export interface CoffeeProfile {
  process: CoffeeProcess | 'unknown'
  roastBand: 'light' | 'mid' | 'dark'
  flavorClass: 'fruit' | 'choco' | 'floral' | 'nut' | 'spice' | 'mixed'
  scoreBand: 'casual' | 'specialty' | 'topShelf'
}

export interface RitualOutcome {
  id: string
  userId: string
  timestamp: Timestamp

  // Context (todos opcionales para cubrir modo plano)
  coffeeId?: string
  recipeId?: string
  coffeeProfileSnapshot?: CoffeeProfile

  // Lo que se preparó
  brewMethod: BrewMethod
  dose: number
  water: number
  ratio: number
  steps?: RecipeStep[]

  // Outcome signals
  satisfaction?: 'great' | 'good' | 'meh'
  tastingId?: string
  cataRating?: number  // copy del rating para queries

  // Privacy
  contributesToCommunity?: boolean  // opt-in
}
```

### 5.2 Extensiones a colecciones existentes

```ts
// Recipe — agregar campos para el affinity cache (opcionales)
export interface Recipe {
  // ... campos existentes
  usageCount?: number  // # de RitualOutcome con este recipeId
  lastUsedAt?: Timestamp
  affinityByProfile?: {
    [profileKey: string]: {
      uses: number
      avgRating: number      // 0-10
      avgSatisfaction: number // 0-1
      updatedAt: Timestamp
    }
  }
}
```

### 5.3 Firestore rules

```javascript
// firestore.rules — additions

match /ritualOutcomes/{outcomeId} {
  // Solo el dueño lee/escribe sus outcomes
  allow read: if request.auth != null && resource.data.userId == request.auth.uid;
  allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
  allow update: if request.auth != null && resource.data.userId == request.auth.uid;
  allow delete: if false;  // outcomes son inmutables, solo el sistema los elimina
}

// Recipes — affinityByProfile sigue las mismas rules que el resto del Recipe doc
// (no requiere nuevas, ya está cubierto)
```

### 5.4 Índices compuestos

```json
// firestore.indexes.json — additions

{
  "collectionGroup": "ritualOutcomes",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "recipeId", "order": "ASCENDING" },
    { "fieldPath": "timestamp", "order": "DESCENDING" }
  ]
}
```

---

## 6 · Versión Lite — Sorbo Pour

### 6.1 Arquitectura

**Decisión**: subdominio `pour.sorbo.app` con la misma codebase Nuxt.

Razón vs subdominio en proyecto separado:
- Cero duplicación del design system
- Un solo deploy en Vercel (gratis, sin cargo extra)
- SEO independiente por subdominio (Google ranquea separado)
- Manifiest PWA propio del subdominio (instalación native-like independiente)

### 6.2 Detección del modo Lite

Middleware Nuxt + state global:

```ts
// middleware/lite-detector.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const host = useRequestHeader('host') || (process.client ? location.host : '')
  const isLite = host.startsWith('pour.') || to.path.startsWith('/brew')
  useState('isLite', () => isLite)
})
```

### 6.3 Rutas y layout

- `/pages/brew/index.vue` — entry del Lite. Render el RitualWizard en modo manual.
- `/layouts/lite.vue` — sin sidebar, sin TabBar, footer minimal con CTA de conversión

### 6.4 Diferencias funcionales

| | Sorbo full | Sorbo Pour (Lite) |
|---|---|---|
| Auth | Sí | No |
| Café | De colección | Quick-add inline ("Nombre · Roast · Process") |
| Método | Algoritmo + tu historial | Algoritmo solo |
| Ratio | Algoritmo + paladar | Algoritmo genérico |
| Receta | Tuyas + comunidad | Set de 8-12 recetas curadas (hardcoded del seed) |
| Persistencia | Firestore | localStorage (último ritual) |
| Cata al final | Wizard completo | "¿Te gustó?" 3 botones simples |
| Outcomes | Tracking + affinity | No tracking |

### 6.5 Funnel de conversión

Tres touchpoints discretos:

1. **Header del Lite**: badge "Sorbo Pour" con link discreto a sorbo.app
2. **Dentro del flujo**: en stage Receta, sobre la lista de recetas curadas, un mini-banner: *"En Sorbo full puedes usar recetas de la comunidad y las tuyas. [Crear cuenta]"*
3. **Al cierre del ritual**: card de invitación con copy editorial — *"Este ritual no se guardó. En Sorbo, cada vertido vive en tu diario y aprende contigo. [Crear cuenta gratis]"*

Todos los CTAs llevan a `sorbo.app/register?source=pour` para tracking de funnel.

### 6.6 PWA installable

`public/brew-manifest.json`:
```json
{
  "name": "Sorbo Pour",
  "short_name": "Pour",
  "description": "Tu compañero de preparación.",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#2F3528",
  "background_color": "#141712",
  "icons": [...]
}
```

Vercel sirve este manifest en `pour.sorbo.app/manifest.json` vía rewrite rule en `vercel.json`. iOS/Android pueden "Add to Home Screen", queda instalado como app independiente.

### 6.7 Marketing OG image dedicada

`/public/og-image-pour.png` con un crop diferente del wordmark + tagline corto: *"Tu compañero de preparación."*

---

## 7 · Plan de implementación

### 7.1 Fases

| # | Fase | Esfuerzo | Output |
|---|---|---|---|
| 0 | **Diseño** (este doc) | — | Documento validado, decisiones cerradas |
| 1 | **Visual language + microinteractions** | 1 día | Componentes base: `<RitualBackground>`, `<RitualParticles>`, `<RitualTransition>`, sellos SVG |
| 2 | **Flujo end-to-end con stubs** | 1 día | RitualWizard con 6 stages, navegación, datos stub |
| 3 | **Algoritmo de recomendación rule-based** | 0.5 día | `useBrewIntelligence.ts` con tests |
| 4 | **Integración entry points** | 0.5 día | 4 entries (café, receta, método, dashboard) |
| 5 | **Tracking de outcomes** | 0.5 día | Modelo + store + Firestore rules + writes |
| 6 | **Affinity learning** | 0.5 día | Profile derivation + cache + integración en scoring |
| 7 | **Sonidos + haptics** | 0.5 día | `useRitualSound()` generativo + patrones haptic |
| 8 | **Lite version routing** | 0.5 día | `/brew`, layout lite, recetas curadas hardcoded |
| 9 | **Subdominio + DNS + PWA** | 0.5 día | Vercel, manifest, verificación install |
| 10 | **Verificación + polish final** | 0.5 día | Testing manual, ajustes de timing, copy review |

**Total**: ~6-7 días de trabajo enfocado.

### 7.2 Hitos de validación

- Después de fase 2: prototipo navegable, sin algoritmo, para feedback de UX
- Después de fase 4: feature funcional con datos reales en una rama de QA
- Después de fase 7: experiencia completa con sonido, para QA sensorial
- Después de fase 9: Lite en `pour.sorbo.app` para soft launch

### 7.3 Lo que se mantiene del código actual

- Todo el design system: tokens, componentes UI, patterns
- Catálogos: brewMethodOptions, catalog de procesos, etc.
- `useHaptic`, `useAnalytics`, `useConfirm`, `useFirebase`
- Stores: recipesStore, coffeesStore, tastingsStore

### 7.4 Lo que se construye nuevo

- `components/ritual/Wizard.vue` (versión nueva, no la borrada)
- `components/ritual/*` (Background, Particles, Transition, LiquidColumn, Stamps)
- `composables/useBrewIntelligence.ts`
- `composables/useRitualSound.ts`
- `pages/app/ritual.vue` (router para feature full)
- `pages/brew/index.vue` (entry del Lite)
- `layouts/lite.vue`
- `stores/ritualOutcomes.ts`
- `public/manifest-pour.json` + assets OG del Pour

---

## 8 · Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Recomendaciones se sienten "mágicas" sin transparencia | Cada match incluye `reason` en lenguaje natural. El usuario siempre ve por qué |
| Reglas heurísticas mal calibradas al inicio | Empezar conservador. Pesos configurables. Calibrar con 5-10 cafés reales antes de lanzar |
| Sonidos molestan en lugar de apoyar | Default OFF. Toggle bien visible. Si lo activas, drone ambient comienza muy bajo |
| Lite canibaliza la versión full | Funnel diseñado para que el Lite sea trailer, no producto sustituto. Solo 8-12 recetas, sin guardado |
| Outcomes consumen cuota Firestore | Free tier: 20k writes/día. Un usuario activo hace ~5 outcomes/día. Soporta 4000 usuarios activos diarios. Suficiente para mucho tiempo |
| Web Audio API en iOS Safari requiere user gesture | El AudioContext se inicializa en el primer tap del wizard (el del botón "Iniciar el vertido"), no antes. Ya queda autorizado |
| Subdominio Lite causa confusión SEO | Robots.txt en `pour.sorbo.app` se enlaza claramente a sorbo.app. Title tags propios. Distintos canonical URLs |
| Dark pattern accidental en CTAs de conversión Lite | Copy lo más honesto posible: nada de "Tu ritual se eliminará en 24h"... Solo invitación clara con beneficios concretos |

---

## 9 · Decisiones abiertas

Antes de codear, los puntos que aún quiero confirmar contigo:

1. **¿Cuántas recetas curadas vivirán en el Lite?** Mi propuesta: 8 (V60, Chemex, Aeropress × 2 estilos cada uno + French Press + Espresso). Curaduría manual.

2. **¿Las recetas comunidad para el algoritmo de matching se restringen a "verificadas"?** Mi propuesta inicial: usar todas las `visibility = 'community'`, pero ponderar con `popularity` para que las mal hechas no suban. Sin verificación humana extra.

3. **¿El toggle "contribuir outcomes anónimos a la comunidad" arranca ON o OFF?** Mi propuesta: OFF por privacidad. Lo invitamos a activar después del primer ritual con un sheet contextual.

4. **¿"El Vertido" como nombre interno se traduce a "The Pour" en algún momento o se mantiene en español siempre?** Mi propuesta: siempre español. La consistencia con Mi colección / Tus catas / La comunidad es fuerte y el español italic es parte de la marca Sorbo.

5. **¿Quieres que el cronómetro tenga opción de modo "manual" donde el usuario hace tap-to-next-phase en lugar de timer automático?** Algunos brewers prefieren controlar manualmente. Mi propuesta: por ahora no, pero documentado como future enhancement.

---

## 10 · Resumen ejecutivo

| | |
|---|---|
| **Qué construimos** | El Vertido (feature interna) + Sorbo Pour (lite público) |
| **Diferenciador** | Café-first + inteligencia local + comunidad colaborativa + cierre del ciclo en el diario |
| **Visual identity** | Lenguaje propio (niebla derivante, columna líquida, sellos editoriales, wash transitions, sonido generativo) |
| **Algoritmo** | Reglas heurísticas + capa colaborativa (affinity), todo client-side, cero Cloud Functions |
| **Infra adicional** | Subdominio en Vercel (gratis), manifest PWA dedicado, índice Firestore compuesto |
| **Esfuerzo** | ~6-7 días de implementación enfocada |
| **Riesgo principal** | Calibración inicial del algoritmo. Mitigado con calibración manual de 10 cafés antes de lanzar |
| **Output esperado** | Feature que cierra el ciclo de Sorbo + landing pública que actúa de funnel marketing |

---

## Próximo paso

Revisa este documento y dame feedback en:
- Naming (validar "El Vertido" + "Sorbo Pour")
- Visualizaciones propuestas (especialmente columna líquida vs alternativas)
- Modelo de datos
- Las 5 decisiones abiertas en sección 9

Cuando aprueben las decisiones, empiezo por la **Fase 1** (visual language + microinteractions) en una nueva rama `el-vertido`. Esto produce los componentes atómicos antes que el flujo, para iterar el feel rápido sin tocar la lógica.
