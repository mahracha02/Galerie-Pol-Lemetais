# Galerie Pol Lémétais

Application web de gestion et présentation de la galerie d'art Pol Lémétais.

## 🚀 Fonctionnalités

### Frontend
- **Page d'accueil** : Présentation de la galerie avec sections "À propos", "Artistes", "Événements"
- **Section Artistes** :
  - Filtrage par nom et pays
  - Affichage en grille avec cartes d'artistes
  - Design responsive avec effets de survol
  - Pagination avec "Afficher plus"
- **Section Événements** :
  - Organisation chronologique par année
  - Filtrage par nom et date
  - Affichage des événements à venir, en cours et passés
  - Design moderne avec timeline verticale
- **Section À propos** :
  - Présentation de la galerie
  - Section "Ils en parlent" avec effets de survol
  - Intégration des réseaux sociaux

### Backend
- API RESTful avec Symfony
- Gestion des artistes et événements
- Système d'authentification JWT
- Upload et gestion des images
- Gestion de la base de données MySQL

## 🛠️ Technologies Utilisées

### Frontend
- React.js
- Tailwind CSS
- Framer Motion (animations)
- React Router
- Axios

### Backend
- Symfony 6.x
- PHP 8.x
- MySQL
- JWT (authentification)
- API Platform
- Doctrine ORM

## 📋 Prérequis

### Frontend
- Node.js (v14 ou supérieur)
- npm ou yarn

### Backend
- PHP 8.1 ou supérieur
- Composer
- MySQL 8.0 ou supérieur
- Symfony CLI
- Extensions PHP requises :
  - php-xml
  - php-curl
  - php-mbstring
  - php-zip
  - php-mysql

## 🔧 Installation

1. Cloner le repository
```bash
git clone [URL_DU_REPO]
cd galerie-pol-lemetais
```

2. Installer les dépendances du backend
```bash
cd backend
composer install
```

3. Configurer la base de données
```bash
# Créer la base de données
php bin/console doctrine:database:create

# Créer les migrations
php bin/console make:migration

# Exécuter les migrations
php bin/console doctrine:migrations:migrate
```

4. Installer les dépendances du frontend
```bash
cd frontend
npm install
```

5. Configurer les variables d'environnement
```bash
# Dans le dossier backend, copier le fichier .env
cp .env .env.local
# Remplir les variables nécessaires dans le fichier .env.local
```

## 🚀 Lancement du Projet

1. Démarrer le backend
```bash
cd backend
symfony server:start
```

2. Démarrer le frontend
```bash
cd frontend
npm run dev
```

L'application sera accessible sur :
- Frontend : http://localhost:5173
- Backend : http://localhost:8000

## 📁 Structure du Projet

```
galerie-pol-lemetais/
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── tailwind.config.js
│
└── backend/
    ├── src/
    │   ├── Controller/
    │   ├── Entity/
    │   ├── Repository/
    │   ├── Service/
    │   └── Api/
    ├── config/
    ├── migrations/
    ├── public/
    ├── templates/
    ├── composer.json
    └── .env
```

## 🔑 Commandes Utiles

### Backend
```bash
# Développement
symfony server:start    # Démarre le serveur Symfony
php bin/console cache:clear  # Vide le cache
php bin/console doctrine:schema:update --force  # Met à jour la base de données

# Base de données
php bin/console doctrine:migrations:diff    # Crée une migration
php bin/console doctrine:migrations:migrate # Exécute les migrations
php bin/console doctrine:fixtures:load      # Charge les fixtures

# Tests
php bin/phpunit        # Lance les tests unitaires
php bin/console test   # Lance les tests fonctionnels
```

### Frontend
```bash
npm run dev          # Démarre le serveur de développement
npm run build        # Compile le projet pour la production
npm run preview      # Prévisualise la version de production
npm run lint         # Vérifie le code avec ESLint
```

## 🎨 Design et UI

- Design moderne et minimaliste
- Palette de couleurs :
  - Rouge principal : #972924
  - Noir : #000000
  - Blanc : #FFFFFF
  - Gris : #525252
- Polices :
  - Kenyan Coffee (titres)
  - Poppins (texte)
