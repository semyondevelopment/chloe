import { mountPath } from '../Path';

export function mountMapView(parent: HTMLElement): void {
  parent.innerHTML = `
    <div class="h-full relative">
      <div class="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
        <div class="font-heading text-[0.62rem] uppercase tracking-bubble text-bubblegum-deep">scroll to explore</div>
        <div class="font-script text-bubblegum-deep text-2xl">your career roadmap ♡</div>
      </div>
      <div id="path-mount" class="absolute inset-0"></div>
    </div>
  `;
  const mount = parent.querySelector<HTMLElement>('#path-mount');
  if (mount) mountPath(mount);
}

export function unmountMapView(): void {
  /* Path component is replaced when view-host innerHTML is cleared by main.ts */
}
