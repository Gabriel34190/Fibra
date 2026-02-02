# Projet Fibonacci Hub - Spécifications complètes

## Contexte du projet

Le projet Fibonacci Hub est une application web interactive conçue pour explorer, visualiser et comprendre la séquence de Fibonacci sous différents angles : mathématiques, visuels, musicaux et algorithmiques. Il s'agit d'une solution complète permettant de centraliser les outils d'exploration, d'offrir une interface utilisateur moderne et immersive, et de simplifier l'apprentissage des concepts liés à la suite de Fibonacci.

## Objectifs généraux et spécifiques

### Objectifs généraux :
- Créer une application web intuitive pour explorer la séquence de Fibonacci.
- Permettre aux utilisateurs d'interagir avec la suite à travers plusieurs perspectives (mathématique, visuelles, sonores).
- Offrir aux développeurs et scientifiques des outils avancés pour analyser et visualiser les propriétés de Fibonacci.

### Objectifs spécifiques :
- Intégrer des visualisations 2D et 3D des spirales et fractales de Fibonacci.
- Permettre l'exploration d'algorithmes classiques et optimisés de calcul.
- Générer de la musique basée sur la séquence de Fibonacci.
- Fournir un simulateur d'émergence pour observer les comportements naturels.
- Analyser et détecter les patterns de Fibonacci dans des données.
- Ajouter des fonctionnalités interactives d'édition et de composition.
- Garantir une expérience utilisateur fluide et responsive.

## Fonctionnalités attendues / User Stories

### Fonctionnalités principales :

#### 1. Visualisation de la séquence :
- Affichage des nombres de Fibonacci avec recherche et filtrage.
- Graphiques montrant la croissance exponentielle et le ratio d'or.
- Historique et propriétés mathématiques de chaque nombre.

#### 2. Visualisations géométriques :
- Spirale 2D interactive avec animation progressive.
- Spirale 3D interactive avec rotation et zoom.
- Rectangles de Fibonacci avec visualisation du ratio d'or.
- Fractales générées à partir de la séquence.

#### 3. Générateur de fractales :
- Génération de fractales basées sur les algorithmes de Fibonacci.
- Contrôle des paramètres (profondeur, couleurs, échelle).
- Export des images générées.

#### 4. Générateur de musique :
- Conversion de la séquence en notes musicales.
- Ajustement du tempo, gamme et instrumentation.
- Lecture et synthèse audio en temps réel.
- Export en format audio (MP3, WAV).

#### 5. Visualiseur d'algorithmes :
- Comparaison visuelle de plusieurs algorithmes de calcul.
- Affichage pas-à-pas de l'exécution.
- Analyse de la complexité (temps, espace).
- Performance benchmark.

#### 6. Horloge de Fibonacci :
- Affichage du temps avec la séquence de Fibonacci.
- Représentation visuelle des nombres.
- Mode temps réel ou simulation.

#### 7. Visualiseur de recherche :
- Implémentation d'algorithmes de recherche basés sur Fibonacci.
- Visualisation pas-à-pas de la recherche.
- Comparaison avec d'autres algorithmes.

#### 8. Explorateur de codage :
- Tutoriels interactifs sur les concepts de Fibonacci.
- Exemples de code commentés.
- Exécution directe de code dans l'interface.

#### 9. Trader Fibonacci :
- Simulation de trading basée sur les niveaux de Fibonacci.
- Graphiques financiers interactifs.
- Backtest et analyse de stratégies.

### User Stories :

1. En tant qu'utilisateur, je veux visualiser la spirale de Fibonacci en 2D et 3D pour mieux comprendre sa structure géométrique.
2. En tant qu'étudiant, je veux voir étape par étape comment les différents algorithmes calculent Fibonacci pour apprendre les concepts.
3. En tant qu'artiste, je veux générer de la musique basée sur Fibonacci pour explorer les liens entre mathématiques et art.
4. En tant qu'utilisateur, je veux accéder à tous les outils depuis une interface unifiée et intuitive.
5. En tant qu'trader, je veux simuler des stratégies basées sur les niveaux de Fibonacci pour tester mes hypothèses.

## Technologies utilisées

### Frontend :
- **React.js** : Framework JavaScript pour le développement de l'interface utilisateur.
- **Vite** : Bundler moderne pour l'optimisation et le développement rapide.
- **Three.js** : Bibliothèque 3D pour les visualisations avancées (spirale 3D, fractales).
- **Chart.js / Recharts** : Graphiques interactifs pour l'analyse de données.
- **Tailwind CSS** : Framework CSS utility-first pour un design moderne et responsive.
- **Web Audio API** : Génération de sons et musique.
- **Canvas API** : Dessins 2D optimisés pour les spirales et fractales.

