// Animations au défilement (sans bibliothèque externe).
// 1. Apparition : ajouter l'attribut data-anim à un élément.
//   <section data-anim>…</section>                → monte légèrement en apparaissant (défaut)
//   <div data-anim="fondu">…</div>                → simple fondu
//   <div data-anim="gauche"> / data-anim="droite" → glisse depuis le côté
//   <ul data-anim-cascade>…</ul>                  → les enfants apparaissent l'un après l'autre
// 2. Parallaxe : <img data-parallax="0.12"> dans un cadre qui coupe ce qui dépasse
//    (la photo se déplace plus lentement que la page ; 0.1 à 0.2 = discret).
// 3. Défilement horizontal : <div data-defile="0.3"> glisse latéralement au rythme du défilement.
// 4. En-tête : se masque quand on descend, réapparaît quand on remonte (.header).
// Les styles sont dans src/styles/global.css (section « Animations »).
// Respecte le réglage « réduire les animations » du visiteur.

const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let enAttente: HTMLElement[] = [];
const parallaxes = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
const defiles = Array.from(document.querySelectorAll<HTMLElement>('[data-defile]'));
const entete = document.querySelector<HTMLElement>('.header');
let dernierY = window.scrollY;

// Affiche les éléments arrivés dans l'écran ou déjà dépassés (défilement rapide, lien d'ancre, rechargement)
function apparitions() {
  const limite = window.innerHeight * 0.9;
  enAttente = enAttente.filter((el) => {
    if (el.getBoundingClientRect().top < limite) {
      el.classList.add('anim-visible');
      return false;
    }
    return true;
  });
}

// Déplacements liés à la position de défilement
function mouvements() {
  const h = window.innerHeight;
  for (const el of parallaxes) {
    const cadre = el.parentElement?.getBoundingClientRect();
    if (!cadre || cadre.bottom < 0 || cadre.top > h) continue;
    const decalage = (cadre.top + cadre.height / 2 - h / 2) * Number(el.dataset.parallax || 0.12);
    el.style.transform = `translate3d(0, ${decalage.toFixed(1)}px, 0) scale(1.18)`;
  }
  for (const el of defiles) {
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > h) continue;
    const decalage = (r.top - h) * Number(el.dataset.defile || 0.3);
    el.style.transform = `translate3d(${decalage.toFixed(1)}px, 0, 0)`;
  }
  // En-tête masqué en descendant (après 200 px), visible en remontant
  if (entete) {
    const y = window.scrollY;
    entete.classList.toggle('header-masque', y > 200 && y > dernierY);
    entete.classList.toggle('header-defile', y > 10);
    dernierY = y;
  }
}

// Une mise à jour par image affichée au maximum
let planifie = false;
function planifier() {
  if (planifie) return;
  planifie = true;
  requestAnimationFrame(() => {
    planifie = false;
    apparitions();
    if (!reduit) mouvements();
  });
}

function initialiser() {
  enAttente = Array.from(document.querySelectorAll<HTMLElement>('[data-anim], [data-anim-cascade] > *'));
  if (reduit) {
    enAttente.forEach((el) => el.classList.add('anim-visible'));
    enAttente = [];
  } else {
    // Décalage progressif pour les listes en cascade
    document.querySelectorAll<HTMLElement>('[data-anim-cascade]').forEach((liste) => {
      Array.from(liste.children).forEach((enfant, i) => {
        (enfant as HTMLElement).style.setProperty('--anim-delai', `${i * 110}ms`);
      });
    });
    document.documentElement.classList.add('anim-pret');
  }
  window.addEventListener('scroll', planifier, { passive: true });
  window.addEventListener('resize', planifier);
  planifier();
}

initialiser();
