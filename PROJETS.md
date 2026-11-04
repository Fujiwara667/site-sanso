# Ajouter une référence confirmée

La page `/projets/` lit uniquement **`src/data/projets.ts`**. Les anciens fichiers `src/content/projets/exemple-*.md` ne sont plus utilisés par cette page et ne sont jamais publiés comme références.

1. Placer les photographies ou documents réels dans `src/assets/projets/` (images optimisées, moins de 3 Mo chacune). Respecter les droits de publication et retirer les données confidentielles des documents.
2. Importer chaque image en tête de `src/data/projets.ts`, puis ajouter une entrée à `projets`, en utilisant les données réelles ci-dessous. Aucun exemple de réalisation n’est prérempli.
3. L’ordre dans le tableau détermine l’ordre d’affichage. Les codes autorisés sont `CB`, `EB` et `PI`, dans cet ordre s’ils sont combinés.

| Champ               | Contenu                                                         |
| ------------------- | --------------------------------------------------------------- |
| `numero`            | Numéro réel de projet ; aucune numérotation automatique         |
| `lieu`              | Lieu confirmé                                                   |
| `domaines`          | Un ou plusieurs codes, par exemple `['CB', 'EB']`               |
| `travaux`           | Description factuelle des travaux confiés                       |
| `images`            | Tableau des photographies ou documents importés                 |
| `images[].src`      | Variable correspondant à l’import de l’image                    |
| `images[].alt`      | Description précise de l’image ; obligatoire                    |
| `images[].cadrage`  | Position facultative du sujet, par exemple `'50% 35%'`          |
| `images[].document` | `true` pour montrer un plan ou document entier sans le recadrer |

Une référence sans numéro, lieu, domaine, description ou image avec texte alternatif est masquée. Ne compléter ces champs qu’avec des données confirmées. Aucun cartouche incomplet n’est rendu public.

Le composant `src/components/ProjetReference.astro` organise les informations à gauche et les images à droite. `DiaporamaProjet.astro` et `src/scripts/diaporamas.ts` gèrent la galerie indépendante, la pause et les interactions. Avec une seule image, les commandes sont absentes.

Après modification : `npm run check`, `npm run build`, puis `npm run verifier`. Vérifier les cadrages et la lisibilité sur ordinateur et mobile dans l’aperçu de la pull request.
