# Déploiement — Vercel

Ce guide suppose que l'API est déjà déployée sur Render (voir
`../mouslih-academy-backend/DEPLOYMENT.md`) — il faut son URL avant de configurer ce projet.

## 1. Importer le projet

Sur [vercel.com](https://vercel.com) : **Add New** → **Project**, importer ce dépôt GitHub.
Next.js est détecté automatiquement, aucune configuration de build à changer.

## 2. Variables d'environnement

À renseigner dans **Project Settings → Environment Variables** (voir `.env.example` pour le
détail) :

| Variable | Valeur |
|---|---|
| `NEXT_PUBLIC_USE_MOCKS` | `false` |
| `NEXT_PUBLIC_API_BASE_URL` | URL du service Render (ex. `https://mouslih-academy-backend.onrender.com`) |
| `NEXT_PUBLIC_SITE_URL` | URL de production Vercel une fois connue (ex. `https://mouslih-academy.vercel.app`, ou le domaine personnalisé) |

**Important** : `NEXT_PUBLIC_API_BASE_URL` est aussi lue au moment du *build* (pas seulement à
l'exécution) pour autoriser les images de couvertures uploadées à s'afficher via
`next/image` (voir `next.config.ts`). Si elle est ajoutée ou modifiée après un premier
déploiement, il faut redéclencher un build (Vercel le fait automatiquement sur un nouveau
push, ou via **Redeploy** dans le tableau de bord).

## 3. Ordre conseillé (les deux services se référencent mutuellement)

1. Déployer l'API sur Render d'abord → noter son URL.
2. Déployer ce frontend sur Vercel avec `NEXT_PUBLIC_API_BASE_URL` pointant vers cette URL →
   noter l'URL Vercel obtenue (ou le domaine personnalisé configuré).
3. Renseigner `NEXT_PUBLIC_SITE_URL` avec cette URL Vercel, redéployer si besoin.
4. Revenir sur Render mettre à jour `CORS_ORIGIN` et `FRONTEND_URL` avec cette même URL
   Vercel, pour que l'API accepte les requêtes du frontend et construise des liens corrects
   dans les e-mails de confirmation.

## 4. Domaine personnalisé

En cas de domaine personnalisé côté Vercel, penser à répéter l'étape 4 ci-dessus (mettre à
jour `CORS_ORIGIN` / `FRONTEND_URL` sur Render) et à mettre à jour `NEXT_PUBLIC_SITE_URL` avec
le domaine final — sinon les métadonnées de partage (Open Graph, image WhatsApp/Facebook)
continuent de pointer vers l'ancienne URL.
