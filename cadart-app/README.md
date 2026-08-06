# CADART Tennis Academy — Guide de déploiement (sans terminal)

Ce dossier contient ton dashboard, prêt à être mis en ligne. Tu n'as
besoin d'aucune ligne de commande : tout se fait depuis ton navigateur,
via GitHub et Vercel (les deux sont gratuits pour ce projet).

⚠️ **Étape intermédiaire** : dans cette première version en ligne, les
données sont stockées dans le navigateur de la personne qui l'utilise
(pas encore partagées entre plusieurs appareils). C'est volontaire —
ça nous permet de valider le déploiement avant de brancher une vraie
base de données partagée (Supabase), qui sera la prochaine étape.

---

## Étape 1 — Créer un compte GitHub

1. Va sur **https://github.com/signup**
2. Crée un compte (email + mot de passe)
3. Une fois connecté, clique sur le **+** en haut à droite → **New repository**
4. Nom du repo : `cadart-tennis-academy`
5. Laisse-le en **Public** (ou Private si tu préfères, gratuit aussi)
6. Ne coche aucune case ("Add a README", etc.) — laisse le dépôt vide
7. Clique **Create repository**

## Étape 2 — Envoyer les fichiers sur GitHub

1. Sur la page de ton nouveau dépôt (vide), clique sur le lien
   **uploading an existing file**
2. Glisse-dépose **tout le contenu de ce dossier** `cadart-app`
   (tous les fichiers et le dossier `src`, pas le dossier `cadart-app`
   lui-même) dans la zone de dépôt
3. En bas de page, clique **Commit changes**

## Étape 3 — Déployer sur Vercel

1. Va sur **https://vercel.com/signup**
2. Choisis **Continue with GitHub** (ça relie directement ton compte)
3. Une fois connecté, clique **Add New...** → **Project**
4. Trouve `cadart-tennis-academy` dans la liste et clique **Import**
5. Vercel détecte automatiquement qu'il s'agit d'un projet Vite —
   ne change rien aux réglages proposés
6. Clique **Deploy**
7. Patiente ~1 minute — Vercel te donne ensuite un lien du type
   `https://cadart-tennis-academy.vercel.app`

C'est ce lien que tu utilises désormais au quotidien, depuis
n'importe quel ordinateur, tablette ou téléphone. Ajoute-le à tes
favoris / à l'écran d'accueil de ton téléphone pour y accéder comme
une app.

## Et après ?

Chaque fois qu'on fera une modification du dashboard ensemble, il
suffira de remplacer les fichiers sur GitHub (Étape 2) — Vercel
redéploiera automatiquement la nouvelle version en quelques secondes.

La prochaine étape sera de brancher une vraie base de données
(Supabase) pour que toi et tes coachs partagiez les mêmes données en
temps réel, et que rien ne se perde si le cache du navigateur est
vidé.
