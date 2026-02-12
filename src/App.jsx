import React, { useState, Suspense, lazy } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import Navigation from './components/Navigation'
import SequenceViewer from './components/SequenceViewer'
import Spiral2D from './components/Spiral2D'
import AlgorithmViewer from './components/AlgorithmViewer'
import FibonacciDetector from './components/FibonacciDetector'
import FibonacciSearchVisualizer from './components/FibonacciSearchVisualizer'
import FibonacciClock from './components/FibonacciClock'
import './App.css'

// Lazy load heavy components
const Spiral3D = lazy(() => import('./components/Spiral3D'))
const MusicGenerator = lazy(() => import('./components/MusicGenerator'))
const FibonacciComposer = lazy(() => import('./components/FibonacciComposer'))
const FibonacciCodingExplorer = lazy(() => import('./components/FibonacciCodingExplorer'))
const FibonacciFractalGenerator = lazy(() => import('./components/FibonacciFractalGenerator'))
const FibonacciTrader = lazy(() => import('./components/FibonacciTrader'))
const FibonacciEmergenceSimulator = lazy(() => import('./components/FibonacciEmergenceSimulator'))

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64 text-white/60">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      className="w-8 h-8 border-2 border-fibonacci-gold border-t-transparent rounded-full"
    />
    <span className="ml-3">Chargement...</span>
  </div>
)

const App = () => {
  const [activeTab, setActiveTab] = useState('sequence')
  const [fibonacciCount, setFibonacciCount] = useState(20)

  const tabs = [
    { id: 'sequence', label: 'Séquence', icon: '🔢' },
    { id: 'spiral2d', label: 'Spirale 2D', icon: '🌀' },
    { id: 'spiral3d', label: 'Spirale 3D', icon: '🌌' },
    { id: 'music', label: 'Musique', icon: '🎵' },
    { id: 'algorithms', label: 'Algorithmes', icon: '⚙️' },
    { id: 'detector', label: 'Détecteur IA', icon: '🧬' },
    { id: 'search', label: 'Recherche', icon: '🔍' },
    { id: 'composer', label: 'Compositeur', icon: '🎼' },
    { id: 'coding', label: 'Compression', icon: '🔐' },
    { id: 'fractals', label: 'Fractales', icon: '🌀' },
    { id: 'clock', label: 'Horloge', icon: '⏰' },
    { id: 'trader', label: 'Trading', icon: '📈' },
    { id: 'emergence', label: 'Émergence', icon: '🌌' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Controls */}
        <div className="fibonacci-card p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-white/80 mb-2">
                Nombre de termes Fibonacci
              </label>
              <input
                type="range"
                min="5"
                max="100"
                value={fibonacciCount}
                onChange={(e) => setFibonacciCount(parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="text-center mt-2">
                <span className="number-display">{fibonacciCount}</span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-white/60 text-sm">
                Ratio d'or: <span className="number-display">1.618</span>
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <Navigation tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content */}
        <main className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Suspense fallback={<LoadingSpinner />}>
                {activeTab === 'sequence' && (
                  <SequenceViewer count={fibonacciCount} />
                )}

                {activeTab === 'spiral2d' && (
                  <Spiral2D count={fibonacciCount} />
                )}

                {activeTab === 'spiral3d' && (
                  <Spiral3D count={fibonacciCount} />
                )}

                {activeTab === 'music' && (
                  <MusicGenerator count={fibonacciCount} />
                )}

                {activeTab === 'algorithms' && (
                  <AlgorithmViewer count={fibonacciCount} />
                )}

                {activeTab === 'detector' && (
                  <FibonacciDetector />
                )}

                {activeTab === 'search' && (
                  <FibonacciSearchVisualizer />
                )}

                {activeTab === 'composer' && (
                  <FibonacciComposer />
                )}

                {activeTab === 'coding' && (
                  <FibonacciCodingExplorer />
                )}

                {activeTab === 'fractals' && (
                  <FibonacciFractalGenerator />
                )}

                {activeTab === 'clock' && (
                  <FibonacciClock />
                )}

                {activeTab === 'trader' && (
                  <FibonacciTrader />
                )}

                {activeTab === 'emergence' && (
                  <FibonacciEmergenceSimulator />
                )}
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

export default App
