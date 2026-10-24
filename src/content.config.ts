// Définition des collections de contenu.
// Chaque projet = un fichier Markdown dans src/content/projets/.
// Si un champ obligatoire manque ou est invalide, la construction du site échoue
// (protection contre les erreurs avant mise en ligne).
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projets = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projets' }),
  schema: ({ image }) =>
    z.object({
      titre: z.string(),
      // Doit correspondre exactement à l'un des trois métiers
      categorie: z.enum(['Construction bois', 'Étude bois', 'Protection incendie']),
      resume: z.string(),
      // Chemin relatif vers la photo principale, ex. ../../assets/projets/mon-projet.jpg
      image: image(),
      alt: z.string(),
      // Ordre d'affichage (1 = premier)
      ordre: z.number().int(),
      // true = affiché aussi sur la page d'accueil
      accueil: z.boolean().default(false),
      // Petite ligne en bas de la fiche (lieu, année, rôle…)
      meta: z.string().default(''),
      // true = projet fictif de démonstration (affiche « EXEMPLE »)
      exemple: z.boolean().default(false),
    }),
});

export const collections = { projets };
