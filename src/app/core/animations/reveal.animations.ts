import { DURATION, EASE, ScrollTrigger, gsap } from './gsap.config';

export type RevealPreset = 'fade' | 'up' | 'mask' | 'scale' | 'blur' | 'line';

export interface RevealOptions {
  preset?: RevealPreset;
  delay?: number;
  duration?: number;
  distance?: number;
  /** Selector de hijos para animar en cascada. */
  stagger?: number;
  children?: string;
  /** Punto de disparo respecto al viewport. */
  start?: string;
  once?: boolean;
}

/** Estado inicial de cada preset (antes de entrar en pantalla). */
function fromVars(preset: RevealPreset, distance: number): gsap.TweenVars {
  switch (preset) {
    case 'fade':
      return { opacity: 0 };
    case 'scale':
      return { opacity: 0, scale: 0.94 };
    case 'blur':
      return { opacity: 0, filter: 'blur(14px)', y: distance * 0.5 };
    case 'mask':
      return { opacity: 1, clipPath: 'inset(0% 0% 100% 0%)', y: distance * 0.4 };
    case 'line':
      return { scaleX: 0, transformOrigin: 'left center' };
    case 'up':
    default:
      return { opacity: 0, y: distance };
  }
}

function toVars(preset: RevealPreset): gsap.TweenVars {
  switch (preset) {
    case 'scale':
      return { opacity: 1, scale: 1 };
    case 'blur':
      return { opacity: 1, filter: 'blur(0px)', y: 0 };
    case 'mask':
      return { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', y: 0 };
    case 'line':
      return { scaleX: 1 };
    case 'fade':
      return { opacity: 1 };
    case 'up':
    default:
      return { opacity: 1, y: 0 };
  }
}

/**
 * Anima la entrada de un elemento (o de sus hijos) al aparecer en pantalla.
 * Devuelve el ScrollTrigger creado para poder destruirlo al salir del DOM.
 */
export function createReveal(host: HTMLElement, options: RevealOptions = {}): ScrollTrigger {
  const {
    preset = 'up',
    delay = 0,
    duration = DURATION.base,
    distance = 42,
    stagger = 0.09,
    children,
    start = 'top 82%',
    once = true,
  } = options;

  const targets: gsap.TweenTarget = children
    ? Array.from(host.querySelectorAll<HTMLElement>(children))
    : host;

  const tween = gsap.fromTo(targets, fromVars(preset, distance), {
    ...toVars(preset),
    duration,
    delay,
    stagger: children ? stagger : 0,
    ease: EASE.out,
    paused: true,
    onStart: () => host.classList.add('is-revealed'),
  });

  return ScrollTrigger.create({
    trigger: host,
    start,
    once,
    onEnter: () => tween.play(),
    onEnterBack: () => {
      if (!once) tween.play();
    },
    onLeaveBack: () => {
      if (!once) tween.reverse();
    },
  });
}

/**
 * Parte el texto de un elemento en palabras envueltas en `<span>`.
 * Mantiene los espacios y permite animar cada palabra por separado.
 */
export function splitIntoWords(el: HTMLElement): HTMLElement[] {
  const source = el.textContent ?? '';
  const words = source.split(/(\s+)/).filter((chunk) => chunk.length > 0);

  el.textContent = '';
  const spans: HTMLElement[] = [];

  for (const chunk of words) {
    if (/^\s+$/.test(chunk)) {
      el.appendChild(document.createTextNode(' '));
      continue;
    }
    const outer = document.createElement('span');
    outer.className = 'word';
    const inner = document.createElement('span');
    inner.className = 'word__inner';
    inner.textContent = chunk;
    outer.appendChild(inner);
    el.appendChild(outer);
    spans.push(inner);
  }

  return spans;
}

/** Desplazamiento parallax controlado por scroll. */
export function createParallax(
  el: HTMLElement,
  speed = 0.15,
  axis: 'y' | 'x' = 'y',
): ScrollTrigger {
  const distance = speed * 100;
  const tween = gsap.fromTo(
    el,
    { [axis === 'y' ? 'yPercent' : 'xPercent']: -distance / 2 },
    {
      [axis === 'y' ? 'yPercent' : 'xPercent']: distance / 2,
      ease: 'none',
    },
  );

  return ScrollTrigger.create({
    trigger: el.parentElement ?? el,
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
    animation: tween,
  });
}
