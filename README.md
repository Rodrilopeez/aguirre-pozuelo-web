# Aguirre Pozuelo — Taberna Contemporánea

Sitio web de Aguirre Pozuelo, taberna contemporánea y casa de comidas en Pozuelo de Alarcón.

## Stack

HTML5 + CSS moderno + JavaScript vanilla. Sin build tools. Sin dependencias pesadas.

Dependencias CDN ligeras y opcionales (degradan a CSS si no cargan):
- **Lenis** 1.1.13 — smooth scroll
- **GSAP + ScrollTrigger** 3.12.5 — sólo cargados en el `index.html` para animaciones suaves; el resto de páginas usa IntersectionObserver puro.

## Estructura

```
aguirre-pozuelo-web/
├── index.html                  # Home (hero cinematográfico + 8 secciones)
├── nos-inspira.html            # Historia de Beltza
├── eventos.html                # Eventos y celebraciones
├── productos.html              # Tienda gourmet
├── carta-comida.html           # Carta de comidas
├── carta-bebidas.html          # Carta de bebidas
├── carta-desayunos.html        # Carta de desayunos
├── blog.html                   # Más Aguirre
├── contacto.html               # Contacto + reservas
├── aviso-legal.html            # Legal
├── politica-privacidad.html
├── politica-cookies.html
├── css/style.css               # CSS único
├── js/main.js                  # JS único
├── sitemap.xml                 # SEO
├── robots.txt                  # SEO
└── DESIGN_TOKENS.md            # Sistema de diseño
```

## Sistema de diseño

Ver `DESIGN_TOKENS.md` para paleta, tipografía, escala, easings, sombras y reglas de uso.

## Tipografía

- **Fraunces** — display (con variable axes `opsz` y `SOFT`)
- **Inter** — UI
- **Cormorant Garamond** — itálicas evocadoras

## Imágenes

Todas las imágenes se cargan remotamente desde `aguirrepozuelo.com/wp-content/uploads/`. Cero stock, cero IA.

## Desarrollo local

```bash
npx http-server -p 8000
# luego abrir http://localhost:8000
```

## Accesibilidad

- WCAG AA en contraste verificado en pares críticos
- Navegación 100% por teclado (Tab, Enter, Esc, flechas en sliders)
- Skip link siempre presente
- `prefers-reduced-motion: reduce` desactiva slider autoplay, Ken Burns, parallax, cursor custom, page transitions
- Hit targets ≥ 44×44 px

## SEO

- JSON-LD Restaurant completo en index (hours, menu URLs, geo, sameAs, ratings)
- Open Graph + Twitter cards por página
- `canonical` declarado
- `sitemap.xml` + `robots.txt`

## Despliegue

Sirve cualquier hosting estático (GitHub Pages, Netlify, Vercel, Cloudflare Pages).
