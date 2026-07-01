# MonSuiviAuto

Application web de suivi d'entretien automobile. Gérez vos véhicules, historique d'entretiens, rappels d'échéances et retrouvez des garages autour de vous.

## Stack technique

**Frontend** : React 18 + TypeScript + Vite + Tailwind CSS  
**Backend** : Node.js + Express + TypeScript  
**Base de données** : MySQL via Prisma (données métier) + MongoDB (journalisation)  
**Déploiement** : Vercel (front) · Render (API) · TiDB Serverless (MySQL) · MongoDB Atlas · Cloudinary (fichiers)

## Prérequis

- Node.js 20+
- MySQL 8
- MongoDB 7

## Installation

```bash
# Cloner le projet
git clone https://github.com/Maxime-L-G/MonSuiviAuto.git
cd MonSuiviAuto

# Installer les dépendances
cd apps/api && npm install
cd ../web && npm install
```

## Configuration

Créer un fichier `apps/api/.env` à partir de ce modèle :

```env
DATABASE_URL="mysql://user:password@localhost:3306/monsuiviauto"
JWT_SECRET="votre-secret"
JWT_EXPIRES_IN="1h"
MONGODB_URI="mongodb://localhost:27017/monsuiviauto_audit"
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
RESEND_API_KEY=
CRON_SECRET=
```

Créer un fichier `apps/web/.env` :

```env
VITE_API_URL=http://localhost:4000
```

## Lancement en local

```bash
# API (depuis apps/api)
npx prisma migrate dev
npm run dev

# Frontend (depuis apps/web)
npm run dev
```

L'API tourne sur `http://localhost:4000`, le front sur `http://localhost:5173`.

## Avec Docker

```bash
# Depuis la racine du projet
docker compose up --build
```

Frontend accessible sur `http://localhost:3000`, API sur `http://localhost:4000`.

## Tests

```bash
# Depuis apps/api
npm run test:unit        # Tests unitaires (sans base de données)
npm run test:integration # Tests d'intégration (requiert une base de test)
```

Pour les tests d'intégration, créer une base MySQL `monsuiviauto_test` et un fichier `apps/api/.env.test` avec les credentials correspondants.

## Documentation API

Une fois l'API démarrée, la documentation Swagger est accessible sur `http://localhost:4000/api-docs`.

## Application déployée

**Frontend** : https://mon-suivi-auto.vercel.app  
**API** : https://monsuiviauto.onrender.com  
**Documentation API** : https://monsuiviauto.onrender.com/api-docs
