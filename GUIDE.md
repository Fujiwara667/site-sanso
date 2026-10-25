# Guide : modifier le site SANSO Concept

Rien à installer. Le circuit est toujours le même, quel que soit l'assistant utilisé :

**Demander → regarder l'aperçu → corriger si besoin → publier**

## 1. Demander la modification

Choisissez l'assistant que vous préférez. Tous lisent les mêmes règles du site (fichier `AGENTS.md`).

| Assistant            | Où                | Comment                                                                           |
| -------------------- | ----------------- | --------------------------------------------------------------------------------- |
| ChatGPT (Codex)      | chatgpt.com/codex | Choisir le dépôt `site-sanso`, écrire la demande, puis « Créer une pull request » |
| Claude (Claude Code) | claude.ai/code    | Choisir le dépôt `site-sanso`, écrire la demande ; Claude ouvre la pull request   |
| Autre agent          | —                 | Lui donner le dépôt GitHub `Fujiwara667/site-sanso` et la demande                 |

Exemples de demandes :

- « Ajoute un projet : chalet à Chexbres, construction bois. Photos dans a-integrer. Texte : … »
- « Sur la page Étude bois, remplace la phrase d'introduction par : … »
- « Change le numéro de téléphone en +41 … »
- « Les titres des projets sont trop gros sur téléphone, réduis-les un peu. »

**Photos** : déposez-les d'abord dans le dossier `a-integrer` sur GitHub
(Add file → Upload files → Propose changes), puis dites à l'assistant de les intégrer.
iPhone : utilisez le format « Le plus compatible » (JPG), pas HEIC.

## 2. Regarder l'aperçu

Dans la pull request sur GitHub :

- attendre les coches vertes ✔ (contrôles automatiques) ;
- cliquer sur le lien **Deploy Preview** (Netlify) : c'est le site avec vos modifications, pas encore publié.

Une croix rouge ✗ ? Le message explique le problème : demandez à l'assistant de le corriger.

## 3. Corriger si besoin

Retournez dans la même conversation avec l'assistant : « Le titre est trop long, raccourcis-le ».
Il met à jour **la même** pull request et l'aperçu se met à jour tout seul.

## 4. Publier

Dans la pull request : **Merge pull request** → **Confirm merge**. Le site est en ligne 1 à 2 minutes plus tard.

## En cas de problème après publication

Dans la pull request fusionnée : bouton **Revert** → tout revient comme avant.

Règle d'or : **une demande = une pull request**. Pas de grosse refonte d'un coup.
Les modifications techniques (formulaire, hébergement, structure) : demander à Hugo.
