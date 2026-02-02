# 🌟 Fibra - Fibonacci Visualization & Creation Engine

Une application interactive qui explore la beauté mathématique de la suite de Fibonacci à travers des visualisations spectaculaires, de la musique générée algorithmiquement et des algorithmes d'optimisation avancés.

## ✨ Fonctionnalités

### 🔢 Séquence de Fibonacci
- Génération interactive de la suite de Fibonacci
- Visualisation de la convergence vers le nombre d'or (φ = 1.618...)
- Analyse des ratios entre termes consécutifs
- Propriétés mathématiques détaillées

### 🌀 Visualisations 2D & 3D
- **Spirale 2D** : Spirale dorée avec rectangles de Fibonacci
- **Visualisation 3D** : Exploration interactive avec Three.js
  - Spirale 3D animée
  - Rectangles dorés en perspective
  - Distribution sphérique de Fibonacci

### 🎵 Générateur Musical
- Création de mélodies basées sur la suite de Fibonacci
- Génération d'accords harmoniques
- Interface de contrôle en temps réel avec Tone.js
- Paramètres ajustables : tonalité, tempo, instrumentation

### ⚙️ Algorithmes d'Optimisation
- **Fibonacci Search** : Recherche d'optimum unimodal
- **Golden Section Search** : Optimisation par ratio d'or
- **Fibonacci Heap** : Structure de données avancée
- Visualisation des itérations et performances

## 🚀 Installation et Lancement

### Prérequis
- Node.js (v16 ou supérieur)
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone <repository-url>
cd Fibonacci

# Installer les dépendances
npm install
```

### Développement
```bash
# Lancer le serveur de développement
npm run dev

# L'application sera disponible sur http://localhost:3000
```

### Production
```bash
# Construire l'application
npm run build

# Prévisualiser la build
npm run preview
```

## 🛠️ Technologies Utilisées

### Frontend
- **React 18** - Framework UI
- **Vite** - Build tool moderne
- **TailwindCSS** - Framework CSS
- **Framer Motion** - Animations

### Visualisations
- **Three.js** - Rendu 3D
- **@react-three/fiber** - Intégration React pour Three.js
- **@react-three/drei** - Helpers et composants 3D
- **Canvas API** - Visualisations 2D

### Audio
- **Tone.js** - Génération et manipulation audio
- **Web Audio API** - Traitement audio en temps réel

### Utilitaires
- **Mathematical Libraries** - Fonctions mathématiques personnalisées
- **Algorithm Implementations** - Structures de données et algorithmes

## 📁 Structure du Projet

```
src/
├── components/          # Composants React
│   ├── Header.jsx      # En-tête de l'application
│   ├── Navigation.jsx  # Navigation entre sections
│   ├── SequenceViewer.jsx    # Visualisation de la suite
│   ├── Spiral2D.jsx    # Spirale 2D interactive
│   ├── Spiral3D.jsx    # Visualisation 3D
│   ├── MusicGenerator.jsx    # Générateur musical
│   └── AlgorithmViewer.jsx   # Algorithmes d'optimisation
├── utils/              # Utilitaires et logique métier
│   ├── fibonacci.js           # Fonctions mathématiques de base
│   ├── fibonacciAlgorithms.js # Algorithmes d'optimisation
│   └── fibonacciMusic.js     # Génération musicale
├── App.jsx             # Composant principal
├── main.jsx           # Point d'entrée
└── index.css          # Styles globaux
```

## 🎯 Concepts Mathématiques

### Suite de Fibonacci
La suite de Fibonacci est définie par :
- F₀ = 0, F₁ = 1
- Fₙ = Fₙ₋₁ + Fₙ₋₂ pour n ≥ 2

### Nombre d'Or
Le ratio d'or φ = (1 + √5)/2 ≈ 1.618... apparaît comme limite des quotients Fₙ₊₁/Fₙ.

### Applications
- **Nature** : Spirales de coquillages, arrangement des feuilles
- **Art** : Compositions classiques, architecture
- **Algorithmes** : Optimisation, structures de données

## 🎨 Interface Utilisateur

L'interface moderne utilise un thème sombre avec des accents dorés, reflétant l'élégance mathématique de la suite de Fibonacci. Les interactions sont fluides avec des animations subtiles et des transitions visuelles.

## 🔧 Configuration

### Personnalisation
- Modifiez `tailwind.config.js` pour ajuster le thème
- Configurez `vite.config.js` pour les paramètres de build
- Ajustez les paramètres audio dans `MusicGenerator.jsx`

### Performance
- Les visualisations 3D sont optimisées pour des performances fluides
- La génération musicale utilise le streaming audio
- Les algorithmes incluent des limites pour éviter les surcharges

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Signaler des bugs
- Proposer de nouvelles fonctionnalités
- Améliorer la documentation
- Optimiser les performances

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

---

**Fibra** - Explorez la magie des mathématiques à travers la technologie moderne ! ✨🔢🎵