- Composants réutilisables
- Animations fluides avec Framer Motion
- Design responsive pour tous les appareils

## 🔒 Sécurité

- Authentification JWT
- Protection des routes sensibles
- Validation des données avec les contraintes Symfony
- Gestion sécurisée des uploads
- Protection CSRF
- Validation des entrées utilisateur
- Protection contre les injections SQL

## 📱 Responsive Design

- Breakpoints :
  - Mobile : < 768px
  - Tablette : 768px - 1024px
  - Desktop : > 1024px
- Layout adaptatif
- Images optimisées
- Navigation mobile-friendly

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/v2.0`)
3. Commit les changements (`git commit -m 'Add new version of design'`)
4. Push sur la branche (`git push origin feature/v2.0`)
5. Ouvrir une Pull Request


## 👥 GitHub

Lien du projet: [https://github.com/mahracha02/Galerie-Pol-Lemetais]

# Déploiement sur OVH

## 1. Prérequis
- Hébergement OVH (mutualisé ou VPS)
- Nom de domaine configuré chez OVH
- Accès FTP/SFTP ou SSH
- Base de données créée via l'espace client OVH
- Node.js et Composer installés en local

## 2. Préparation du Backend (Symfony)
### a. Configuration des variables d'environnement
Créez un fichier `.env.local` (ou `.env.prod`) dans `backend/` :
```env
APP_ENV=prod
APP_SECRET=VotreCléSecrète
DATABASE_URL=mysql://user:password@host:3306/nom_base
CORS_ALLOW_ORIGIN=^https?://(www\.)?votre-domaine\.fr$
```
Remplacez les valeurs par celles fournies par OVH.

### b. Installation des dépendances
```bash
cd backend
composer install --no-dev --optimize-autoloader
```

### c. Compilation des assets
```bash
php bin/console asset-map:compile
# ou
yarn encore production
```

### d. Migration de la base de données
```bash
php bin/console doctrine:migrations:migrate --no-interaction
```

### e. Nettoyage du cache
```bash
php bin/console cache:clear --env=prod
php bin/console cache:warmup --env=prod
```

## 3. Préparation du Frontend (React)
### a. Build de l'application
```bash
cd frontend
npm install
npm run build
```
Le build sera généré dans `frontend/dist/`.

## 4. Déploiement sur OVH
### a. Structure recommandée
- Placez le contenu de `backend/public/` dans `www/`.
- Placez le build React (`frontend/dist/`) dans `www/app/` (ou autre dossier).

### b. Upload des fichiers
Utilisez FTP/SFTP ou SSH pour transférer :
- `backend/public/*` → `www/`
- `frontend/dist/*` → `www/app/`

### c. Code source Symfony
Placez le code source Symfony (hors `public/`) dans un dossier non accessible publiquement, par exemple `www/../backend/`.
Modifiez `public/index.php` pour pointer vers l'autoloader :
```php
require dirname(__DIR__).'/../backend/vendor/autoload.php';
```

### d. Configuration du serveur web
- Symfony doit être servi depuis `public/`.
- Le `.htaccess` de `public/` gère la réécriture d'URL.
- Le domaine doit pointer vers `www/`.

## 5. Permissions
```bash
chmod -R 775 var public/uploads
```

## 6. Sécurité
- Ne mettez jamais vos fichiers `.env` dans le dossier public.
- Désactivez le mode debug (`APP_ENV=prod`, `APP_DEBUG=0`).
- Utilisez HTTPS (certificat SSL via OVH).

## 7. Accès à l'API et au Frontend
- API Symfony : `https://votre-domaine.fr/api/...`
- Frontend React : `https://votre-domaine.fr/app/`

## 8. Dépannage
- Consultez les logs dans `var/log/` ou via OVH.
- Vérifiez les permissions si erreur 500.
- Utilisez `php -i` pour vérifier la version de PHP.

## 9. Ressources utiles
- [Documentation OVH Hébergement Web](https://docs.ovh.com/fr/hosting/)
- [Déployer Symfony sur OVH](https://symfony.com/doc/current/deployment/)
- [Configurer un domaine OVH](https://docs.ovh.com/fr/domains/)
