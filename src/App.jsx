import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import Navigation from './components/Navigation'
import SequenceViewer from './components/SequenceViewer'
import Spiral2D from './components/Spiral2D'
import Spiral3D from './components/Spiral3D'
import MusicGenerator from './components/MusicGenerator'
import AlgorithmViewer from './components/AlgorithmViewer'
import FibonacciDetector from './components/FibonacciDetector'
import FibonacciSearchVisualizer from './components/FibonacciSearchVisualizer'
import FibonacciComposer from './components/FibonacciComposer'
import FibonacciCodingExplorer from './components/FibonacciCodingExplorer'
import FibonacciFractalGenerator from './components/FibonacciFractalGenerator'
import FibonacciClock from './components/FibonacciClock'
import FibonacciTrader from './components/FibonacciTrader'
import FibonacciEmergenceSimulator from './components/FibonacciEmergenceSimulator'
import './App.css'

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
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

export default App
