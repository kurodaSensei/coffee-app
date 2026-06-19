# El Vertido — Estado de la rama `el-vertido`

> Esta rama queda **archivada** mientras volvemos a `main` para ajustes
> en otras áreas. Todo el trabajo está commiteado y pusheado a `origin`.
> No borrar.

## Resumen

Rama: `el-vertido` (8 commits ahead de `main` al momento del archivo).

El feature "El Vertido" llega hasta la Fase 2.x del plan original
(`design/el-vertido.md` §7) con el rediseño de Claude Design aplicado.
El flow corre end-to-end con stubs — el algoritmo de Affinity Score y
la persistencia del `RitualOutcome` quedan pendientes.

## Lo que está hecho

### Fase 1 — Átomos visuales (`586b67b`)
- `components/vertido/Stamp.vue` — 6 sellos editoriales SVG.
- `components/vertido/Background.vue` — paleta editorial sólida (sin blobs).
- `components/vertido/Particles.vue` — gránulos honey, solo activos en POUR.
- `components/vertido/Transition.vue` — wash radial entre stages.
- `pages/dev/vertido-atoms.vue` — sandbox dev.

### Fase 2 — Flow end-to-end con stubs (`4c6de93`)
- `composables/useVertidoSession.ts` — estado compartido del flow.
- `components/vertido/stages/Stage{Coffee,Method,Recipe,Adjust,Pour,Close}.vue`.
- `pages/app/vertido.vue` — shell con back, transición, particles condicionales.
- Entry point desde el Dashboard ("¿Preparas café?" → `/app/vertido`).

### Fix de bugs visuales (`c274448`)
- Background paper se veía detrás del Vertido (z-index global).
- Clases `text-paper/N` no compilaban — `tailwind.config.ts` migrado a
  `rgb(var(--*-rgb) / <alpha-value>)` con `--paper-rgb`, `--jungle-rgb`,
  `--honey-rgb`, `--moss-rgb` en `assets/css/main.css`.

### Rediseño completo según Claude Design (`88c3fbe`)
- Aplicados los 3 principios: "el fondo es el tiempo" (paleta evoluciona
  por stage, sin progress dots), "un gigante por pantalla", "sellos como
  sellos" (off-axis, 100-140px, opacity 0.13-0.18).
- StagePour ahora tipográfico (Alt A del doc): tiempo a 98px serif con
  colon honey en 70px.
- StageClose invierte a paper — la "salida del umbral".
- LiquidColumn.vue eliminada.
- StageFrame.vue eliminada (cada stage compone su propio layout).

### Iteraciones post-rediseño
- `de3bf32` — Search bar en StageCoffee para colecciones grandes.
- `278e4c1` — Particles forzadas a `opacity: 0` cuando inactivas (estaban
  visibles paused), sello del grano en StageCoffee oculto.
- `a235d84` — StageMethod muestra los 12 métodos con eyebrow dinámico
  ("te sugerimos" / "experimentas") y note italic por método.
- `482096e` — StageRecipe muestra Recomendada + Estándar + Otras tuyas +
  Sin receta. Estándar sintética por método (V60 1:16/3min, Chemex,
  AeroPress, Moka, Phin, Cold brew, etc.), nunca persistida.

## Lo que falta (por orden de prioridad)

### Pendientes funcionales (bloqueantes para producción)

1. **Persistencia del RitualOutcome** — hoy el `setOutcome` actualiza la
   sesión en memoria y descarta al reset. Tiene que persistir a Firestore
   en una colección nueva (`ritualOutcomes/{uid}/...`) para alimentar el
   algoritmo. Ver `design/el-vertido.md` §5.
2. **Author Intent en wizard de receta** — `recipes/{id}.designedFor` +
   sub-colección privada `recipes/{id}/private/inspirations`. Ver
   `design/el-vertido.md` §4.5.

### Pendientes de inteligencia

3. **Affinity Score** — reemplazar los stubs (`suggested: 'v60'` en
   StageMethod, top match plano en StageRecipe) con el algoritmo del
   §4.6. Pool: tus recetas + recetas comunidad del mismo método.
4. **Recetas de la comunidad como cuarta categoría** en StageRecipe.

### Pendientes de UX

5. **Cronómetro lee los `steps` de la receta** — hoy StagePour usa
   tiempos hardcodeados (BLOOM_MS, POUR_END_MS). Debe leer
   `recipe.steps[].timeSeconds` para fases reales.
6. **Modo "nota rápida"** del stage CIERRE — hoy abre el wizard completo
   de cata con flag `?quick=1` pero no hay UI distinta. Toca implementar
   un sheet mínimo (score + comentario).
7. **Tratamiento full-bleed editorial en desktop** — la columna sigue
   siendo `max-w-[480px] lg:max-w-[640px]`. El doc de Claude Design
   especifica un layout distinto por stage en 1200px+ (sección "DESKTOP
   NOTE" del HTML de rediseño). Ver `design/el-vertido.md` §3 nota desk.

### Pendientes de la versión pública

8. **Subdominio `pour.sorbo.app`** con la versión Lite. Ver
   `design/el-vertido.md` §6.

## Lo que dejé deshabilitado

- **Sello del grano en StageCoffee** (`components/vertido/stages/StageCoffee.vue`)
  — comentado, no convencía visualmente. Cuando se retome, ajustar
  silueta del SVG o probar otra esquina.

## Cómo retomar

```bash
git checkout el-vertido
npm run dev
# /app → "¿Preparas café?" → /app/vertido
```

Para iterar átomos sin tocar el flow: `/dev/vertido-atoms`.

## Tareas internas relacionadas

Las tareas de la implementación están en el TaskTracker de Claude Code
con prefijo "Rediseño Vertido —" y "Fase 1/2 —". No relevantes fuera de
esa sesión, pero quedan como rastro.
