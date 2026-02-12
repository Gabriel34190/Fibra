import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FibonacciTrader = () => {
  const [priceData, setPriceData] = useState([])
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationSpeed, setSimulationSpeed] = useState(1)
  const [currentPrice, setCurrentPrice] = useState(100)
  const [fibonacciLevels, setFibonacciLevels] = useState([])
  const [trend, setTrend] = useState('bullish')
  const [timeframe, setTimeframe] = useState('1h')
  const [showRetracements, setShowRetracements] = useState(true)
  const [showExtensions, setShowExtensions] = useState(false)
  const [tradingSignals, setTradingSignals] = useState([])
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  // Niveaux de retracement Fibonacci
  const RETRACEMENT_LEVELS = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1]
  const EXTENSION_LEVELS = [1.272, 1.414, 1.618, 2, 2.618, 3.618]

  // Générer des données de prix simulées
  const generatePriceData = (length = 100) => {
    const data = []
    let price = 100
    let trend = 1

    for (let i = 0; i < length; i++) {
      // Ajouter de la volatilité et des tendances
      const volatility = (Math.random() - 0.5) * 2
      const trendChange = Math.random() < 0.1 ? (Math.random() - 0.5) * 0.5 : 0
      trend += trendChange

      price += volatility + trend * 0.1
      price = Math.max(50, Math.min(200, price)) // Limiter entre 50 et 200

      data.push({
        time: i,
        price: price,
        volume: Math.random() * 1000 + 100,
        high: price + Math.random() * 2,
        low: price - Math.random() * 2
      })
    }

    return data
  }

  // Calculer les niveaux Fibonacci
  const calculateFibonacciLevels = (data) => {
    if (data.length < 2) {
      return []
    }

    const high = Math.max(...data.map(d => d.high))
    const low = Math.min(...data.map(d => d.low))
    const range = high - low

    const levels = []

    // Retracements
    if (showRetracements) {
      RETRACEMENT_LEVELS.forEach(level => {
        const price = high - (range * level)
        levels.push({
          price: price,
          level: level,
          type: 'retracement',
          label: `${(level * 100).toFixed(1)}%`
        })
      })
    }

    // Extensions
    if (showExtensions) {
      EXTENSION_LEVELS.forEach(level => {
        const price = high + (range * (level - 1))
        levels.push({
          price: price,
          level: level,
          type: 'extension',
          label: `${(level * 100).toFixed(1)}%`
        })
      })
    }

    return levels
  }

  // Générer des signaux de trading
  const generateTradingSignals = (data, levels) => {
    const signals = []

    data.forEach((point, index) => {
      if (index < 5) {
        return
      } // Ignorer les premiers points

      levels.forEach(level => {
        const tolerance = 0.5 // Tolérance de 0.5%

        // Vérifier si le prix touche un niveau Fibonacci
        if (Math.abs(point.price - level.price) / level.price < tolerance / 100) {
          const signal = {
            time: point.time,
            price: point.price,
            level: level,
            type: level.type === 'retracement' ? 'support' : 'resistance',
            strength: calculateSignalStrength(point, data.slice(Math.max(0, index - 10), index))
          }

          signals.push(signal)
        }
      })
    })

    return signals
  }

  // Calculer la force du signal
  const calculateSignalStrength = (point, recentData) => {
    if (recentData.length < 3) {
      return 'weak'
    }

    const avgVolume = recentData.reduce((sum, d) => sum + d.volume, 0) / recentData.length
    const volumeRatio = point.volume / avgVolume

    if (volumeRatio > 1.5) {
      return 'strong'
    }
    if (volumeRatio > 1.2) {
      return 'medium'
    }
    return 'weak'
  }

  // Dessiner le graphique
  const drawChart = () => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const ctx = canvas.getContext('2d')
    const { width, height } = canvas

    ctx.clearRect(0, 0, width, height)

    if (priceData.length === 0) {
      return
    }

    // Calculer les dimensions du graphique
    const padding = 40
    const chartWidth = width - 2 * padding
    const chartHeight = height - 2 * padding

    const minPrice = Math.min(...priceData.map(d => d.low))
    const maxPrice = Math.max(...priceData.map(d => d.high))
    const priceRange = maxPrice - minPrice

    // Dessiner les niveaux Fibonacci
    fibonacciLevels.forEach(level => {
      const y = padding + chartHeight - ((level.price - minPrice) / priceRange) * chartHeight

      ctx.strokeStyle = level.type === 'retracement' ? '#fbbf24' : '#ef4444'
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
      ctx.setLineDash([])

      // Label
      ctx.fillStyle = level.type === 'retracement' ? '#fbbf24' : '#ef4444'
      ctx.font = '12px Arial'
      ctx.fillText(level.label, width - padding - 50, y - 5)
    })

    // Dessiner la ligne de prix
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 2
    ctx.beginPath()

    priceData.forEach((point, index) => {
      const x = padding + (index / (priceData.length - 1)) * chartWidth
      const y = padding + chartHeight - ((point.price - minPrice) / priceRange) * chartHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Dessiner les signaux
    tradingSignals.forEach(signal => {
      const x = padding + (signal.time / (priceData.length - 1)) * chartWidth
      const y = padding + chartHeight - ((signal.price - minPrice) / priceRange) * chartHeight

      ctx.fillStyle = signal.type === 'support' ? '#10b981' : '#ef4444'
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fill()
    })

    // Axes
    ctx.strokeStyle = '#6b7280'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // Labels des axes
    ctx.fillStyle = '#9ca3af'
    ctx.font = '12px Arial'
    ctx.textAlign = 'right'
    ctx.fillText(maxPrice.toFixed(2), padding - 10, padding + 5)
    ctx.fillText(minPrice.toFixed(2), padding - 10, height - padding + 5)
  }

  // Simulation en temps réel
  const simulateTrading = () => {
    if (!isSimulating) {
      return
    }

    // Ajouter un nouveau point de prix
    const lastPrice = priceData[priceData.length - 1]?.price || 100
    const volatility = (Math.random() - 0.5) * 4
    const trendFactor = trend === 'bullish' ? 0.1 : -0.1
    const newPrice = lastPrice + volatility + trendFactor

    const newPoint = {
      time: priceData.length,
      price: newPrice,
      volume: Math.random() * 1000 + 100,
      high: newPrice + Math.random() * 2,
      low: newPrice - Math.random() * 2
    }

    setPriceData(prev => [...prev.slice(-99), newPoint]) // Garder seulement les 100 derniers points
    setCurrentPrice(newPrice)

    // Programmer la prochaine mise à jour
    setTimeout(() => {
      simulateTrading()
    }, 1000 / simulationSpeed)
  }

  // Effets
  useEffect(() => {
    const initialData = generatePriceData(50)
    setPriceData(initialData)
  }, [])

  useEffect(() => {
    const levels = calculateFibonacciLevels(priceData)
    setFibonacciLevels(levels)

    const signals = generateTradingSignals(priceData, levels)
    setTradingSignals(signals)
  }, [priceData, showRetracements, showExtensions])

  useEffect(() => {
    drawChart()
  }, [priceData, fibonacciLevels, tradingSignals])

  useEffect(() => {
    if (isSimulating) {
      simulateTrading()
    }
  }, [isSimulating, simulationSpeed])

  // Redimensionner le canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const resizeCanvas = () => {
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
        drawChart()
      }

      resizeCanvas()
      window.addEventListener('resize', resizeCanvas)

      return () => window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          📈 Fibonacci Trader
        </h2>
        <p className="text-white/70 text-lg max-w-3xl mx-auto">
          Découvrez comment les traders utilisent les retracements et extensions Fibonacci
          pour identifier les niveaux de support et résistance dans les marchés financiers.
        </p>
      </div>

      {/* Controls */}
      <div className="fibonacci-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Simulation */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Simulation
            </label>
            <motion.button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors ${
                isSimulating
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-fibonacci-gold hover:bg-yellow-400 text-black'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSimulating ? '⏸️ Pause' : '▶️ Démarrer'}
            </motion.button>
          </div>

          {/* Vitesse */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Vitesse: {simulationSpeed}x
            </label>
            <input
              type="range"
              min="0.5"
              max="5"
              step="0.5"
              value={simulationSpeed}
              onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Tendance */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Tendance
            </label>
            <select
              value={trend}
              onChange={(e) => setTrend(e.target.value)}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="bullish">📈 Haussière</option>
              <option value="bearish">📉 Baissière</option>
              <option value="sideways">↔️ Latérale</option>
            </select>
          </div>

          {/* Timeframe */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Timeframe
            </label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="1m">1 minute</option>
              <option value="5m">5 minutes</option>
              <option value="1h">1 heure</option>
              <option value="1d">1 jour</option>
            </select>
          </div>

          {/* Niveaux */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Niveaux
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showRetracements}
                  onChange={(e) => setShowRetracements(e.target.checked)}
                  className="rounded"
                />
                <span className="text-white/80 text-sm">Retracements</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showExtensions}
                  onChange={(e) => setShowExtensions(e.target.checked)}
                  className="rounded"
                />
                <span className="text-white/80 text-sm">Extensions</span>
              </label>
            </div>
          </div>

          {/* Prix actuel */}
          <div className="flex items-end">
            <div className="w-full text-center">
              <div className="text-sm text-white/60">Prix actuel</div>
              <div className="text-2xl font-bold text-fibonacci-gold">
                ${currentPrice.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Graphique */}
      <div className="fibonacci-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          📊 Graphique de prix avec niveaux Fibonacci
        </h3>

        <div className="bg-black/20 p-4 rounded-lg">
          <canvas
            ref={canvasRef}
            className="w-full h-96 border border-white/20 rounded"
          />
        </div>

        {/* Légende */}
        <div className="mt-4 flex justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-white/80 text-sm">Prix</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <span className="text-white/80 text-sm">Retracements</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-white/80 text-sm">Extensions</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-white/80 text-sm">Support</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-white/80 text-sm">Résistance</span>
          </div>
        </div>
      </div>

      {/* Signaux de trading */}
      <div className="fibonacci-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          🎯 Signaux de trading détectés
        </h3>

        <div className="space-y-4">
          {tradingSignals.slice(-10).map((signal, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border-l-4 ${
                signal.type === 'support'
                  ? 'bg-green-500/10 border-green-500'
                  : 'bg-red-500/10 border-red-500'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className={`font-semibold ${
                    signal.type === 'support' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {signal.type === 'support' ? '🟢 Support' : '🔴 Résistance'}
                  </div>
                  <div className="text-white/80 text-sm">
                    Niveau: {signal.level.label} - Prix: ${signal.price.toFixed(2)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">
                    Force: {signal.strength}
                  </div>
                  <div className="text-white/60 text-sm">
                    Temps: {signal.time}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {tradingSignals.length === 0 && (
            <div className="text-center text-white/60 py-8">
              Aucun signal détecté pour le moment...
            </div>
          )}
        </div>
      </div>

      {/* Statistiques */}
      <div className="fibonacci-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          📊 Statistiques de trading
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/5 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-fibonacci-gold mb-2">
              📈 Signaux totaux
            </h4>
            <div className="text-2xl font-bold text-white">
              {tradingSignals.length}
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-fibonacci-gold mb-2">
              🟢 Supports
            </h4>
            <div className="text-2xl font-bold text-green-400">
              {tradingSignals.filter(s => s.type === 'support').length}
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-fibonacci-gold mb-2">
              🔴 Résistances
            </h4>
            <div className="text-2xl font-bold text-red-400">
              {tradingSignals.filter(s => s.type === 'resistance').length}
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-fibonacci-gold mb-2">
              ⚡ Signaux forts
            </h4>
            <div className="text-2xl font-bold text-orange-400">
              {tradingSignals.filter(s => s.strength === 'strong').length}
            </div>
          </div>
        </div>
      </div>

      {/* Théorie des retracements Fibonacci */}
      <div className="fibonacci-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          🧮 Théorie des retracements Fibonacci
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-fibonacci-gold mb-2">
              📐 Niveaux de retracement
            </h4>
            <ul className="text-white/80 text-sm space-y-1">
              <li>• <strong>23.6%</strong> : Retracement faible</li>
              <li>• <strong>38.2%</strong> : Retracement modéré</li>
              <li>• <strong>50%</strong> : Niveau psychologique</li>
              <li>• <strong>61.8%</strong> : Retracement doré (le plus important)</li>
              <li>• <strong>78.6%</strong> : Retracement profond</li>
            </ul>

            <h4 className="text-lg font-semibold text-fibonacci-gold mb-2 mt-4">
              🎯 Applications pratiques
            </h4>
            <ul className="text-white/80 text-sm space-y-1">
              <li>• Identifier les niveaux de support/résistance</li>
              <li>• Déterminer les points d'entrée/sortie</li>
              <li>• Calculer les objectifs de prix</li>
              <li>• Gérer le risque</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-fibonacci-gold mb-2">
              ⚠️ Limitations
            </h4>
            <ul className="text-white/80 text-sm space-y-1">
              <li>• Pas toujours fiables à 100%</li>
              <li>• Nécessitent confirmation d'autres indicateurs</li>
              <li>• Peuvent être invalidés par des nouvelles fondamentales</li>
              <li>• Fonctionnent mieux sur les marchés en tendance</li>
            </ul>

            <h4 className="text-lg font-semibold text-fibonacci-gold mb-2 mt-4">
              💡 Conseils d'utilisation
            </h4>
            <ul className="text-white/80 text-sm space-y-1">
              <li>• Combiner avec l'analyse technique</li>
              <li>• Utiliser plusieurs timeframes</li>
              <li>• Attendre la confirmation des prix</li>
              <li>• Respecter la gestion du risque</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Exemples de stratégies */}
      <div className="fibonacci-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          🎯 Stratégies de trading Fibonacci
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              name: 'Retracement classique',
              description: 'Acheter sur retracement 61.8%, vendre sur résistance',
              success: '75%',
              risk: 'Moyen'
            },
            {
              name: 'Extension 161.8%',
              description: 'Objectif de prix basé sur extension Fibonacci',
              success: '68%',
              risk: 'Élevé'
            },
            {
              name: 'Multi-timeframe',
              description: 'Confirmer sur plusieurs timeframes',
              success: '82%',
              risk: 'Faible'
            }
          ].map((strategy, index) => (
            <motion.div
              key={index}
              className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <div className="font-semibold text-white mb-2">{strategy.name}</div>
              <div className="text-white/60 text-sm mb-3">{strategy.description}</div>
              <div className="flex justify-between text-sm">
                <span className="text-green-400">Succès: {strategy.success}</span>
                <span className="text-orange-400">Risque: {strategy.risk}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Avertissement */}
      <div className="fibonacci-card p-6 bg-red-500/10 border border-red-500/20">
        <h3 className="text-xl font-semibold text-red-400 mb-4">
          ⚠️ Avertissement important
        </h3>
        <p className="text-white/80 text-sm">
          Cette simulation est uniquement à des fins éducatives. Le trading réel comporte des risques
          financiers importants. Les niveaux Fibonacci ne garantissent pas le succès et doivent être
          utilisés en combinaison avec d'autres analyses techniques et fondamentales.
        </p>
      </div>
    </div>
  )
}

export default FibonacciTrader
