# Aguirre Pozuelo — Design Tokens

Sistema de diseño para el rediseño editorial de la web. Cada decisión está justificada para evitar drift en futuras iteraciones.

## 1. Dirección de arte

**Tono**: casa de comidas vasco-navarra elevada a revista editorial gastronómica contemporánea. Densa donde el producto manda, respirada donde la palabra manda. Geometría predominantemente recta — sin redondeos genéricos de SaaS — con redondos sólo para badges, avatares y un círculo del cursor custom.

**Referencias mentales**: Disfrutar Barcelona (editorial), Etxebarri (artesanal), Magazine Apartamento (tipografía), Aesop (sobriedad textual).

## 2. Paleta (validada contra el sitio original)

Se mantiene el rojo granate del original (`#C2484E`) como token base de identidad, pero el sistema usa un burdeos más profundo (`#7E1F26`) para botones primarios y elementos importantes — el resultado es más vinoso, menos «terracotta plantilla».

```
--ink-deep:       #14110F   /* casi negro, cálido, para texto principal */
--ink:            #1C1814   /* texto secundario sobre crema */
--ink-soft:       #2E2925
--stone:          #5B524C   /* cuerpos de texto largos */
--stone-soft:     #8B827B   /* metadatos */
--cream:          #F4ECDC   /* fondo de secciones, cálido */
--cream-soft:     #FAF4E8   /* fondo de cards y bandas suaves */
--bone:           #E5D8BF   /* divisores, fondos hover */
--paper:          #FFFFFF

--wine:           #7E1F26   /* PRIMARY — burdeos profundo */
--wine-deep:      #5C141A   /* hover de primary */
--wine-bright:    #C2484E   /* burdeos del logo original — acento, glows, tags */
--wine-pale:      #F5E5E2   /* fondos suaves teñidos */

--gold-pale:      #C9A86C   /* acentos editoriales sutiles, no decorativos */
--gold-deep:      #8E6A2C

--olive-deep:     #3D4632   /* ocasional, acentos secundarios */
```

**Reglas de uso**:
- Botón primario: fondo `wine`, hover `wine-deep`, sombra `0 2px 24px rgba(126, 31, 38, 0.18)`.
- Acentos editoriales (eyebrows, dot dividers, comilla gigante): `wine-bright`.
- Oro: SOLO en menciones de reconocimientos premium (Solete, estrellas TripAdvisor) y en la sutil firma «Ongi etorri». NUNCA en CTAs.
- Cream es el fondo dominante. Paper es para cards y overlays.

## 3. Tipografía

```
Display:  Fraunces           (variable, opsz 9-144, ital, SOFT)
UI/Body:  Inter              (variable, wght 100-900)
Accent:   Cormorant Garamond (italic, para frases evocadoras)
```

**Por qué Fraunces, no Playfair**: Playfair se ha vuelto el serif default de plantillas de restaurante. Fraunces tiene `opsz` real (cuanto más grande, más display contrast) y axis SOFT (curvas suavizadas en titulares), lo que aporta un look editorial moderno y poco visto.

**Escala (clamp fluido)**:
```
--fs-display-xl: clamp(3.25rem, 7.6vw, 6.75rem)   /* Hero H1 */
--fs-display-lg: clamp(2.5rem, 5.4vw, 4.5rem)    /* H2 secciones */
--fs-display-md: clamp(1.9rem, 3.6vw, 3rem)      /* H3 grandes */
--fs-display-sm: clamp(1.35rem, 2.4vw, 2rem)     /* H3 cards */
--fs-body-lg:    clamp(1.05rem, 1.3vw, 1.18rem)  /* párrafos editoriales */
--fs-body:       1rem
--fs-body-sm:    0.875rem
--fs-meta:       0.75rem
--fs-micro:      0.6875rem                        /* eyebrows */
```

**Tracking**:
- Display: `-0.02em` (apretado, premium)
- Eyebrows (mayúsculas): `0.22em`
- UI buttons: `0.08em`
- Body: default

**Line-height**:
- Display: `0.98`–`1.06`
- Body: `1.7` (generoso)
- UI: `1.2`

## 4. Espaciado (escala 4-base)

```
--s-1:  4px
--s-2:  8px
--s-3:  12px
--s-4:  16px
--s-5:  24px
--s-6:  32px
--s-7:  48px
--s-8:  64px
--s-9:  96px
--s-10: 128px
--s-11: 160px
```

**Sección padding vertical**: `clamp(72px, 9vw, 144px)` arriba/abajo. Da ritmo editorial.

## 5. Layout

