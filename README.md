📋 Description
CoopLedger est une application web progressive (PWA) qui résout le problème structurel d'opacité financière dans les coopératives agricoles togolaises.
En mars 2025, plus de 4 000 000 FCFA de cotisations d'agriculteurs du Centre de Transformation Agricole (CTA) de Broukou (Préfecture de Doufelgou, Région de la Kara) ont été détournés. Ce détournement a été possible parce qu'il n'existait aucun registre transparent, aucun audit accessible aux membres et aucun mécanisme de vote sur les dépenses.
CoopLedger rend ce type de fraude techniquement impossible en enregistrant chaque transaction sur un registre distribué simulant la blockchain Polygon, avec un système de vote automatique par smart contract.

🎯 Problème résolu
IndicateurDonnéeCoopératives togolaises sans outil numérique60%+Membres ne faisant pas confiance à leur direction70%Fonds collectifs détournés chaque année15 à 20%Financement supplémentaire pour coopératives transparentes3× plus (IFAD 2022)

✨ Fonctionnalités principales
🏠 Tableau de bord en temps réel

Solde total de la coopérative calculé automatiquement depuis Firebase
Graphique Dépenses vs Revenus des 6 derniers mois (données réelles)
Alertes de votes en cours avec décompte en temps réel
Activité récente de la coopérative
Accès personnalisé selon le rôle (Président / Trésorier / Membre)

🗳️ Système de vote décentralisé

Toute dépense > 500 000 FCFA déclenche automatiquement un vote
Vote OUI / NON depuis n'importe quel appareil
Barre de progression du quorum en temps réel (seuil : 60%)
Annulation automatique si le quorum n'est pas atteint avant expiration
Chaque vote génère un hash cryptographique unique
Impossible de voter deux fois

📋 Registre immuable (Historique)

Toutes les transactions tracées avec hash blockchain
Filtres par type (Revenus / Dépenses / Valeur élevée)
Recherche par titre ou hash
Pagination et détails par transaction
Statuts : Vérifié ✅ / En cours 🔄 / Rejeté ❌

➕ Création de transactions (Trésorier / Président)

Formulaire en 3 étapes avec confirmation
Déclenchement automatique du vote si montant dépasse le seuil
Reçu blockchain avec hash unique à chaque transaction
Catégories : Intrants, Matériel, Transport, Infrastructure, Formation

🔐 Gestion des rôles
RôlePermissionsPrésidentTout voir + créer des transactions + voterTrésorierTout voir + créer des transactions + voterMembreConsulter le registre + voter

🛠️ Technologies utilisées
TechnologieUsageReact JS 18Interface utilisateurTailwind CSS 3Design et stylesFirebase AuthenticationConnexion / Inscription sécuriséeFirebase FirestoreBase de données temps réelRechartsGraphiques Dépenses vs RevenusReact Router DOMNavigation entre les pagesPolygon (simulé)Comportement blockchain — hash cryptographique, immuabilitéVercel / NetlifyDéploiement en production

🚀 Installation et utilisation
Prérequis

Node.js 18+
npm ou yarn
Compte Firebase (gratuit)

1. Cloner le projet
bashgit clone https://github.com/TON_USERNAME/coopledger-app.git
cd coopledger-app
2. Installer les dépendances
bashnpm install
3. Configurer Firebase
Crée un fichier .env à la racine du projet :
envREACT_APP_FIREBASE_API_KEY=ta_valeur
REACT_APP_FIREBASE_AUTH_DOMAIN=ton_projet.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=ton_projet
REACT_APP_FIREBASE_STORAGE_BUCKET=ton_projet.appspot.com
REACT_APP_FIREBASE_MESSAGING_ID=ton_id
REACT_APP_FIREBASE_APP_ID=ton_app_id
Dans src/firebase.js, remplace les valeurs par :
jsconst firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};
4. Configurer Firebase Console

Crée un projet sur console.firebase.google.com
Active Firestore Database en mode test
Active Authentication → Email/Mot de passe
Ajoute localhost dans Authentication → Settings → Authorized domains

5. Créer les comptes de test
Dans Firebase Console → Authentication → Add User :
president@coop.tg   →  mot de passe de votre choix
tresorier@coop.tg   →  mot de passe de votre choix
Dans Firestore → collection users → créer un document par utilisateur avec l'UID comme ID :
json{
  "nom": "Moussa Traoré",
  "email": "president@coop.tg",
  "role": "president",
  "cooperativeId": "broukou",
  "statut": "actif"
}
6. Lancer en développement
bashnpm start
Ouvre http://localhost:3000
7. Build de production
bashCI= npm run build

📁 Structure du projet
src/
├── firebase.js              # Configuration Firebase
├── App.jsx                  # Routing + authentification
├── index.js                 # Point d'entrée
├── pages/
│   ├── Login.jsx            # Connexion / Inscription
│   ├── Dashboard.jsx        # Tableau de bord principal
│   ├── Vote.jsx             # Système de vote
│   ├── Historique.jsx       # Registre des transactions
│   └── NouvelleTransaction.jsx  # Créer une transaction
├── components/
│   ├── Navbar.jsx           # Barre de navigation
│   └── ProtectedRoute.jsx   # Protection par rôle
└── hooks/
    └── useAuth.js           # Hook d'authentification

🎬 Scénario de démonstration

Connexion Trésorier → tresorier@coop.tg
Créer une transaction → "Achat engrais NPK" · 750 000 FCFA
Vote déclenché automatiquement ⚡ (> 500 000 FCFA)
Connexion Membre sur un autre onglet → alerte visible sur le dashboard
Vote OUI → compteur mis à jour en temps réel
Historique → transaction visible avec hash blockchain


🌍 Cas réels documentés
StructureProblèmeSourceCTA de Broukou (Kara)4 000 000 FCFA détournés · Mars 2025TogoActualitéFNGPC / NSCT (filière coton)Absence de dividendes · gestion opaque · Avril 2025République Togolaise
