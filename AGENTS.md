# Instructions pour l'agent IA (Codex, Claude, ou tout autre agent)

Site vitrine de **SANSO Concept** (construction bois, étude bois, protection incendie, Puidoux VD).
La personne qui te parle n'est pas informaticienne : elle s'exprime en français, simplement.
Réponds en français, sans jargon technique.

## Déroulement d'une demande (à suivre à chaque fois)

1. **Comprendre** la demande. Si elle est ambiguë (quelle page ? quel texte exact ?), pose UNE question courte avant de modifier.
2. **Travailler sur une branche dédiée**, jamais directement sur `main` (elle est protégée). Une demande = une branche = une pull request.
3. **Photos** : si des photos sont dans `a-integrer/`, lancer `npm run photos` (projets) ou `npm run photos -- photos` (photos de pages). Utiliser les chemins affichés par le script.
4. **Modifier** uniquement ce qui est demandé (modifications ciblées, pas de reformatage de fichiers entiers).
5. **Contrôler** : `npm run build` puis `npm run verifier`. Les deux doivent réussir. Corriger sinon.
6. **Ouvrir / mettre à jour la pull request** avec une description en français simple (modèle `.github/pull_request_template.md`) : ce qui a changé, et **quelles pages regarder dans l'aperçu**.
7. **Retouches** : si la personne demande un ajustement, modifier la **même branche / même pull request** (ne pas en créer une nouvelle).
8. Rappeler en fin de réponse : « Vérifiez le lien d'aperçu Netlify dans la pull request, puis cliquez sur Merge pour publier. »

## Règles à ne jamais enfreindre

1. **Fichiers techniques** — ne pas modifier sans demande explicite de l'administrateur (Hugo) : `.github/`, `scripts/`, `public/contact.php`, `public/.htaccess`, `astro.config.mjs`, `package.json`, `package-lock.json`, `netlify.toml`, `src/content.config.ts`. La vérification automatique bloque sinon.
2. **Aucun mot de passe, identifiant FTP/SMTP ou clé** dans un fichier. Ils sont uniquement dans les secrets GitHub.
3. **Ne jamais proposer de modifier les DNS / MX** du domaine : les e-mails kSuite en dépendent.
4. Site **en français uniquement** (fr-CH). Apostrophes typographiques ’, guillemets « », espace avant : ; ? !
5. **Aucun service externe** : pas de Google Fonts, statistiques, pixel, CDN, vidéo YouTube intégrée, reCAPTCHA (nLPD). La vérification automatique bloque sinon.
6. **Pas d'envoi de fichiers** dans le formulaire de contact.
7. **Ne pas inventer** d'informations sur l'entreprise (références, chiffres, certifications, clients). Si un texte manque, laisser un texte provisoire clairement marqué « À COMPLÉTER » et le signaler.
8. Ne jamais supprimer de page ni changer d'adresse de page (URL) sans demande explicite.

## Charte graphique

- Couleurs (variables CSS dans `src/styles/global.css`, bloc `:root`) :
  `--peach: #e79772` (accent), `--coal: #1e1e1e` (texte, fond foncé), `--cream: #f6f1e9` (fond), `--line` (filets).
- Polices locales (`public/fonts/`) : Aptos (texte), AptosDisplay (titres), Cascadia (petits libellés en capitales).
- Style : grands titres serrés finissant par un point (« Construire. »), surtitres en capitales (`class="eyebrow"`), liens soulignés avec flèche ↗ (`class="text-link"`), sections pêche `class="peach"`.
- Réutiliser les classes CSS et composants existants avant d'en créer.
- Tester le rendu mobile (≤ 600 px) pour toute modification de mise en page.

## Où se trouve quoi

| Je veux modifier…                                       | Fichier                                                                                        |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Adresse, téléphone, e-mail, IDE, nom du responsable     | `src/data/entreprise.json`                                                                     |
| Textes de l'accueil                                     | `src/pages/index.astro`                                                                        |
| Textes d'une page métier                                | `src/pages/construction-bois.astro`, `etude-bois.astro`, `protection-incendie.astro`           |
| Mise en page commune des pages métier                   | `src/components/PageMetier.astro`                                                              |
| À propos / Contact / Mentions légales / Confidentialité | `src/pages/a-propos.astro`, `contact.astro`, `mentions-legales.astro`, `confidentialite.astro` |
| Menu                                                    | `src/components/Header.astro`                                                                  |
| Pied de page                                            | `src/components/Footer.astro`                                                                  |
| Bloc « Parlons-en »                                     | `src/components/Cta.astro`                                                                     |
| Fiche projet (affichage)                                | `src/components/ProjetCarte.astro`                                                             |
| Couleurs, tailles, espacements                          | `src/styles/global.css`                                                                        |
| Photos des pages                                        | `src/assets/photos/`                                                                           |
| Projets                                                 | `src/content/projets/*.md` + photos dans `src/assets/projets/`                                 |
| Photos à intégrer (boîte de dépôt)                      | `a-integrer/`                                                                                  |

