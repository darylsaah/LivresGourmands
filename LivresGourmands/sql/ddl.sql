
DROP DATABASE IF EXISTS livresgourmands;
CREATE DATABASE livresgourmands CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE livresgourmands;

-- ========================================================
-- TABLE : users
-- ========================================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('client','editeur','gestionnaire','administrateur') DEFAULT 'client',
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ========================================================
-- TABLE : categories
-- ========================================================
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

-- ========================================================
-- TABLE : ouvrages
-- ========================================================
CREATE TABLE ouvrages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    auteur VARCHAR(150) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    description TEXT,
    prix DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0 CHECK (stock >= 0),
    categorie_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categorie_id) REFERENCES categories(id)
);

-- ========================================================
-- TABLE : panier
-- ========================================================
CREATE TABLE panier (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    actif BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id)
);

-- ========================================================
-- TABLE : panier_items
-- ========================================================
CREATE TABLE panier_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    panier_id INT NOT NULL,
    ouvrage_id INT NOT NULL,
    quantite INT NOT NULL CHECK (quantite > 0),
    prix_unitaire DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (panier_id) REFERENCES panier(id) ON DELETE CASCADE,
    FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id)
);

-- ========================================================
-- TABLE : commandes
-- ========================================================
CREATE TABLE commandes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL,
    statut ENUM('en_cours','payee','annulee','expediee') DEFAULT 'en_cours',
    adresse_livraison TEXT,
    mode_livraison VARCHAR(100),
    mode_paiement VARCHAR(100),
    payment_provider_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id)
);

-- ========================================================
-- TABLE : commande_items
-- ========================================================
CREATE TABLE commande_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    commande_id INT NOT NULL,
    ouvrage_id INT NOT NULL,
    quantite INT NOT NULL,
    prix_unitaire DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (commande_id) REFERENCES commandes(id) ON DELETE CASCADE,
    FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id)
);

-- ========================================================
-- TABLE : listes_cadeaux
-- ========================================================
CREATE TABLE listes_cadeaux (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(150) NOT NULL,
    proprietaire_id INT NOT NULL,
    code_partage VARCHAR(100) UNIQUE NOT NULL,
    date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (proprietaire_id) REFERENCES users(id)
);

-- ========================================================
-- TABLE : liste_items
-- ========================================================
CREATE TABLE liste_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    liste_id INT NOT NULL,
    ouvrage_id INT NOT NULL,
    quantite_souhaitee INT DEFAULT 1 CHECK (quantite_souhaitee > 0),
    FOREIGN KEY (liste_id) REFERENCES listes_cadeaux(id) ON DELETE CASCADE,
    FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id)
);

-- ========================================================
-- TABLE : avis
-- ========================================================
CREATE TABLE avis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    ouvrage_id INT NOT NULL,
    note INT CHECK (note BETWEEN 1 AND 5),
    commentaire TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (client_id, ouvrage_id),
    FOREIGN KEY (client_id) REFERENCES users(id),
    FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id)
);

-- ========================================================
-- TABLE : commentaires
-- ========================================================
CREATE TABLE commentaires (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    ouvrage_id INT NOT NULL,
    contenu TEXT NOT NULL,
    valide BOOLEAN DEFAULT FALSE,
    date_soumission TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_validation TIMESTAMP NULL,
    valide_par INT NULL,
    FOREIGN KEY (client_id) REFERENCES users(id),
    FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id),
    FOREIGN KEY (valide_par) REFERENCES users(id)
);

-- ========================================================
-- TABLE : payments (optionnel)
-- ========================================================
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    commande_id INT NOT NULL,
    provider VARCHAR(50),
    provider_payment_id VARCHAR(100),
    statut VARCHAR(50),
    amount DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (commande_id) REFERENCES commandes(id)
);

-- ========================================================
-- INDEX supplémentaires
-- ========================================================
CREATE INDEX idx_ouvrage_categorie ON ouvrages(categorie_id);
CREATE INDEX idx_panier_client ON panier(client_id);
CREATE INDEX idx_commande_client ON commandes(client_id);

-- ========================================================
-- DONNÉES DE TEST
-- ========================================================
INSERT INTO users (nom, email, password_hash, role) VALUES
('Admin', 'admin@test.com', 'hash_admin', 'administrateur'),
('Éditeur', 'editeur@test.com', 'hash_editeur', 'editeur'),
('Client1', 'client1@test.com', 'hash_client', 'client');

INSERT INTO categories (nom, description) VALUES
('Roman', 'Livres de fiction'),
('Science', 'Livres scientifiques'),
('Informatique', 'Programmation et technologie');

INSERT INTO ouvrages (titre, auteur, isbn, description, prix, stock, categorie_id)
VALUES
('Les Misérables', 'Victor Hugo', '9782070409189', 'Classique français', 19.99, 10, 1),
('Introduction à MySQL', 'John Smith', '9781234567897', 'Base de données relationnelles', 29.99, 5, 3);