```
--max-w:        1320px
--max-w-text:   720px
--max-w-wide:   1480px
--gutter:       clamp(20px, 4vw, 56px)
--header-h:     84px (desktop) · 64px (mobile)
```

Breakpoints (mobile-first):
- `640px` — tablet vertical
- `960px` — tablet horizontal
- `1280px` — desktop
- `1600px` — wide

## 6. Radios

```
--r-0: 0
--r-1: 2px   /* cards grandes, inputs */
--r-2: 4px   /* botones */
--r-pill: 999px /* badges, chips */
--r-circle: 50%
```

## 7. Sombras

Tonalidad cálida (no negro puro), sutiles.

```
--shadow-1: 0 1px 2px rgba(28, 24, 20, 0.04)
--shadow-2: 0 8px 24px -8px rgba(28, 24, 20, 0.10)
--shadow-3: 0 24px 60px -16px rgba(28, 24, 20, 0.18)
--shadow-glow-wine: 0 6px 28px -6px rgba(126, 31, 38, 0.32)
--shadow-press: 0 1px 0 rgba(28, 24, 20, 0.04)
```

## 8. Easings y duraciones

```
--ease-out-expo:  cubic-bezier(0.22, 1, 0.36, 1)    /* default reveals */
--ease-out-soft:  cubic-bezier(0.16, 1, 0.3, 1)     /* hover, springs */
--ease-in-sharp:  cubic-bezier(0.7, 0, 0.84, 0)     /* salidas */
--ease-linear:    linear

--dur-fast:   180ms
--dur-base:   320ms
--dur-slow:   600ms
--dur-reveal: 900ms
--dur-cinema: 1200ms
```

## 9. Animaciones decididas

- Hero word-split: stagger 80ms por palabra, fade + translateY 24→0, easing exp.out.
- Hero slider: cross-fade 1.6s, autoplay 7s, Ken Burns 22s scale 1→1.06.
- Marquee reconocimientos: scroll lineal, 38s loop.
- Reveal default: opacidad 0→1 + translateY 32px→0 en 900ms exp.out, trigger al 78% viewport.
- Imagen clip-path reveal: inset(100% 0 0 0)→inset(0), 1.2s, + scale 1.04→1.
- Carrusel testimonios: 7s autoplay, transición clip-path horizontal 700ms.
- Loader inicial: 900ms total (logo fade 400ms + barra cruza 500ms), una sola vez vía localStorage.
- Cursor custom: SOLO `pointer:fine` y `prefers-reduced-motion: no-preference`.

## 10. Imágenes

Todas remotas desde `aguirrepozuelo.com/wp-content/uploads/`. Cero stock, cero IA. Inventario verificado (mínimo 25 URLs) en uso a lo largo del sitio. Cuando una sección requiera una foto inexistente, se deja `<!-- TODO: pedir foto a cliente: [descripción] -->`.

## 11. Iconografía

Set SVG custom line-art, stroke 1.5px, color `currentColor`, viewBox 24×24. Cero emojis decorativos. Familia coherente: copa, mantel/servilleta plegada, auriculares/dj, jamón, anchoa estilizada, scroll-down, flecha, social brands minimalistas.

## 12. Accesibilidad

- Focus visible: outline 2px `wine`, offset 3px, radius 2px.
- Contraste mínimo verificado AA en todos los pares texto/fondo críticos.
- `prefers-reduced-motion: reduce` desactiva: slider autoplay, Ken Burns, parallax, cursor custom, page transitions, scroll-triggered reveals. Mantiene fades.
- Hit targets ≥ 44×44 px.
- Saltar al contenido siempre presente.

## 13. SEO técnico

- JSON-LD Restaurant expandido (menu URLs, acceptsReservations, hasMap, sameAs, hasMenu por tipo).
- Open Graph image 1200×630 generada con la foto del salón + overlay + logotipo.
- `<link rel="canonical">` por página.
- Meta description única por página.
- Sitemap.xml + robots.txt (TODO entrega final).

## 14. Performance

- Fuentes con `&display=swap` y preconnect.
- GSAP + Lenis vía CDN con `defer`.
- Imágenes `loading="lazy" decoding="async"`, dimensiones explícitas cuando sea posible para evitar CLS.
- CSS único, minificable.

## 15. Decisiones explícitas que NO se toman

- **No Tailwind**. Custom CSS con BEM-light.
- **No SPA**. Páginas multipágina con transición de cortina entre clics.
- **No JS frameworks**. Vanilla puro.
- **No glassmorphism** salvo donde la legibilidad lo exige (overlay del header solo después de scroll).
- **No emojis** decorativos.
- **No gradientes morados/azules** «tech».
