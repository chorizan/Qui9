/**
 * Referencia a una imagen del sitio.
 *
 * `base` es la ruta sin extensión ni ancho: `assets/img/andes-dawn`.
 * El componente `app-img` construye a partir de ella el `srcset` WebP
 * (`-640`, `-1024`, `-1600`) y el fallback JPG.
 */
export interface ImageAsset {
  /** Ruta base sin extensión, relativa a la raíz del sitio. */
  base: string;
  /** Texto alternativo obligatorio por accesibilidad. */
  alt: string;
  /** Relación de aspecto (ancho / alto) para reservar el espacio y evitar CLS. */
  ratio?: number;
  /** Punto focal del recorte cuando la imagen se usa como fondo. */
  focus?: string;
}
