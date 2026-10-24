// Animations à l'apparition au défilement (sans bibliothèque externe).
// Utilisation dans une page : ajouter l'attribut data-anim à un élément.
//   <section data-anim>…</section>                → monte légèrement en apparaissant (défaut)
//   <div data-anim="fondu">…</div>                → simple fondu
//   <div data-anim="gauche"> / data-anim="droite" → glisse depuis le côté
//   <ul data-anim-cascade>…</ul>                  → les enfants apparaissent l'un après l'autre
// Les styles sont dans src/styles/global.css (section « Animations »).
// Respecte le réglage « réduire les animations » du visiteur.
// Pour des animations plus complexes (parallaxe, défilement synchronisé…), installer
// GSAP via npm (jamais par un lien externe) — voir AGENTS.md.

const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let enAttente: HTMLElement[] = [];

// Affiche les éléments arrivés dans l'écran ou déjà dépassés (défilement rapide, lien d'ancre, rechargement)
function verifier() {
  const limite = window.innerHeight * 0.9;
  enAttente = enAttente.filter((el) => {
    if (el.getBoundingClientRect().top < limite) {
      el.classList.add('anim-visible');
      return false;
    }
    return true;
  });
  if (enAttente.length === 0) {
    window.removeEventListener('scroll', planifier);
    window.removeEventListener('resize', planifier);
  }
}

// Une vérification par image affichée au maximum
let planifie = false;
function planifier() {
  if (planifie) return;
  planifie = true;
  requestAnimationFrame(() => {
    planifie = false;
    verifier();
  });
}

function initialiser() {
  enAttente = Array.from(document.querySelectorAll<HTMLElement>('[data-anim], [data-anim-cascade] > *'));
  if (reduit) {
    enAttente.forEach((el) => el.classList.add('anim-visible'));
    return;
  }
  // Décalage progressif pour les listes en cascade
  document.querySelectorAll<HTMLElement>('[data-anim-cascade]').forEach((liste) => {
    Array.from(liste.children).forEach((enfant, i) => {
      (enfant as HTMLElement).style.setProperty('--anim-delai', `${i * 90}ms`);
    });
  });
  document.documentElement.classList.add('anim-pret');
  window.addEventListener('scroll', planifier, { passive: true });
  window.addEventListener('resize', planifier);
  planifier();
}

initialiser();