## Ajouter un projet

1. Photos : déposées dans `a-integrer/` → `npm run photos` → elles arrivent dans `src/assets/projets/` (JPG redressé, max 2400 px).
2. Créer `src/content/projets/<nom-court>.md` :
   ```md
   ---
   titre: 'Chalet à Chexbres'
   categorie: 'Construction bois' # exactement : Construction bois | Étude bois | Protection incendie
   resume: 'Une à trois phrases sur le projet.'
   image: '../../assets/projets/chalet-chexbres.jpg'
   alt: 'Description de la photo pour les malvoyants'
   ordre: 1 # 1 = affiché en premier
   accueil: true # true = aussi sur la page d'accueil (2 conseillés)
   meta: 'Chexbres / 2026 / Charpente' # petite ligne en bas (facultatif)
   exemple: false
   ---
   ```
3. Les projets d'exemple (`exemple-0X.md`, `exemple: true`) sont à supprimer, avec leurs photos, quand de vrais projets les remplacent.
4. Renuméroter `ordre` si besoin. Un champ manquant ou une catégorie mal écrite fait échouer `npm run build` (c'est voulu).

## Commandes

- `npm install` — installer (une fois)
- `npm run dev` — aperçu local sur http://localhost:4321
- `npm run photos` — intégrer les photos de `a-integrer/`
- `npm run build` — construire le site dans `dist/`
- `npm run verifier` — garde-fous (après `build`)
- `npm run check` — contrôle du code Astro/TypeScript (doit afficher 0 erreur)
- `npm run format` — mise en forme automatique du code (Prettier) ; à lancer avant de proposer une modification

## Animations au défilement

Déjà en place, sans bibliothèque : ajouter un attribut à l'élément voulu.

| Attribut                            | Effet                                       |
| ----------------------------------- | ------------------------------------------- |
| `data-anim`                         | monte légèrement en apparaissant            |
| `data-anim="fondu"`                 | fondu simple                                |
| `data-anim="gauche"` / `"droite"`   | glisse depuis le côté                       |
| `data-anim-cascade` (sur un parent) | les enfants apparaissent l'un après l'autre |

Code : `src/scripts/animations.ts` + section « Animations » de `src/styles/global.css`.
Rester sobre (1 à 3 éléments animés par page). Le réglage « réduire les animations » du visiteur est respecté.

Pour des effets avancés (parallaxe, éléments épinglés, animation liée à la position de défilement) :
installer **GSAP** (`npm install gsap`, plugin ScrollTrigger inclus) et l'importer dans un `<script>` du composant.
Jamais de bibliothèque chargée depuis un lien externe (CDN). Ajouter une dépendance = modification technique (étiquette `technique`).

## Travailler en local (éditeur de code)

1. Installer Node.js 24 (LTS) et Git.
2. `git clone https://github.com/Fujiwara667/site-sanso.git` puis `npm install`.
3. Ouvrir le dossier dans VS Code / Cursor : accepter les extensions recommandées (Astro, Prettier, EditorConfig).
4. `npm run dev` → http://localhost:4321 (rechargement automatique à chaque enregistrement).
5. Créer une branche, modifier, `npm run check && npm run build && npm run verifier`, pousser, ouvrir une pull request.

## Publication (automatique)

- Pull request → GitHub vérifie (`build` + `verifier`) et Netlify publie un **aperçu** (lien dans la pull request).
- Fusion (Merge) dans `main` → publication automatique du site.
- Erreur après publication → bouton **Revert** sur la pull request fusionnée.

## Stack (pour info)

Astro 7 (site statique, fichiers `.astro` = HTML + CSS + JavaScript standard ; JavaScript limité au menu mobile, aux filtres projets, aux animations et à l'envoi du formulaire ; composants React/Vue/Svelte possibles si besoin futur via `npx astro add`), formulaire PHP (`public/contact.php`, SMTP Infomaniak). Hébergement de test : Netlify ; hébergement final : Infomaniak (FTP via GitHub Actions, activé par la variable `FTP_SERVER_DIR`).
