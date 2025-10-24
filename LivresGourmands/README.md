# Les Livres Gourmands - API REST

## 📚 Présentation du projet

API REST complète pour la gestion d'une librairie en ligne "Les Livres Gourmands". Cette API permet la gestion des produits (CRUD), des utilisateurs, du panier, des commandes, des avis/commentaires et des listes de cadeaux.

## Membres de l'équipe

- **Répartition des tâches** :

- **Daryl Saah** 
  - Architecture et structure du projet
  - Modèles de données et services
  - Système d'authentification JWT
  - Endpoints CRUD complets

- **Bah Mouhamadou Lamaranah** 
  - Validation et gestion des erreurs
  - Documentation et tests

##  Technologies utilisées

- **Backend** : Node.js + Express.js
- **Base de données** : MySQL
- **Authentification** : JWT + bcrypt
- **Validation** : express-validator
- **Versioning** : Git & GitHub

##  Prérequis

- Node.js >= 18.0.0
- MySQL >= 8.0
- npm ou yarn

##  Installation et exécution

### 1. Cloner le projet

```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration de la base de données
Créer un fichier `.env` à la racine du projet :
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=v
DB_NAME=livresgourmands
DB_PORT=3306
JWT_SECRET=
NODE_ENV=development
```

### 4. Créer la base de données


### 5. Démarrer le serveur
```bash
# Mode développement (avec nodemon)
npm run dev

# Mode production
npm start
```

Le serveur sera accessible sur `http://localhost:3001`

##  Endpoints disponibles

### Authentification (`/api/auth`)
- `POST /register` - Inscription d'un utilisateur
- `POST /login` - Connexion (retourne JWT)
- `GET /me` - Profil utilisateur (JWT requis)

###  Utilisateurs (`/api/users`)
- `GET /` - Liste des utilisateurs (admin)
- `GET /:id` - Détail utilisateur (admin ou propriétaire)
- `PUT /:id` - Mise à jour utilisateur (admin ou propriétaire)
- `DELETE /:id` - Suppression utilisateur (admin)

###  Ouvrages (`/api/ouvrages`)
- `GET /` - Liste des ouvrages (public, filtres disponibles)
- `GET /:id` - Détail ouvrage avec avis et commentaires
- `POST /` - Créer ouvrage (éditeur+)
- `PUT /:id` - Mettre à jour ouvrage (éditeur+)
- `DELETE /:id` - Supprimer ouvrage (gestionnaire+)
- `PUT /:id/stock` - Mettre à jour stock (gestionnaire+)
- `POST /:id/avis` - Ajouter avis (client ayant acheté)
- `POST /:id/commentaires` - Soumettre commentaire (client)

### Panier (`/api/panier`)
- `GET /` - Récupérer panier (client)
- `POST /items` - Ajouter article au panier
- `PUT /items` - Modifier quantité
- `DELETE /items/:ouvrage_id` - Retirer article
- `DELETE /` - Vider panier

###  Commandes (`/api/commandes`)
- `POST /` - Créer commande (client)
- `GET /my` - Historique commandes client
- `GET /:id` - Détail commande (client ou admin)
- `GET /` - Toutes les commandes (gestionnaire+)
- `PUT /:id/status` - Mettre à jour statut (gestionnaire+)
- `PUT /:id/cancel` - Annuler commande

###  Commentaires (`/api/commentaires`)
- `GET /pending` - Commentaires en attente (éditeur+)
- `PUT /:id/validate` - Valider commentaire (éditeur+)
- `PUT /:id/reject` - Rejeter commentaire (éditeur+)
- `DELETE /:id` - Supprimer commentaire (gestionnaire+)

###  Listes de cadeaux (`/api/listes-cadeaux`)
- `POST /` - Créer liste (client)
- `GET /my` - Mes listes (client)
- `GET /:code` - Consulter liste par code (public)
- `POST /:id/items` - Ajouter article à liste
- `DELETE /:id/items/:ouvrage_id` - Retirer article
- `DELETE /:id` - Supprimer liste

### Catégories (`/api/categories`)
- `GET /` - Liste des catégories (public)
- `GET /:id` - Détail catégorie (public)
- `POST /` - Créer catégorie (éditeur+)
- `PUT /:id` - Mettre à jour catégorie (éditeur+)
- `DELETE /:id` - Supprimer catégorie (éditeur+)

##  Rôles et permissions

- **Client** : Peut acheter, laisser des avis/commentaires, gérer son panier
- **Éditeur** : Peut gérer les ouvrages et valider les commentaires
- **Gestionnaire** : Peut gérer les commandes et le stock
- **Administrateur** : Accès complet au système

## Exemples de requêtes

### Inscription
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Jean Dupont",
    "email": "jean@example.com",
    "password": "motdepasse123"
  }'
```

### Connexion
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean@example.com",
    "password": "motdepasse123"
  }'
```

### Ajouter un ouvrage (avec JWT)
```bash
curl -X POST http://localhost:3001/api/ouvrages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_JWT_TOKEN" \
  -d '{
    "titre": "Les Misérables",
    "auteur": "Victor Hugo",
    "isbn": "9782070409189",
    "description": "Classique de la littérature française",
    "prix": 19.99,
    "stock": 10,
    "categorie_id": 1
  }'
```

### Ajouter au panier
```bash
curl -X POST http://localhost:3001/api/panier/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_JWT_TOKEN" \
  -d '{
    "ouvrage_id": 1,
    "quantite": 2
  }'
```

## tructure de la base de données

Le schéma comprend 12 tables principales :
- `users` - Utilisateurs du système
- `categories` - Catégories d'ouvrages
- `ouvrages` - Livres et produits
- `panier` - Paniers des clients
- `panier_items` - Articles dans les paniers
- `commandes` - Commandes clients
- `commande_items` - Articles des commandes
- `avis` - Avis clients sur les ouvrages
- `commentaires` - Commentaires clients (modérés)
- `listes_cadeaux` - Listes de cadeaux
- `liste_items` - Articles des listes de cadeaux
- `payments` - Informations de paiement

## Règles métier implémentées

1. **Gestion du stock** : Seuls les ouvrages avec stock > 0 sont visibles publiquement
2. **Validation des avis** : Un client ne peut laisser un avis que s'il a acheté l'ouvrage
3. **Modération des commentaires** : Les commentaires sont marqués `valide=false` à la soumission
4. **Transactions** : Les commandes et mises à jour de stock sont gérées en transactions
5. **Permissions** : Chaque endpoint respecte les rôles définis

##  Tests

### Collection Postman
Une collection Postman est disponible dans le dossier `docs/` avec tous les endpoints et exemples.

### Tests manuels
```bash
# Vérifier la santé de l'API
curl http://localhost:3001/api/health

# Tester l'authentification
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.com", "password": "admin123"}'
```

##  Gestion des erreurs

L'API retourne des codes d'erreur HTTP standard :
- `400` - Données invalides
- `401` - Non authentifié
- `403` - Permissions insuffisantes
- `404` - Ressource non trouvée
- `409` - Conflit (ex: email déjà utilisé)
- `500` - Erreur serveur

## 🔧 Scripts disponibles

```bash
npm start          # Démarrer en production
npm run dev        # Démarrer en développement
npm run migrate    # Exécuter les migrations SQL
```



##  Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -am 'Ajouter nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request



##  Support

Pour toute question ou problème :
- Créer une issue sur GitHub
- Contacter l'équipe de développement

---

**Note** : Cette API respecte les spécifications du travail 2 de Programmation Web Avancée  et implémente toutes les fonctionnalités demandées avec les bonnes pratiques de sécurité et de développement.
