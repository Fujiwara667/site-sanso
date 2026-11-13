import type { ImageMetadata } from 'astro';
import mmap01 from '../assets/projets/mmap-maj-01.jpg';
import mmap02 from '../assets/projets/mmap-maj-02.jpg';
import mmap03 from '../assets/projets/mmap-maj-03.jpg';
import bellevue01 from '../assets/projets/villa-bellevue-maj-01.jpg';
import bellevue02 from '../assets/projets/villa-bellevue-maj-02.jpg';
import bellevue03 from '../assets/projets/villa-bellevue-maj-03.jpg';
import bellevue04 from '../assets/projets/villa-bellevue-maj-04.jpg';
import champPaquis01 from '../assets/projets/champ-paquis-maj-01.jpg';
import champPaquis02 from '../assets/projets/champ-paquis-maj-02.jpg';
import champPaquis03 from '../assets/projets/champ-paquis-maj-03.jpg';
import champPaquis04 from '../assets/projets/champ-paquis-maj-04.jpg';

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
  nom: string;
  titreTravaux: string;
  lieu: string;
  domaines: ('CB' | 'EB' | 'PI')[];
  travaux: string;
  images: PhotoProjet[];
}

/** Références confirmées uniquement. Voir PROJETS.md pour l’ajout de données. */
export const projets: Projet[] = [
  {
    numero: '26-28',
    nom: 'Villa Bellevue',
    titreTravaux: 'Rénovation énergétique et réfection de la toiture',
    lieu: 'Epesses / VD',
    domaines: ['CB'],
    travaux:
      'Démontage de la couverture existante, isolation et étanchéité de la toiture. Mise en œuvre de la sous-couverture et du lattage.',
    images: [
      { src: bellevue01, alt: 'Vue d’ensemble de la toiture avec sous-couverture et lattage en cours de réalisation.' },
      { src: bellevue02, alt: 'Toiture en chantier avec membrane et échafaudage.' },
      { src: bellevue03, alt: 'Mise en place de l’isolation au raccord de la toiture et de la façade.' },
      { src: bellevue04, alt: 'Détail des éléments de bois en rive de toiture.' },
    ],
  },
  {
    numero: '26-18',
    nom: 'MMAP',
    titreTravaux: 'Pergola',
    lieu: 'Brent / VD',
    domaines: ['CB'],
    travaux: 'Construction d’une pergola en mélèze d’inspiration japonaise, avec traitement de surface.',
    images: [
      { src: mmap01, alt: 'Vue des poutres en mélèze de la pergola au-dessus de la terrasse.' },
      { src: mmap02, alt: 'Pergola en mélèze d’inspiration japonaise adossée à la maison.' },
      { src: mmap03, alt: 'Vue de la structure de la pergola depuis la terrasse, avec la végétation.' },
    ],
  },
  {
    numero: '26-03',
    nom: 'Champs-Pâquis',
    titreTravaux: 'Agrandissement',
    lieu: 'Chexbres / VD',
    domaines: ['CB'],
    travaux: 'Construction d’un agrandissement de garage en ossature bois, avec revêtement extérieur en zinc.',
    images: [
      { src: champPaquis01, alt: 'Pose des panneaux et de l’isolation sur l’ossature bois de l’agrandissement.' },
      { src: champPaquis02, alt: 'Montage des parois en panneaux de bois du garage.' },
      { src: champPaquis03, alt: 'Agrandissement du garage avec revêtement extérieur en zinc.' },
      { src: champPaquis04, alt: 'Vue intérieure des panneaux de bois et de la fenêtre de l’agrandissement.' },
    ],
  },
];

/** Une référence incomplète n’est jamais présentée comme un projet publié. */
export function projetComplet(projet: Projet): boolean {
  return Boolean(
    projet.numero.trim() &&
    projet.nom.trim() &&
    projet.titreTravaux.trim() &&
    projet.lieu.trim() &&
    projet.domaines.length &&
    projet.travaux.trim() &&
    projet.images.length &&
    projet.images.every((photo) => photo.src && photo.alt.trim()),
  );
}

/** Ordre éditorial : du plus récent au plus ancien, sans inventer de date. */
export const referencesPubliees = projets.filter(projetComplet);
