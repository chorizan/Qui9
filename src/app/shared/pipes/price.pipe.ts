import { Pipe, PipeTransform } from '@angular/core';
import { SITE } from '../../core/data/site.data';

/**
 * Formatea un importe en soles: `24.9 → S/ 24.90`.
 * Evita cargar los datos de localización completos de Angular para un
 * único formato de moneda.
 */
@Pipe({ name: 'price' })
export class PricePipe implements PipeTransform {
  transform(value: number | null | undefined, symbol = SITE.currencySymbol): string {
    if (value === null || value === undefined || Number.isNaN(value)) return '—';
    const formatted = value.toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${symbol} ${formatted}`;
  }
}
