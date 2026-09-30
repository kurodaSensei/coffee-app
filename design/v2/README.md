# Sorbo

Sorbo es un diario de café para anotar cada taza en segundos y compartirla con tu gente. Este sistema (v2) conserva la identidad de v1 (paleta de campo, DM Serif Display, tono cercano) y la lleva a una interfaz de app: una acción principal siempre visible, controles grandes, menos texto decorativo.

Las pantallas de referencia están en el canvas «Sorbo · Rediseño app».

## Principios

1. **Una taza, una nota.** La unidad del producto es la nota. El café es un dato de la nota: se escribe o se elige de recientes, nunca es un paso previo obligatorio.
2. **Veinte segundos.** Anotar cabe en una sola hoja: café, puntaje, sabores, nota. Todo lo demás (método, receta, dosis, atributos) va plegado en «Más detalles».
3. **Una acción principal por pantalla.** El botón + central (`action-bg`) es la acción de la app. Dentro de una pantalla hay un solo botón `primary`.
4. **Mostrar lo avanzado solo cuando se pide.** Proceso, variedad, SCA y atributos existen, pero nunca en el camino principal.
5. **Social ligero.** Brindar (reacción) y «Quiero probarlo» (a la wishlist). Nada de comentarios largos ni métricas públicas.

## Voz y contenido

- Tuteo, español neutro, frases cortas. «Anota tu primera taza», no «Registra tu primera degustación».
- Vocabulario de la persona, no del catador: **nota** (no «cata»), **puntaje** (no «score»), **sabores** (no «notas de sabor»), **marca** (no «tostador»), **preparar** (no «extracción»).
- Botones con verbo y objeto: «Guardar nota», «Repetir», «Compartir».
- El puntaje se dice con palabras: 1 Meh · 2 Bien · 3 Rico · 4 Muy rico · 5 Wow. Se guarda como 2, 4, 6, 8, 10 para ser compatible con los datos de v1 (escala 0–10).
- Sin emoji en la interfaz. Sin mayúsculas sostenidas.

## Fundamentos visuales

### Color

- Fondo `bg`; todo lo agrupable vive en `surface` con radio, **sin bordes finos**. `line` solo separa filas dentro de una lista agrupada.
- `primary` (oliva en claro, salvia en oscuro) marca lo elegido y la acción de guardar. Texto encima: `on-primary`.
- `brand-jungle` + `brand-honey` es la firma de marca y se reserva para: el botón +, el puntaje elegido y la tarjeta «¿Qué estás tomando hoy?». Si aparece en más sitios pierde fuerza.
- Texto: `ink` y `ink-soft`. `ink-faint` no se usa para texto (3:1 sobre `bg`).
- `danger` solo para errores, borrar y el punto de notificaciones.

### Tipografía por rol

| Familia | Rol | Estilos |
| --- | --- | --- |
| DM Serif Display | Títulos de pantalla, nombres de café, puntaje, la cita de la nota | `title-lg`, `title-md`, `coffee-name`, `score`, `quote` |
| Geist | Toda la interfaz | `body`, `body-strong`, `button`, `label`, `meta`, `caption`, `tab` |
| JetBrains Mono | Solo cifras de preparación | `data` |

Retirados de v1: eyebrows mono en mayúsculas (`— CAFÉ`), ayudas en serif itálica bajo cada campo, saludos de 40–96 px.

### Espacio, radios y tamaños

- Margen lateral `space-4` (16 px). Secciones separadas por `space-5`.
- Radios por rol: `radius-sm` campos y miniaturas, `radius-md` botones y listas, `radius-lg` tarjetas, `radius-xl` superficies de marca, `radius-sheet` hojas.
- Ningún control mide menos de `touch-min` (44 px). Campos `field-height` 48 px, botones `button-height` 52 px, chips `chip-height` 34 px.

### Superficies y movimiento

- Una sola sombra: `shadow-sheet`, para hojas inferiores. Las tarjetas no llevan sombra.
- Crear y editar se hace en hojas que suben desde abajo; el detalle se abre empujando la pantalla. Transiciones de 200 ms con `cubic-bezier(0.4, 0, 0.2, 1)`; respetar `prefers-reduced-motion`.

## Iconografía

Lucide, trazo 1.75 en reposo y 2 en activo, 24 px en la barra y 20–22 px en cabeceras. Iconos de la barra: libro abierto (Diario), personas (Amigos), + (Anotar), temporizador (Preparar), persona (Yo). Taza para brindar, marcador para «Quiero probarlo». Todo botón solo-icono lleva `aria-label`.

## Navegación

Barra inferior de 84 px: **Diario · Amigos · + · Preparar · Yo**. El + abre la hoja «Nueva nota» desde cualquier pestaña. Los catálogos de v1 (Marcas, Variedades, Métodos, Procesos, Notas) viven en Yo → Personalizar listas.

## Componentes

- **Button**: primario, secundario y de marca; 52 px.
- **Chip**: sabores y filtros, seleccionable, 34 px.
- **Switch**: interruptor para compartir y recordatorios.
- **Field**: campo relleno con etiqueta encima.
- **ScorePicker**: cinco opciones con número y palabra.
- **NoteCard**: la entrada del diario.
- **ListGroup**: filas agrupadas en Yo y Ajustes.
- **TabBar**: barra inferior con el botón + central.

## Accesibilidad

- Texto ≥4.5:1 en ambos temas; `ink-soft` es el gris mínimo.
- Selección indicada por color y por forma (relleno completo), nunca solo por tono.
- Foco visible: contorno de 2 px en `primary` con separación de 2 px.
