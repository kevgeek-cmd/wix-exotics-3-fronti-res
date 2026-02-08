# Guide de Déploiement Vercel - Exotics 3 Frontières

Ce guide vous explique comment déployer votre site Next.js sur Vercel.

## Étape 1 : Préparer GitHub
1. Assurez-vous que tout votre code est poussé sur votre dépôt GitHub :
   ```bash
   git add .
   git commit -m "Prêt pour le déploiement"
   git push origin main
   ```

## Étape 2 : Créer le projet sur Vercel
1. Connectez-vous à [Vercel](https://vercel.com).
2. Cliquez sur **"Add New"** puis **"Project"**.
3. Importez votre dépôt `wix-exotics-3-fronti-res`.

## Étape 3 : Configurer les Variables d'Environnement (CRUCIAL)
Avant de cliquer sur "Deploy", vous **devez** ajouter la variable suivante dans la section "Environment Variables" :

| Clé | Valeur |
| :--- | :--- |
| `NEXT_PUBLIC_WIX_CLIENT_ID` | `5882e139-0a34-48e4-9ef6-f571f16379e6` |

*Note : Sans cette variable, le site ne pourra pas récupérer vos produits Wix.*

## Étape 4 : Déploiement
1. Cliquez sur **"Deploy"**.
2. Attendez 1 à 2 minutes que Vercel termine la construction.
3. Votre site est en ligne !

## Étape 5 : Configurer le domaine (Optionnel)
1. Dans le dashboard Vercel, allez dans **Settings > Domains**.
2. Ajoutez votre nom de domaine personnalisé si vous en avez un.

## Maintenance
Pour mettre à jour le site, il vous suffit de faire un `git push` sur la branche `main`. Vercel détectera automatiquement le changement et redéploiera le site.
