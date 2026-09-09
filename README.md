# QUI9 — Quinua peruana premium

Experiencia web de marca y venta para quinua peruana. Angular 22 (standalone +
signals), Three.js para el producto en 3D, GSAP + ScrollTrigger para la
narrativa de scroll y Lenis para el desplazamiento suave.

## Puesta en marcha

```bash
npm install
npm start        # http://localhost:4200
npm run build    # dist/qui9
```

## Cómo está organizado

```
src/
  styles/                 Sistema visual: tokens, mixins, base, tipografía
  app/
    core/
      data/               Contenido mock: productos, editorial, sitio
      models/             Interfaces de dominio
      services/           Product, Cart, Order, Story, Seo, Ui, Device, Scroll
      animations/         Configuración de GSAP y utilidades de revelado
      directives/         appReveal, appParallax, appMagnetic, appCursor
    three/                Escenas 3D: hero, visor de producto, geometría, luces
    shared/components/    Navbar, preloader, cursor, carrito, tarjetas, visor…
    pages/                home (+ secciones), products, product-detail, checkout
public/assets/            Imágenes generadas, marca y modelos 3D
tools/                    Scripts de build de imágenes y revisión visual
```

## Qué se sustituye cuando lleguen los datos reales

| Qué | Dónde |
| --- | --- |
| Productos, precios y pesos | `src/app/core/data/products.data.ts` |
| Historia, recetas, testimonios, sostenibilidad | `src/app/core/data/content.data.ts` |
| Contacto, redes, navegación | `src/app/core/data/site.data.ts` |
| Valores nutricionales | campo `nutrition` de cada producto; `null` se muestra como «Por confirmar» |
| Modelo 3D real | `public/assets/3d/quinoa.glb` (ver el README de esa carpeta) |
| Costes y umbral de envío | `SHIPPING_CONFIG` en `products.data.ts` |

Los servicios devuelven `Observable`, así que conectar una API REST consiste en
cambiar el origen de datos dentro de `ProductService` y `OrderService` sin tocar
los componentes.

## Imágenes

`tools/build-site-images.mjs` estampa la marca sobre los envases, genera las
variantes WebP (640/1024/1600) con respaldo JPG y escribe
`src/app/core/data/image-manifest.ts`, que el componente `app-img` usa para
construir el `srcset` y reservar el espacio de cada imagen.

```bash
node tools/build-brand-assets.mjs   # logotipo, favicon, portada social
node tools/build-site-images.mjs    # imágenes del sitio + manifiesto
```

## Revisión visual

```bash
node tools/tour.mjs http://localhost:4200/ d 1440 900   # recorrido completo
node tools/states.mjs http://localhost:4200/ 390 844 m  # preloader, menú, carrito
node tools/a11y.mjs http://localhost:4200/              # movimiento reducido y foco
```

Las capturas se guardan en `.shots/` (fuera del control de versiones).

## Decisiones que conviene conocer

- **3D con red de seguridad.** Si no hay WebGL o el GLB no existe, el envase se
  genera por geometría y, en último caso, se muestra la fotografía del producto.
  Three.js viaja en un chunk diferido: no entra en el bundle inicial.
- **Rendimiento por dispositivo.** `DeviceService` clasifica el equipo y ajusta
  el número de partículas y el `devicePixelRatio` del render.
- **Movimiento reducido.** Con `prefers-reduced-motion` se desactivan Lenis, las
  animaciones de entrada y el giro del producto; el contenido nace visible.
- **Nada inventado.** Los valores nutricionales, las cifras de sostenibilidad y
  los testimonios aparecen marcados como pendientes o de ejemplo.
