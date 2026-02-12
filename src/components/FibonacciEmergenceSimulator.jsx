import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const FibonacciEmergenceSimulator = () => {
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [generation, setGeneration] = useState(0)
  const [particles, setParticles] = useState([])

  useEffect(() => {
    // Initialiser les particules
    const initialParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1
    }))
    setParticles(initialParticles)
  }, [])

  useEffect(() => {
    if (!isRunning) {
      return
    }

    const interval = setInterval(() => {
      setGeneration(prev => prev + 1)
      setParticles(prev => prev.map(p => ({
        ...p,
        x: (p.x + Math.random() * 2 - 1) % 100,
        y: (p.y + Math.random() * 2 - 1) % 100
      })))
    }, 1000 / speed)

    return () => clearInterval(interval)
  }, [isRunning, speed])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fibonacci-card p-8"
    >
      <h2 className="text-3xl font-bold text-white mb-8">Simulateur d'Émergence</h2>

      <div className="space-y-6">
        {/* Contrôles */}
        <div className="bg-white/5 p-6 rounded-lg border border-white/10 space-y-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="w-full px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition font-semibold"
          >
            {isRunning ? '⏸ Pause' : '▶ Démarrer'}
          </button>

          <div>
            <label className="block text-white/80 mb-2">Vitesse:</label>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.5"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg"
            />
            <p className="text-center text-white mt-2">{speed}x</p>
          </div>

          <button
            onClick={() => {
              setGeneration(0)
              setParticles(Array.from({ length: 20 }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 3 + 1
              })))
            }}
            className="w-full px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
          >
            Réinitialiser
          </button>
        </div>

        {/* Affichage de la simulation */}
        <div className="bg-black/30 rounded-lg overflow-hidden border border-white/10 aspect-video flex items-center justify-center">
          <div className="relative w-full h-full">
            {particles.map(particle => (
              <motion.div
                key={particle.id}
                animate={{ x: `${particle.x}%`, y: `${particle.y}%` }}
                transition={{ duration: 0.3 }}
                className="absolute w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                style={{
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  boxShadow: '0 0 10px rgba(168, 85, 247, 0.6)'
                }}
              />
            ))}
            <div className="absolute bottom-4 left-4 text-white/80">
              Générations: <span className="number-display">{generation}</span>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="bg-white/5 p-6 rounded-lg border border-white/10 grid grid-cols-2 gap-4">
          <div>
            <p className="text-white/60 text-sm">Particules</p>
            <p className="text-2xl font-bold text-white">{particles.length}</p>
          </div>
          <div>
            <p className="text-white/60 text-sm">Génération</p>
            <p className="text-2xl font-bold text-white">{generation}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default FibonacciEmergenceSimulator
