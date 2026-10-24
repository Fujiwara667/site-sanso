# Instructions pour l'agent IA (Codex, Claude Code…)

Site vitrine de **SANSO Concept** (construction bois, étude bois, protection incendie, Puidoux VD).
Le propriétaire n'est pas informaticien : il te parle en français, simplement. Réponds en français, sans jargon.

## Règles à ne jamais enfreindre
1. **Ne jamais toucher** aux fichiers `.github/workflows/*`, `public/contact.php`, `public/.htaccess`, `astro.config.mjs`, `package.json`, sauf demande explicite et précise.
2. **Ne jamais écrire de mot de passe, identifiant FTP/SMTP ou clé** dans un fichier. Ils sont uniquement dans les secrets GitHub.
3. **Ne jamais parler de DNS / MX / e-mails du domaine** comme d'une chose à modifier : les e-mails kSuite en dépendent.
4. Site **en français uniquement** (fr-CH). Apostrophes typographiques ’ et espaces correctes.
5. **Aucun service externe** : pas de Google Fonts, pas d'outil de statistiques, pas de pixel publicitaire, pas de CDN, pas de reCAPTCHA (nLPD).
6. **Pas d'envoi de fichiers** dans le formulaire de contact.
7. Toujours vérifier que `npm run build` passe sans erreur avant de proposer la modification.
8. Faire **des modifications ciblées** : ne pas réécrire ou reformater des fichiers entiers pour un petit changement.

## Charte graphique
- Couleurs (variables CSS dans `src/styles/global.css`, bloc `:root`) :
  - `--peach: #e79772` (accent), `--coal: #1e1e1e` (texte, fond foncé), `--cream: #f6f1e9` (fond), `--line` (filets).
- Polices locales dans `public/fonts/` : Aptos (texte), AptosDisplay (titres), Cascadia (petits libellés en capitales).
- Style : grands titres serrés finissant par un point (« Construire. »), petits surtitres en capitales (`class="eyebrow"`), liens soulignés avec flèche ↗ (`class="text-link"`).
- Réutiliser les classes CSS existantes avant d'en créer de nouvelles.

## Où se trouve quoi
| Je veux modifier… | Fichier |
|---|---|
| Adresse, téléphone, e-mail, IDE, nom du responsable | `src/data/entreprise.json` |
| Textes de l'accueil | `src/pages/index.astro` |
| Textes d'une page métier | `src/pages/construction-bois.astro`, `etude-bois.astro`, `protection-incendie.astro` |
| Mise en page commune des pages métier | `src/components/PageMetier.astro` |
| À propos / Contact / Mentions légales / Confidentialité | `src/pages/a-propos.astro`, `contact.astro`, `mentions-legales.astro`, `confidentialite.astro` |
| Menu | `src/components/Header.astro` |
| Pied de page | `src/components/Footer.astro` |
| Couleurs, tailles, espacements | `src/styles/global.css` |
| Photos des pages | `src/assets/photos/` |
| Projets | `src/content/projets/` + photos dans `src/assets/projets/` |

## Ajouter un projet
1. Mettre la photo dans `src/assets/projets/` (nom en minuscules, sans espace ni accent, ex. `chalet-chexbres.jpg`). JPG/PNG/WebP acceptés : Astro les convertit en WebP automatiquement.
2. Créer `src/content/projets/chalet-chexbres.md` :
   ```md
   ---
   titre: "Chalet à Chexbres"
   categorie: "Construction bois"        # Construction bois | Étude bois | Protection incendie (exactement)
   resume: "Une à trois phrases sur le projet."
   image: "../../assets/projets/chalet-chexbres.jpg"
   alt: "Description de la photo pour les malvoyants"
   ordre: 1                              # 1 = affiché en premier
   accueil: true                         # true = affiché aussi sur la page d'accueil (2 max conseillé)
   meta: "Chexbres / 2026 / Charpente"   # petite ligne en bas (facultatif)
   exemple: false
   ---
   ```
3. Quand les vrais projets sont en ligne, supprimer `exemple-01.md`, `exemple-02.md`, `exemple-03.md` et leurs photos.
4. Renuméroter `ordre` si besoin.

## Commandes
- `npm install` — installer (une fois)
- `npm run dev` — aperçu local sur http://localhost:4321
- `npm run build` — construire le site dans `dist/` (doit réussir)

## Publication
- Chaque modification passe par une **pull request** vers `main` (Netlify publie un aperçu de chaque pull request).
- La fusion dans `main` publie automatiquement le site sur Infomaniak (GitHub Actions, `.github/workflows/deploy.yml`).
- En cas d'erreur : annuler la pull request avec le bouton « Revert » de GitHub.

## Stack (pour info)
Astro 7 (site statique, aucun JavaScript sauf menu mobile, filtres projets et envoi du formulaire), formulaire en PHP (`public/contact.php`, SMTP Infomaniak), hébergement web Infomaniak.
