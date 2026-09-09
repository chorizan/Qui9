/**
 * Configuración de marca y navegación.
 * Punto único para cambiar nombre, claim, contacto o enlaces.
 */
export const SITE = {
  name: 'QUI9',
  claim: 'El sabor de los Andes.',
  description:
    'Descubre nuestra quinua peruana, seleccionada desde los Andes y llevada hasta tu mesa.',
  url: 'https://qui9.pe',
  email: 'hola@qui9.pe',
  phone: '+51 000 000 000',
  address: 'Lima, Perú',
  currency: 'PEN',
  currencySymbol: 'S/',
  social: [
    { label: 'Instagram', url: '#', handle: '@qui9.pe' },
    { label: 'Facebook', url: '#', handle: 'QUI9' },
    { label: 'TikTok', url: '#', handle: '@qui9' },
  ],
} as const;

export interface NavLink {
  label: string;
  /** Ruta Angular o ancla dentro de la home. */
  path: string;
  fragment?: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: 'Inicio', path: '/' },
  { label: 'Nuestra historia', path: '/', fragment: 'historia' },
  { label: 'Origen', path: '/', fragment: 'origen' },
  { label: 'Productos', path: '/productos' },
  { label: '3D', path: '/', fragment: 'experiencia-3d' },
  { label: 'Recetas', path: '/', fragment: 'recetas' },
  { label: 'Contacto', path: '/', fragment: 'contacto' },
];

export const FOOTER_LINKS = {
  navegacion: [
    { label: 'Inicio', path: '/' },
    { label: 'Nuestra historia', path: '/', fragment: 'historia' },
    { label: 'Productos', path: '/productos' },
    { label: 'Recetas', path: '/', fragment: 'recetas' },
    { label: 'Contacto', path: '/', fragment: 'contacto' },
  ],
  legal: [
    { label: 'Política de privacidad', path: '/' },
    { label: 'Términos y condiciones', path: '/' },
    { label: 'Libro de reclamaciones', path: '/' },
  ],
};

/** Departamentos del Perú para el formulario de checkout. */
export const DEPARTAMENTOS = [
  'Amazonas',
  'Áncash',
  'Apurímac',
  'Arequipa',
  'Ayacucho',
  'Cajamarca',
  'Callao',
  'Cusco',
  'Huancavelica',
  'Huánuco',
  'Ica',
  'Junín',
  'La Libertad',
  'Lambayeque',
  'Lima',
  'Loreto',
  'Madre de Dios',
  'Moquegua',
  'Pasco',
  'Piura',
  'Puno',
  'San Martín',
  'Tacna',
  'Tumbes',
  'Ucayali',
];
