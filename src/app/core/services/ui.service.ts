import { Injectable, computed, effect, signal } from '@angular/core';

export type CursorVariant = 'default' | 'link' | 'view' | 'explore' | 'drag' | 'hidden';

/**
 * Estado transversal de la interfaz: preloader, menú móvil, carrito y cursor.
 * Los componentes se limitan a leer/escribir aquí, sin conocerse entre ellos.
 */
@Injectable({ providedIn: 'root' })
export class UiService {
  // --- Preloader -------------------------------------------------
  readonly loadProgress = signal(0);
  readonly introComplete = signal(false);

  // --- Overlays ---------------------------------------------------
  readonly menuOpen = signal(false);
  readonly cartOpen = signal(false);

  // --- Cursor personalizado ---------------------------------------
  readonly cursorVariant = signal<CursorVariant>('default');
  readonly cursorLabel = signal('');

  /**
   * Tono de la primera pantalla de cada página. La barra de navegación es
   * transparente arriba del todo, así que necesita saber si el fondo que
   * tiene detrás es azul (`dark`) o marfil (`light`) para elegir su color.
   */
  readonly headerTheme = signal<'dark' | 'light'>('dark');

  /** Cualquier capa que bloquee el scroll del documento. */
  readonly scrollLocked = computed(() => this.menuOpen() || this.cartOpen() || !this.introComplete());

  constructor() {
    effect(() => {
      if (typeof document === 'undefined') return;
      document.body.classList.toggle('is-locked', this.scrollLocked());
    });
  }

  openCart(): void {
    this.menuOpen.set(false);
    this.cartOpen.set(true);
  }

  closeCart(): void {
    this.cartOpen.set(false);
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  /** Cada página declara el tono de su primera pantalla al montarse. */
  setHeaderTheme(theme: 'dark' | 'light'): void {
    this.headerTheme.set(theme);
  }

  setCursor(variant: CursorVariant, label = ''): void {
    this.cursorVariant.set(variant);
    this.cursorLabel.set(label);
  }

  resetCursor(): void {
    this.cursorVariant.set('default');
    this.cursorLabel.set('');
  }
}
