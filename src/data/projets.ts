import type { ImageMetadata } from 'astro';

export interface PhotoProjet {
  src: ImageMetadata;
  alt: string;
  /** Position du sujet, par exemple « 50% 35% ». */
  cadrage?: string;
  /** Affiche le document entier, sans recadrage. */
  document?: boolean;
}

export interface Projet {
  numero: string;
  lieu: string;
  domaines: ('CB' | 'EB' | 'PI')[];
  travaux: string;
  images: PhotoProjet[];
}

/** Références confirmées uniquement. Voir PROJETS.md pour l’ajout de données. */
export const projets: Projet[] = [];

/** Une référence incomplète n’est jamais présentée comme un projet publié. */
export function projetComplet(projet: Projet): boolean {
  return Boolean(
    projet.numero.trim() &&
    projet.lieu.trim() &&
    projet.domaines.length &&
    projet.travaux.trim() &&
    projet.images.length &&
    projet.images.every((photo) => photo.src && photo.alt.trim()),
  );
}

/** Ordre éditorial : du plus récent au plus ancien, sans inventer de date. */
export const referencesPubliees = projets.filter(projetComplet);
