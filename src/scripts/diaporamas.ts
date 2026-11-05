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
    const compteur = galerie.querySelector<HTMLElement>('[data-counter]')!;
    const statut = galerie.querySelector<HTMLElement>('[data-gallery-status]')!;
    const cadre = galerie.querySelector<HTMLElement>('[data-gallery-frame]')!;
    const mouvementReduit = window.matchMedia('(prefers-reduced-motion: reduce)');
    let index = 0;
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
    function programmer() {
      clearTimeout(minuterie);
      if (!peutDefiler()) return;
      minuterie = setTimeout(() => {
        if (peutDefiler()) afficher(index + 1, false);
      }, 4500);
    }
    function afficher(prochain: number, manuel: boolean) {
      index = (prochain + slides.length) % slides.length;
      slides.forEach((slide, numero) => (slide.hidden = numero !== index));
      compteur.textContent = `${String(index + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
      if (manuel) statut.textContent = `Photo ${index + 1} sur ${slides.length}`;
      programmer();
    }
    precedent.addEventListener('click', () => afficher(index - 1, true));
    suivant.addEventListener('click', () => afficher(index + 1, true));
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
    mouvementReduit.addEventListener('change', programmer);
    cadre.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'touch') depart = { x: event.clientX, y: event.clientY };
    });
    cadre.addEventListener('pointerup', (event) => {
      if (!depart) return;
      const dx = event.clientX - depart.x;
      const dy = event.clientY - depart.y;
      depart = undefined;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) afficher(index + (dx < 0 ? 1 : -1), true);
    });
    cadre.addEventListener('pointercancel', () => {
      depart = undefined;
    });
    new IntersectionObserver(
      ([entree]) => {
        visible = entree.isIntersecting;
        programmer();
      },
      { threshold: 0.1 },
    ).observe(galerie);
  });
}
