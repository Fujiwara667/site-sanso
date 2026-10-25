# Guide : modifier le site SANSO Concept avec ChatGPT

Tu modifies le site en écrivant tes demandes à ChatGPT (Codex) : il prépare la modification, tu vérifies l'aperçu,
puis tu publies en un clic. Rien à installer ; ça marche depuis l'ordinateur et en partie depuis le téléphone.

**Le circuit, toujours le même : demander → regarder l'aperçu → retoucher si besoin → publier.**
Rien n'est visible sur le vrai site avant la publication.

- Site de test : https://sanso-concept-test.netlify.app
- Dépôt GitHub (le dossier qui contient le site) : https://github.com/Fujiwara667/site-sanso

## Avant de commencer (fait par Hugo)

- [x] Application GitHub « ChatGPT Codex Connector » autorisée sur le dépôt `site-sanso`.
- [ ] Invitation de Nicolas comme collaborateur sur le dépôt.
- [x] Site de test et aperçus Netlify publics : aucun compte Netlify nécessaire pour les voir.

## Étape 1 – Compte GitHub et invitation (5 min)

GitHub garde toutes les versions du site : rien ne peut être perdu.

1. Crée un compte gratuit sur [github.com](https://github.com) (bouton **Sign up**). Envoie ton nom d'utilisateur à Hugo.
2. Tu reçois un e-mail « invited you to collaborate on Fujiwara667/site-sanso ». Clique sur **View invitation**,
   puis **Accept invitation**.
3. Optionnel : installe l'application **GitHub** sur ton téléphone pour publier depuis partout.

## Étape 2 – Relier ChatGPT au site (une seule fois, 10 min, sur ordinateur)

Codex est l'assistant de ChatGPT qui modifie du code. Il est inclus dans les offres ChatGPT, avec des limites
d'utilisation qui dépendent de l'offre. Cette étape se fait sur ordinateur (site web ou application ChatGPT) ;
ensuite, le téléphone suffit pour lancer des demandes.

1. Ouvre [chatgpt.com/codex](https://chatgpt.com/codex) et connecte-toi avec ton compte ChatGPT.
2. Choisis **Work in → Cloud**, puis **Select environment → Create environment**.
3. Quand il le demande, clique sur **Connect GitHub** et autorise l'accès avec ton compte GitHub.
4. Choisis le dépôt **Fujiwara667/site-sanso**, puis **Get started**. Codex analyse le site et installe ce qu'il faut
   (une à deux minutes).
5. Dans les réglages de l'environnement, accès internet : choisis **Package managers** (suffisant, et plus sûr que « All »).
6. Vérifie que l'installation a réussi, enregistre, puis clique sur **Publish**. Attends le message **Environment published**.

Les noms des boutons peuvent être en français selon la langue de ton ChatGPT.
Le site n'apparaît pas à l'étape 4 ? Préviens Hugo.

Codex lit automatiquement les règles du site (fichier `AGENTS.md`) : charte graphique, où se trouve chaque texte,
ce qu'il ne doit jamais toucher. Tu n'as pas à les lui réexpliquer.

## Étapes 3 à 6 – Modifier le site (à chaque fois)

### 3. Demander

1. Dans Codex, sélectionne l'environnement **site-sanso** et clique sur **Start a new task** (nouvelle tâche).
2. Écris ta demande en français, comme à une personne (exemples plus bas). Une demande = un sujet.
3. Codex modifie le site, puis montre ce qu'il a changé. S'il pose une question, réponds-lui.
4. Clique sur **Create PR** (créer une pull request). Une « pull request » est une proposition de modification,
   en attente de ton feu vert.

### 4. Regarder l'aperçu

1. Ouvre la pull request sur GitHub (lien donné par Codex, ou onglet **Pull requests** du dépôt).
2. Attends environ une minute : un commentaire **Netlify** apparaît avec un lien **Deploy Preview**. C'est le site avec
   ta modification, pas encore publié. Un QR code permet de l'ouvrir sur le téléphone.
3. En bas de la page, les contrôles automatiques doivent être verts (✔). Une croix rouge (✗) bloque la publication :
   le message explique pourquoi.

### 5. Retoucher si besoin

Retourne dans la **même tâche** Codex et demande l'ajustement (« le titre est trop long, raccourcis-le »).
Codex met à jour la pull request et l'aperçu se régénère. À vérifier lors du premier essai : si Codex crée une
nouvelle pull request au lieu de mettre à jour l'ancienne, ferme l'ancienne (**Close pull request**).

### 6. Publier

Dans la pull request : **Merge pull request** → **Confirm merge**. Le site est mis à jour une à deux minutes plus tard.

## Photos

Les photos passent par une « boîte de dépôt », le dossier `a-integrer` du dépôt GitHub. Codex les redresse,
les réduit et les range ensuite tout seul.

1. Sur GitHub, ouvre le dépôt, puis le dossier **a-integrer**.
2. **Add file → Upload files**, glisse les photos, puis **Propose changes** (ça marche aussi depuis le navigateur du téléphone).
3. Dans Codex, demande : « Intègre les photos du dossier a-integrer dans… » (un nouveau projet, la page Étude bois, etc.).

iPhone : les photos au format HEIC sont refusées. Dans **Réglages → Appareil photo → Formats**, choisis
**Le plus compatible**, ou envoie-toi les photos par e-mail : elles arrivent en JPG.

## Bien formuler une demande

Plus la demande est précise (quelle page, quel texte exact), moins il y a d'allers-retours.

| Je veux…                | J'écris à Codex                                                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Changer un texte        | « Page Étude bois : remplace la phrase d'introduction par : … »                                                                |
| Ajouter un projet       | « Ajoute un projet : chalet à Chexbres, construction bois, 2026. Photos dans a-integrer. Texte : … Affiche-le sur l'accueil. » |
| Retirer les exemples    | « Supprime les projets d'exemple. »                                                                                            |
| Changer une coordonnée  | « Change le numéro de téléphone en +41 … »                                                                                     |
| Ajuster la mise en page | « Sur téléphone, les titres des projets sont trop gros : réduis-les un peu. »                                                  |
| Ajouter une animation   | « Fais apparaître les trois cartes métiers de l'accueil en douceur au défilement. »                                            |

À éviter : « refais tout le site » ou plusieurs sujets dans une seule demande. Pour une grosse refonte, passe par Hugo.

## En cas de problème

| Situation                                | Que faire                                                                                                            |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Croix rouge ✗ sur la pull request        | Copie le message d'erreur dans la tâche Codex : « corrige ce problème ».                                             |
| Message « Fichiers techniques modifiés » | Codex a touché à une partie réservée : demande-lui d'annuler ce changement, ou transmets à Hugo.                     |
| Erreur visible après publication         | Dans la pull request publiée : bouton **Revert**, puis publie cette annulation (Merge). Le site revient comme avant. |
| Codex ne trouve pas le site              | Préviens Hugo (autorisation GitHub).                                                                                 |
| Limite d'utilisation ChatGPT atteinte    | Attendre la remise à zéro de la limite, ou passer par Claude (ci-dessous).                                           |

**Réservé à Hugo** : formulaire de contact, hébergement, nom de domaine et e-mails, structure technique du site.
Les contrôles automatiques bloquent ces modifications si un assistant s'y aventure.

## Autre option : Claude

Le circuit est identique avec Claude (abonnement Claude nécessaire) : ouvre [claude.ai/code](https://claude.ai/code),
relie ton compte GitHub, choisis le dépôt **site-sanso** et écris ta demande. Claude ouvre la pull request ;
aperçu et publication se font ensuite exactement comme aux étapes 4 à 6. Il lit les mêmes règles du site.

## Sources

- [Codex dans ChatGPT – mise en route (OpenAI)](https://learn.chatgpt.com/docs/cloud.md)
- [Offres incluant Codex (aide OpenAI)](https://help.openai.com/en/articles/11369540)
