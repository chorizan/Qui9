import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FOOTER_LINKS, SITE } from '../../../core/data/site.data';
import { CursorTargetDirective, RevealDirective } from '../../../core/directives';
import { ScrollService } from '../../../core/services/scroll.service';
import { LogoComponent } from '../logo/logo';

/** Pie de página premium: contacto, navegación, legal y redes. */
@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LogoComponent, RevealDirective, CursorTargetDirective],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class FooterComponent {
  private readonly scroll = inject(ScrollService);
  private readonly router = inject(Router);

  protected readonly site = SITE;
  protected readonly links = FOOTER_LINKS;
  protected readonly year = new Date().getFullYear();

  protected navigate(path: string, fragment?: string, event?: Event): void {
    if (!fragment) return;
    event?.preventDefault();
    const scrollToFragment = () => setTimeout(() => this.scroll.scrollTo(`#${fragment}`, -80), 120);

    if (this.router.url.split('#')[0] !== path) {
      void this.router.navigateByUrl(path).then(scrollToFragment);
    } else {
      scrollToFragment();
    }
  }

  protected toTop(): void {
    this.scroll.scrollTo(0);
  }
}
