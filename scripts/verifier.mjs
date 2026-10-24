// Garde-fous automatiques, lancés sur chaque pull request (et via « npm run verifier »).
// Un message en français explique chaque problème trouvé.
// À lancer APRÈS « npm run build » (contrôle aussi le site construit dans dist/).
import { readdir, readFile, stat } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import path from 'node:path';

const problemes = [];
const avertissements = [];

async function lister(dossier) {
  const out = [];
  for (const e of await readdir(dossier, { withFileTypes: true }).catch(() => [])) {
    const p = path.join(dossier, e.name);
    if (e.isDirectory()) out.push(...(await lister(p)));
    else out.push(p);
  }
  return out;
}

// 1. La boîte de dépôt doit être vide (photos pas encore intégrées)
const boite = (await readdir('a-integrer').catch(() => [])).filter((f) => !f.startsWith('.') && f !== 'LISEZ-MOI.md');
if (boite.length) problemes.push(`Photos pas encore intégrées dans a-integrer/ : ${boite.join(', ')}. Lancer « npm run photos ».`);

// 2. Poids des images sources (une photo brute de téléphone doit passer par « npm run photos »)
for (const f of await lister('src/assets')) {
  const ko = (await stat(f)).size / 1024;
  if (ko > 3000) problemes.push(`${f} pèse ${Math.round(ko)} ko (max 3000). La déposer dans a-integrer/ et lancer « npm run photos ».`);
}

// 3. Aucune ressource externe dans le site construit (nLPD : pas de Google Fonts, CDN, traceurs)
const html = (await lister('dist')).filter((f) => f.endsWith('.html') || f.endsWith('.css'));
if (html.length === 0) problemes.push('Dossier dist/ vide : lancer « npm run build » avant « npm run verifier ».');
const externe = /<(script|link|img|iframe|source|video|audio)\b[^>]*(src|href|srcset)="(https?:)?\/\/[^"]+"|@import\s+url\(["']?https?:|url\(["']?https?:\/\//gi;
for (const f of html) {
  const t = await readFile(f, 'utf8');
  for (const m of t.matchAll(externe)) {
    // Les liens <link rel="canonical"> vers le domaine du site sont autorisés
    if (/rel="canonical"/.test(m[0]) || /sanso-concept\.ch/.test(m[0])) continue;
    problemes.push(`${f} charge une ressource externe : ${m[0].slice(0, 120)}… (interdit : tout doit être hébergé sur le site).`);
  }
}

// 4. Liens internes cassés dans le site construit
const pages = new Set(
  (await lister('dist')).map((f) => '/' + path.relative('dist', f).replace(/\\/g, '/').replace(/index\.html$/, '')),
);
for (const f of html.filter((x) => x.endsWith('.html'))) {
  const t = await readFile(f, 'utf8');
  for (const [, href] of t.matchAll(/href="(\/[^"#?]*)"/g)) {
    const cible = href.endsWith('/') || path.extname(href) ? href : href + '/';
    if (!pages.has(cible) && !pages.has(href)) problemes.push(`${f} : lien interne cassé vers ${href}`);
  }
}

// 5. Fichiers techniques modifiés dans la pull request (à faire relire par Hugo)
const base = process.env.GITHUB_BASE_REF;
if (base) {
  try {
    const modifies = execSync(`git diff --name-only origin/${base}...HEAD`, { encoding: 'utf8' }).split('\n').filter(Boolean);
    const sensibles = modifies.filter((f) =>
      /^(\.github\/|public\/contact\.php|public\/\.htaccess|astro\.config\.mjs|package(-lock)?\.json|netlify\.toml|scripts\/|src\/content\.config\.ts)/.test(f),
    );
    if (sensibles.length && process.env.AUTORISER_TECHNIQUE !== 'true') {
      problemes.push(
        `Fichiers techniques modifiés : ${sensibles.join(', ')}. Ces fichiers sont réservés à l'administrateur. ` +
          `Si c'est voulu, ajouter l'étiquette « technique » à la pull request.`,
      );
    }
  } catch {
    avertissements.push('Impossible de comparer avec la branche principale (contrôle des fichiers techniques ignoré).');
  }
}

for (const a of avertissements) console.warn('⚠ ' + a);
if (problemes.length) {
  console.error(`\n✗ ${problemes.length} problème(s) à corriger :\n`);
  for (const p of problemes) console.error('  - ' + p);
  process.exit(1);
}
console.log('✓ Vérifications OK');
