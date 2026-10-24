# Site SANSO Concept

Site vitrine de SANSO Concept — www.sanso-concept.ch

## Modifier le site (pour Nicolas)

Tu n'as rien à installer. Tout se fait dans le navigateur avec ChatGPT (Codex).

1. Va sur **chatgpt.com/codex** et connecte-toi avec ton compte ChatGPT.
2. Choisis le dépôt **sanso-site**.
3. Écris ta demande en français, comme à une personne. Exemples :
   - « Ajoute un projet : chalet à Chexbres, construction bois, voici la photo et le texte… »
   - « Change le numéro de téléphone en +41 … »
   - « Sur la page Étude bois, remplace la phrase d'introduction par : … »
   - « Agrandis un peu les titres des projets sur mobile. »
   - « Supprime les projets d'exemple. »
4. Codex prépare la modification. Relis-la, puis clique sur **Créer une pull request** (« Create PR »).
5. Sur GitHub, ouvre la pull request :
   - attends la coche verte ✔ (le site se construit sans erreur) ;
   - si l'aperçu est activé, regarde le résultat sur le site de test ;
   - clique sur **Merge** (Fusionner). Le site est en ligne 1 à 2 minutes plus tard.
6. Un problème ? Dans la pull request fusionnée, clique sur **Revert** : tout revient comme avant.

Règle d'or : une demande = une pull request. Pas de grosse refonte en une fois.

## Pour le développeur

- Instructions pour les agents IA : `AGENTS.md` (Codex) et `CLAUDE.md` (Claude Code).
- `npm install` puis `npm run dev` (Node 24 recommandé, 22.23+ minimum).

### Secrets GitHub à créer (Settings → Secrets and variables → Actions)

| Nom | Type | Valeur |
|---|---|---|
| `FTP_SERVER` | Secret | serveur FTP Infomaniak (Manager → Hébergement → FTP/SSH) |
| `FTP_USERNAME` | Secret | utilisateur FTP |
| `FTP_PASSWORD` | Secret | mot de passe FTP |
| `SMTP_USER` | Secret | adresse kSuite qui envoie les demandes (ex. `site@sanso-concept.ch` ou `info@…`) |
| `SMTP_PASSWORD` | Secret | mot de passe de cette adresse (ou mot de passe d'application) |
| `CONTACT_TO` | Secret | adresse qui reçoit les demandes (ex. `info@sanso-concept.ch`) |
| `FTP_SERVER_DIR` | Variable | dossier du site sur le serveur, avec `/` final (ex. `/sites/sanso-concept.ch/`) |
| `FTP_PREVIEW_DIR` | Variable (optionnel) | dossier du sous-domaine de test (ex. `/sites/test.sanso-concept.ch/`) — active l'aperçu des pull requests |

### Avant mise en ligne publique
- [ ] Renseigner le numéro IDE dans `src/data/entreprise.json`
- [ ] Faire valider `confidentialite.astro` par SANSO Concept
- [ ] Vérifier la licence d'utilisation web des polices Aptos / Cascadia (sinon remplacer par une police libre)
- [ ] Remplacer les projets d'exemple
- [ ] Protéger la branche `main` (Settings → Branches : pull request obligatoire + vérification « build » requise)
