// Configuration Astro — site statique SANSO Concept
import { defineConfig } from 'astro/config';

export default defineConfig({
  // URL publique définitive du site (sert aux balises canoniques et au plan du site)
  site: 'https://www.sanso-concept.ch',
  // Génère /contact/index.html → compatible avec l'hébergement Apache d'Infomaniak
  build: { format: 'directory' },
});
