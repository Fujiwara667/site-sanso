/** Diaporamas indépendants : un seul délai, relancé après chaque action. */
export function initialiserDiaporamas() {
  document.querySelectorAll<HTMLElement>('[data-gallery]').forEach((galerie) => {
    if (galerie.dataset.initialise) return;
    galerie.dataset.initialise = 'true';
    const slides = Array.from(galerie.querySelectorAll<HTMLElement>('[data-slide]'));
    if (slides.length < 2) return;
    const precedent = galerie.querySelector<HTMLButtonElement>('[data-prev]')!;
    const suivant = galerie.querySelector<HTMLButtonElement>('[data-next]')!;
    const pause = galerie.querySelector<HTMLButtonElement>('[data-pause]')!;
    const statut = galerie.querySelector<HTMLElement>('[data-gallery-status]')!;
    const cadre = galerie.querySelector<HTMLElement>('[data-gallery-frame]')!;
    let ignorerClicAvant = 0;
    const mouvementReduit = window.matchMedia('(prefers-reduced-motion: reduce)');
    let index = 0;
    let enTransition = false;
    let enAttente: { prochain: number; manuel: boolean; direction: number } | undefined;
    let animations: Animation[] = [];
    let pauseUtilisateur = false;
    let survole = false;
    let visible = false;
    let minuterie: ReturnType<typeof setTimeout> | undefined;
    let depart: { x: number; y: number } | undefined;
    const titre = galerie.getAttribute('aria-label')?.replace('Photographies du projet ', '') || '';

    function peutDefiler() {
      const cadreVisible = galerie.getBoundingClientRect();
      return (
        cadreVisible.bottom > 0 &&
        cadreVisible.top < window.innerHeight &&
        !pauseUtilisateur &&
        !survole &&
        visible &&
        !document.hidden &&
        !mouvementReduit.matches &&
        !galerie.contains(document.activeElement)
      );
    }
    function programmerDans(delai: number) {
      clearTimeout(minuterie);
      if (!peutDefiler()) return;
      minuterie = setTimeout(() => {
        if (peutDefiler()) void afficher(index + 1, false);
      }, delai);
    }
    function programmer() {
      programmerDans(3500);
    }
    async function preparerImage(numero: number) {
      const image = slides[(numero + slides.length) % slides.length].querySelector<HTMLImageElement>('img');
      if (!image) throw new Error('Photographie absente');
      image.loading = 'eager';
      await image.decode();
    }
    function prechargerVoisines() {
      void preparerImage(index + 1).catch(() => {});
      void preparerImage(index - 1).catch(() => {});
    }
    async function afficher(prochain: number, manuel: boolean, direction = 1) {
      clearTimeout(minuterie);
      if (enTransition) {
        enAttente = { prochain, manuel, direction };
        return;
      }
      const cible = (prochain + slides.length) % slides.length;
      if (cible === index) {
        programmer();
        return;
      }
      enTransition = true;
      let debutTransition: number | undefined;
      try {
        // Garder la photo actuelle affichée jusqu’au décodage complet de la suivante.
        await preparerImage(cible);
        if (!manuel && !peutDefiler()) return;
        debutTransition = performance.now();
        const sortante = slides[index];
        const entrante = slides[cible];
        entrante.hidden = false;
        entrante.setAttribute('aria-hidden', 'false');
        sortante.setAttribute('aria-hidden', 'true');
        sortante.style.zIndex = '1';
        entrante.style.zIndex = '2';
        index = cible;
        if (manuel) statut.textContent = `Photo ${index + 1} sur ${slides.length}`;
        if (!mouvementReduit.matches) {
          const options: KeyframeAnimationOptions = {
            duration: 400,
            easing: 'cubic-bezier(.25,.1,.25,1)',
            fill: 'both',
          };
          animations = [
            sortante.animate(
              [{ transform: 'translateX(0)' }, { transform: `translateX(${-direction * 100}%)` }],
              options,
            ),
            entrante.animate(
              [{ transform: `translateX(${direction * 100}%)` }, { transform: 'translateX(0)' }],
              options,
            ),
          ];
          await Promise.all(animations.map((animation) => animation.finished));
        }
      } catch {
        if (manuel) statut.textContent = 'Cette photographie ne peut pas être chargée pour le moment.';
      } finally {
        slides.forEach((slide, numero) => {
          slide.hidden = numero !== index;
          slide.setAttribute('aria-hidden', String(numero !== index));
          slide.style.removeProperty('z-index');
        });
        animations.forEach((animation) => animation.cancel());
        animations = [];
        enTransition = false;
        prechargerVoisines();
        const suivante = enAttente;
        enAttente = undefined;
        if (suivante) void afficher(suivante.prochain, suivante.manuel, suivante.direction);
        else if (!manuel && debutTransition !== undefined)
          programmerDans(Math.max(0, 3500 - (performance.now() - debutTransition)));
        else programmer();
      }
    }
    precedent.addEventListener('click', () => {
      if (performance.now() < ignorerClicAvant) return;
      void afficher(index - 1, true, -1);
    });
    suivant.addEventListener('click', () => {
      if (performance.now() < ignorerClicAvant) return;
      void afficher(index + 1, true, 1);
    });
    pause.addEventListener('click', () => {
      pauseUtilisateur = !pauseUtilisateur;
      pause.setAttribute('aria-pressed', String(pauseUtilisateur));
      pause.textContent = pauseUtilisateur ? 'Lecture' : 'Pause';
      pause.setAttribute('aria-label', `${pauseUtilisateur ? 'Reprendre' : 'Mettre en pause'} le diaporama — ${titre}`);
      programmer();
    });
    galerie.addEventListener('pointerenter', (event) => {
      if (event.pointerType === 'mouse') {
        survole = true;
        programmer();
      }
    });
    galerie.addEventListener('pointerleave', (event) => {
      if (event.pointerType === 'mouse') {
        survole = false;
        programmer();
      }
    });
    galerie.addEventListener('focusin', programmer);
    galerie.addEventListener('focusout', () => queueMicrotask(programmer));
    document.addEventListener('visibilitychange', programmer);
    mouvementReduit.addEventListener('change', () => {
      if (mouvementReduit.matches) animations.forEach((animation) => animation.finish());
      programmer();
    });
    cadre.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'touch') depart = { x: event.clientX, y: event.clientY };
    });
    cadre.addEventListener('pointerup', (event) => {
      if (!depart) return;
      const dx = event.clientX - depart.x;
      const dy = event.clientY - depart.y;
      depart = undefined;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) {
        ignorerClicAvant = performance.now() + 500;
        const direction = dx < 0 ? 1 : -1;
        void afficher(index + direction, true, direction);
      }
    });
    cadre.addEventListener('pointercancel', () => {
      depart = undefined;
    });
    new IntersectionObserver(
      ([entree]) => {
        visible = entree.isIntersecting;
        if (visible) prechargerVoisines();
        programmer();
      },
      { threshold: 0.1 },
    ).observe(galerie);
  });
}