### Logique métier :
- **fibonacci.js** : Fonctions utilitaires pour calculer et manipuler la séquence.
- **fibonacciAlgorithms.js** : Implémentation des différents algorithmes (récursif, itératif, mémoïsation, DP, Binet).
- **fibonacciMusic.js** : Conversion de la séquence en données musicales.

### Composants principaux :
- **Navigation** : Barre de navigation pour accéder aux différents outils.
- **SequenceViewer** : Affichage et navigation dans la séquence.
- **Spiral2D** : Visualisation interactive de la spirale 2D.
- **Spiral3D** : Visualisation 3D avec contrôles de rotation.
- **FibonacciFractalGenerator** : Génération et personnalisation de fractales.
- **MusicGenerator** : Création de musique basée sur Fibonacci.
- **AlgorithmViewer** : Comparaison et analyse des algorithmes.
- **FibonacciClock** : Affichage du temps avec la séquence.
- **FibonacciSearchVisualizer** : Visualisation des algorithmes de recherche.
- **FibonacciCodingExplorer** : Tutoriels et concepts interactifs.
- **FibonacciTrader** : Simulation de trading.

## Contraintes techniques

- L'application doit être responsive et accessible sur desktop, tablette et mobile.
- Les performances doivent être optimisées, en particulier pour les visualisations 3D et la génération en temps réel.
- Les calculs Fibonacci doivent utiliser la mémoïsation pour éviter les calculs redondants.
- La synthèse audio doit être fluide et ne pas créer de crackles ou artefacts.
- Les fractales doivent être générées rapidement (< 2 secondes pour la plupart des cas).
- Le code doit être modulaire et facile à maintenir.
- L'accessibilité (WCAG) doit être respectée autant que possible.

## Livrables attendus

- Une application web fonctionnelle avec toutes les fonctionnalités décrites.
- Un code source bien documenté et organisé par domaine (algorithmes, visualisations, audio).
- Un fichier `README.md` détaillant le projet, son installation et son utilisation.
- Documentation technique pour les développeurs.
- Documentation utilisateur pour expliquer les principales fonctionnalités.
- Exemples et tutoriels interactifs dans l'application.

## Estimation de charge (temps)

- Analyse et conception : 15 heures
- Développement des fonctionnalités principales : 50 heures
- Développement des visualisations 3D : 20 heures
- Développement de la synthèse audio : 15 heures
- Tests et débogage : 10 heures
- Documentation et tutoriels : 10 heures
- **Total estimé : 105 heures**

## Organisation / étapes / jalons

### Phase 1 : Analyse et conception (2-3 jours)
- Définir les besoins fonctionnels et techniques.
- Concevoir l'architecture de l'application.
- Créer des maquettes des interfaces principales.

### Phase 2 : Développement fondations (1 semaine)
- Implémenter la logique de calcul Fibonacci (algorithmes).
- Créer les composants de navigation et layout.
- Implémenter le visualiseur de séquence basique.

### Phase 3 : Développement visualisations (1-2 semaines)
- Implémenter les spirales 2D et 3D.
- Développer le générateur de fractales.
- Intégrer les graphiques interactifs.

### Phase 4 : Développement audio et interactions avancées (1 semaine)
- Implémenter la synthèse audio et le générateur de musique.
- Développer la horloge de Fibonacci.
- Créer des tutoriels et exemples interactifs.

### Phase 5 : Développement du visualiseur de recherche et trader (1 semaine)
- Tester toutes les fonctionnalités.
- Optimiser les performances.
- Écrire la documentation complète.

## État du projet

### ✅ Composants créés :
- Navigation
- Header
- SequenceViewer
- Spiral2D
- Spiral3D
- FibonacciFractalGenerator
- MusicGenerator
- AlgorithmViewer
- FibonacciClock
- FibonacciSearchVisualizer
- FibonacciCodingExplorer
- FibonacciTrader

### ✅ Utilitaires créés :
- fibonacci.js
- fibonacciAlgorithms.js
- fibonacciMusic.js

### ⏳ À compléter :
- Implémenter complètement chaque composant avec sa logique.
- Optimiser les visualisations 3D.
- Polir l'interface utilisateur.
- Ajouter des tutoriels interactifs.

## Notes supplémentaires

- L'application est pensée comme un espace d'apprentissage et d'exploration.
- Chaque composant doit pouvoir fonctionner indépendamment tout en s'intégrant dans l'écosystème global.
- L'accent est mis sur l'interactivité et la visualisation intuitive.
- La documentation doit être claire pour permettre à d'autres développeurs de contribuer.
