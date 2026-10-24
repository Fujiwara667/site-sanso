// Traite les photos déposées dans a-integrer/ :
// - corrige l'orientation (photos de téléphone), réduit à 2400 px max, enregistre en JPG qualité 85
// - renomme en minuscules sans accents ni espaces
// - range dans src/assets/projets/ (par défaut) ou src/assets/photos/
// - supprime l'original de a-integrer/
// Usage : npm run photos            → vers src/assets/projets/
//         npm run photos -- photos  → vers src/assets/photos/
import { readdir, mkdir, unlink, access } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const BOITE = 'a-integrer';
const destination = process.argv[2] === 'photos' ? 'src/assets/photos' : 'src/assets/projets';
const ACCEPTES = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tif', '.tiff'];

// « Photo Chalet Été 1.JPG » → « photo-chalet-ete-1 »
const nomPropre = (nom) =>
  nom
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'photo';

const existe = (f) => access(f).then(() => true, () => false);

const fichiers = (await readdir(BOITE)).filter((f) => !f.startsWith('.') && f !== 'LISEZ-MOI.md');
if (fichiers.length === 0) {
  console.log('Aucune photo dans a-integrer/.');
  process.exit(0);
}

await mkdir(destination, { recursive: true });
let erreurs = 0;
for (const f of fichiers) {
  const ext = path.extname(f).toLowerCase();
  const source = path.join(BOITE, f);
  if (ext === '.heic' || ext === '.heif') {
    console.error(`✗ ${f} : format HEIC (iPhone) non pris en charge. Le renvoyer en JPG.`);
    erreurs++;
    continue;
  }
  if (!ACCEPTES.includes(ext)) {
    console.error(`✗ ${f} : format non pris en charge (${ext}).`);
    erreurs++;
    continue;
  }
  // Nom unique dans le dossier de destination
  const base = nomPropre(path.basename(f, path.extname(f)));
  let cible = path.join(destination, `${base}.jpg`);
  for (let i = 2; await existe(cible); i++) cible = path.join(destination, `${base}-${i}.jpg`);

  const info = await sharp(source)
    .rotate() // applique l'orientation EXIF
    .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
    .flatten({ background: '#f6f1e9' }) // PNG transparent → fond crème
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(cible);
  await unlink(source);
  console.log(`✓ ${f} → ${cible} (${info.width}×${info.height}, ${Math.round(info.size / 1024)} ko)`);
}
process.exit(erreurs ? 1 : 0);
