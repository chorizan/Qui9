import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { NAV_LINKS, NavLink } from '../../../core/data/site.data';
import { CursorTargetDirective, MagneticDirective } from '../../../core/directives';
import { CartService } from '../../../core/services/cart.service';
import { ScrollService } from '../../../core/services/scroll.service';
import { UiService } from '../../../core/services/ui.service';
import { LogoComponent } from '../logo/logo';

/**
 * Navegación principal.
 *
 * · Transparente sobre el hero, sólida y más baja al hacer scroll.
 * · Se oculta al bajar y reaparece al subir, para no tapar el contenido.
 * · En móvil, menú a pantalla completa con revelado por clip-path.
 */
@Component({
  selector: 'app-navbar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LogoComponent, MagneticDirective, CursorTargetDirective],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class NavbarComponent {
  protected readonly ui = inject(UiService);
  protected readonly cart = inject(CartService);
  private readonly scroll = inject(ScrollService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly links = NAV_LINKS;

  protected readonly scrolled = signal(false);
  protected readonly hidden = signal(false);

  /** Sólida en cuanto el usuario se separa del inicio de la página. */
  protected readonly solid = computed(() => this.scrolled());
  /** Transparente sobre una primera pantalla clara: el texto pasa a azul. */
  protected readonly onLight = computed(
    () => !this.solid() && this.ui.headerTheme() === 'light',
  );

  /** Micro-animación del contador al añadir un producto. */
  protected readonly bump = signal(false);

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => this.ui.closeMenu());

    effect(() => {
      // `lastAdded` cambia en cada alta: sirve de disparador para el rebote.
      if (!this.cart.lastAdded()) return;
      this.bump.set(true);
      setTimeout(() => this.bump.set(false), 620);
    });

    afterNextRender(() => this.watchScroll());
  }

  private watchScroll(): void {
    let previous = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const current = window.scrollY;
        this.scrolled.set(current > 40);
        // Sólo se esconde tras dejar atrás el hero y si no hay capas abiertas.
        this.hidden.set(
          current > 320 && current > previous + 4 && !this.ui.menuOpen() && !this.ui.cartOpen(),
        );
        previous = current;
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    this.destroyRef.onDestroy(() => window.removeEventListener('scroll', onScroll));
  }

  /** Enlaces con ancla: navegan a la home y luego desplazan a la sección. */
  protected go(link: NavLink, event: Event): void {
    if (!link.fragment) {
      this.ui.closeMenu();
      return;
    }

    event.preventDefault();
    this.ui.closeMenu();

    const scrollToFragment = () =>
      setTimeout(() => this.scroll.scrollTo(`#${link.fragment}`, -80), 120);

    if (this.router.url.split('#')[0] !== link.path) {
      void this.router.navigateByUrl(link.path).then(scrollToFragment);
    } else {
      scrollToFragment();
    }
  }
}
