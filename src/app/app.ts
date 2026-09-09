import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { ScrollService } from './core/services/scroll.service';
import { CartDrawerComponent } from './shared/components/cart-drawer/cart-drawer';
import { CustomCursorComponent } from './shared/components/custom-cursor/custom-cursor';
import { FooterComponent } from './shared/components/footer/footer';
import { NavbarComponent } from './shared/components/navbar/navbar';
import { PreloaderComponent } from './shared/components/preloader/preloader';

/**
 * Contenedor de la aplicación: capas persistentes (preloader, cursor,
 * navegación, carrito y pie) alrededor del `router-outlet`.
 */
@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    PreloaderComponent,
    CustomCursorComponent,
    NavbarComponent,
    FooterComponent,
    CartDrawerComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly scroll = inject(ScrollService);
  private readonly router = inject(Router);

  constructor() {
    afterNextRender(() => {
      this.scroll.init();

      // Cada navegación empieza arriba y recalcula los disparadores de scroll.
      this.router.events
        .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
        .subscribe((event) => {
          if (event.urlAfterRedirects.includes('#')) return;
          this.scroll.toTop();
          setTimeout(() => this.scroll.refresh(), 260);
        });
    });
  }
}
