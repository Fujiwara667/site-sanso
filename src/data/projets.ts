import type { ImageMetadata } from 'astro';
import mmap01 from '../assets/projets/mmap-01.jpg';
import mmap02 from '../assets/projets/mmap-02.jpg';
import mmap03 from '../assets/projets/mmap-03.jpg';
import mmap04 from '../assets/projets/mmap-04.jpg';
import mmap05 from '../assets/projets/mmap-05.jpg';
import bellevue01 from '../assets/projets/villa-bellevue-01.jpg';
import bellevue02 from '../assets/projets/villa-bellevue-02.jpg';
import bellevue03 from '../assets/projets/villa-bellevue-03.jpg';
import bellevue04 from '../assets/projets/villa-bellevue-04.jpg';
import champPaquis01 from '../assets/projets/champ-paquis-01.jpg';
import champPaquis02 from '../assets/projets/champ-paquis-02.jpg';
import champPaquis03 from '../assets/projets/champ-paquis-03.jpg';
import champPaquis04 from '../assets/projets/champ-paquis-04.jpg';
import champPaquis05 from '../assets/projets/champ-paquis-05.jpg';

export interface PhotoProjet {
  src: ImageMetadata;
  alt: string;
  /** Position du sujet, par exemple « 50% 35% ». */
  cadrage?: string;
  /** Affiche le document entier, sans recadrage. */
  document?: boolean;
  /** Préserve une photographie entière, notamment lorsqu’elle est verticale. */
  ajustement?: 'cover' | 'contain';
}

export interface Projet {
  numero: string;
  lieu: string;
  domaines: ('CB' | 'EB' | 'PI')[];
  travaux: string;
  images: PhotoProjet[];
}

/** Références confirmées uniquement. Voir PROJETS.md pour l’ajout de données. */
export const projets: Projet[] = [
  {
    numero: '26-28',
    lieu: 'Epesses',
    domaines: ['CB'],
    travaux: 'Rénovation énergétique et réfection de la toiture.',
    images: [
      { src: bellevue01, alt: 'Toiture en cours de rénovation avec membrane et échafaudage.' },
      { src: bellevue02, alt: 'Vue des pièces de bois et de la membrane sur le versant de toiture en chantier.' },
      {
        src: bellevue03,
        alt: 'Mise en place de l’isolation sur la toiture en cours de rénovation.',
        ajustement: 'contain',
      },
      { src: bellevue04, alt: 'Vue du chantier de toiture et du paysage au-dessus du Léman.', ajustement: 'contain' },
    ],
  },
  {
    numero: '26-18',
    lieu: 'Brent',
    domaines: ['CB'],
    travaux: 'Construction d’une pergola.',
    images: [
      { src: mmap01, alt: 'Vue de la pergola en bois adossée à la maison et de la terrasse.', ajustement: 'contain' },
      { src: mmap02, alt: 'Détail des poutres et des chevrons en bois de la pergola.', ajustement: 'contain' },
      {
        src: mmap03,
        alt: 'Vue latérale de la structure en bois de la pergola et de son raccord avec la maison.',
        ajustement: 'contain',
      },
      {
        src: mmap04,
        alt: 'Vue de la terrasse et des éléments de la pergola, avec le paysage en arrière-plan.',
        ajustement: 'contain',
      },
      {
        src: mmap05,
        alt: 'Vue de la structure supérieure de la pergola en bois depuis la terrasse.',
        ajustement: 'contain',
      },
    ],
  },
  {
    numero: '26-03',
    lieu: 'Chexbres',
    domaines: ['CB'],
    travaux: 'Agrandissement d’un garage en ossature bois.',
    images: [
      {
        src: champPaquis01,
        alt: 'Vue extérieure de l’agrandissement du garage attenant à une maison à façade rouge.',
        ajustement: 'contain',
      },
      {
        src: champPaquis02,
        alt: 'Montage des parois en ossature bois de l’agrandissement, avec une ouverture de fenêtre.',
        ajustement: 'contain',
      },
      {
        src: champPaquis03,
        alt: 'Vue de la paroi extérieure en chantier, autour de l’ouverture de fenêtre.',
        ajustement: 'contain',
      },
      {
        src: champPaquis04,
        alt: 'Vue intérieure des panneaux de l’agrandissement et de sa fenêtre.',
        ajustement: 'contain',
      },
      {
        src: champPaquis05,
        alt: 'Vue de la surface en panneaux de bois durant le chantier d’agrandissement.',
        ajustement: 'contain',
      },
    ],
  },
];

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
