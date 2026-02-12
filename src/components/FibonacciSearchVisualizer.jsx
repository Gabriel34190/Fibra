import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FibonacciSearchVisualizer = () => {
  const [isRunning, setIsRunning] = useState(false)
  const [searchType, setSearchType] = useState('fibonacci')
  const [target, setTarget] = useState(42)
  const [arraySize, setArraySize] = useState(50)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState([])
  const [comparisons, setComparisons] = useState({ binary: 0, fibonacci: 0 })
  const [found, setFound] = useState(false)
  const canvasRef = useRef(null)

  // Générer la suite de Fibonacci
  const generateFibonacci = (n) => {
    const fib = [0, 1]
    for (let i = 2; i <= n; i++) {
      fib[i] = fib[i - 1] + fib[i - 2]
    }
    return fib
  }

  // Recherche binaire classique
  const binarySearch = (arr, target) => {
    let left = 0
    let right = arr.length - 1
    let steps = []
    let comparisons = 0

    while (left <= right) {
      const mid = Math.floor((left + right) / 2)
      comparisons++
      
      steps.push({
        type: 'binary',
        left,
        right,
        mid,
        target,
        comparisons,
        step: steps.length
      })

      if (arr[mid] === target) {
        return { found: true, steps, comparisons, index: mid }
      } else if (arr[mid] < target) {
        left = mid + 1
      } else {
        right = mid - 1
      }
    }

    return { found: false, steps, comparisons }
  }

  // Recherche Fibonacci
  const fibonacciSearch = (arr, target) => {
    const n = arr.length
    const fib = generateFibonacci(20) // Générer assez de nombres Fibonacci
    
    // Trouver le plus petit nombre Fibonacci >= n
    let fibM = 0
    while (fib[fibM] < n) {
      fibM++
    }

    let offset = -1
    let steps = []
    let comparisons = 0

    while (fibM > 1) {
      const i = Math.min(offset + fib[fibM - 2], n - 1)
      comparisons++
      
      steps.push({
        type: 'fibonacci',
        left: offset + 1,
        right: Math.min(offset + fib[fibM - 1], n - 1),
        mid: i,
        target,
        comparisons,
        step: steps.length,
        fibM,
        fibValue: fib[fibM - 1]
      })

      if (arr[i] < target) {
        fibM = fibM - 1
        offset = i
      } else if (arr[i] > target) {
        fibM = fibM - 2
      } else {
        return { found: true, steps, comparisons, index: i }
      }
    }

    if (fibM === 1 && arr[offset + 1] === target) {
      comparisons++
      steps.push({
        type: 'fibonacci',
        left: offset + 1,
        right: offset + 1,
        mid: offset + 1,
        target,
        comparisons,
        step: steps.length,
        fibM: 1,
        fibValue: 1
      })
      return { found: true, steps, comparisons, index: offset + 1 }
    }

    return { found: false, steps, comparisons }
  }

  // Générer un tableau trié
  const generateArray = (size) => {
    const arr = []
    for (let i = 0; i < size; i++) {
      arr.push(i * 2 + 1) // Nombres impairs pour éviter les doublons
    }
    return arr
  }

  // Exécuter la recherche
  const runSearch = async () => {
    setIsRunning(true)
    setCurrentStep(0)
    setFound(false)
    
    const arr = generateArray(arraySize)
    const binaryResult = binarySearch(arr, target)
    const fibonacciResult = fibonacciSearch(arr, target)
    
    setComparisons({
      binary: binaryResult.comparisons,
      fibonacci: fibonacciResult.comparisons
    })

    const selectedSteps = searchType === 'binary' ? binaryResult.steps : fibonacciResult.steps
    setSteps(selectedSteps)
    setFound(searchType === 'binary' ? binaryResult.found : fibonacciResult.found)

    // Animer les étapes
    for (let i = 0; i < selectedSteps.length; i++) {
      setCurrentStep(i)
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    setIsRunning(false)
  }

  // Dessiner le tableau sur le canvas
  const drawArray = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const arr = generateArray(arraySize)
    
    canvas.width = canvas.offsetWidth
    canvas.height = 200
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    const barWidth = canvas.width / arr.length
    const maxValue = Math.max(...arr)
    
    arr.forEach((value, index) => {
      const barHeight = (value / maxValue) * (canvas.height - 40)
      const x = index * barWidth
      const y = canvas.height - barHeight - 20
      
      // Couleur de base
      ctx.fillStyle = '#374151'
      ctx.fillRect(x, barWidth * 0.1, barWidth * 0.8, barHeight)
      
      // Mettre en évidence la valeur cible
      if (value === target) {
        ctx.fillStyle = '#fbbf24'
        ctx.fillRect(x, barWidth * 0.1, barWidth * 0.8, barHeight)
      }
      
      // Dessiner la valeur
      ctx.fillStyle = '#ffffff'
      ctx.font = '10px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(value.toString(), x + barWidth / 2, canvas.height - 5)
    })
  }

  // Dessiner les zones de recherche
  const drawSearchZones = () => {
    if (currentStep >= steps.length) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    const step = steps[currentStep]
    const arr = generateArray(arraySize)
    const barWidth = canvas.width / arr.length
    
    // Dessiner la zone de recherche
    const leftX = step.left * barWidth
    const rightX = (step.right + 1) * barWidth
    const zoneHeight = canvas.height - 20
    
    ctx.strokeStyle = searchType === 'binary' ? '#3b82f6' : '#f59e0b'
    ctx.lineWidth = 3
    ctx.setLineDash([5, 5])
    ctx.strokeRect(leftX, 10, rightX - leftX, zoneHeight)
    ctx.setLineDash([])
    
    // Dessiner le point médian
    const midX = step.mid * barWidth + barWidth / 2
    ctx.fillStyle = searchType === 'binary' ? '#3b82f6' : '#f59e0b'
    ctx.beginPath()
    ctx.arc(midX, 30, 8, 0, 2 * Math.PI)
    ctx.fill()
    
    // Ajouter des labels
    ctx.fillStyle = '#ffffff'
    ctx.font = '12px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(`Étape ${step.step}`, canvas.width / 2, 25)
    ctx.fillText(`Comparaisons: ${step.comparisons}`, canvas.width / 2, 40)
  }

  // Effets
  useEffect(() => {
    drawArray()
  }, [arraySize, target])

  useEffect(() => {
    if (steps.length > 0) {
      drawArray()
      drawSearchZones()
    }
  }, [currentStep, steps])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          ⚙️ Fibonacci Search Visualizer
        </h2>
        <p className="text-white/70 text-lg max-w-3xl mx-auto">
          Découvrez pourquoi la recherche Fibonacci est plus efficace que la recherche binaire 
          classique. La suite de Fibonacci optimise naturellement les intervalles de recherche !
        </p>
      </div>

      {/* Controls */}
      <div className="fibonacci-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Type de recherche */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Type de recherche
            </label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
              disabled={isRunning}
            >
              <option value="fibonacci">🔍 Recherche Fibonacci</option>
              <option value="binary">🔍 Recherche Binaire</option>
            </select>
          </div>

          {/* Valeur cible */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Valeur à chercher
            </label>
            <input
              type="number"
              value={target}
              onChange={(e) => setTarget(parseInt(e.target.value))}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
              disabled={isRunning}
              min="1"
              max="99"
            />
          </div>

          {/* Taille du tableau */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Taille du tableau
            </label>
            <input
              type="range"
              min="10"
              max="100"
              value={arraySize}
              onChange={(e) => setArraySize(parseInt(e.target.value))}
              className="w-full"
              disabled={isRunning}
            />
            <div className="text-center mt-2">
              <span className="number-display">{arraySize}</span>
            </div>
          </div>

          {/* Bouton de lancement */}
          <div className="flex items-end">
            <motion.button
              onClick={runSearch}
              disabled={isRunning}
              className="w-full bg-fibonacci-gold text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50"
              whileHover={{ scale: isRunning ? 1 : 1.05 }}
              whileTap={{ scale: isRunning ? 1 : 0.95 }}
            >
              {isRunning ? '⏳ Recherche...' : '🚀 Lancer la recherche'}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Visualisation */}
      <div className="fibonacci-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          📊 Visualisation de la recherche
        </h3>
        
        <div className="space-y-6">
          {/* Canvas */}
          <div className="bg-black/20 p-4 rounded-lg">
            <canvas
              ref={canvasRef}
              className="w-full h-48 border border-white/20 rounded"
            />
          </div>

          {/* Légende */}
          <div className="flex justify-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-400 rounded"></div>
              <span className="text-white/80">Valeur cible</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-white/80">Zone de recherche (Binaire)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span className="text-white/80">Zone de recherche (Fibonacci)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Résultats */}
      <AnimatePresence>
        {steps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fibonacci-card p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4">
              📈 Résultats de l'analyse
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Comparaison des performances */}
              <div className="bg-white/5 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-fibonacci-gold mb-3">
                  ⚡ Comparaison des performances
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Recherche Binaire:</span>
                    <span className="text-blue-400 font-semibold">{comparisons.binary} comparaisons</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Recherche Fibonacci:</span>
                    <span className="text-orange-400 font-semibold">{comparisons.fibonacci} comparaisons</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Efficacité:</span>
                    <span className={`font-semibold ${
                      comparisons.fibonacci < comparisons.binary ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {comparisons.fibonacci < comparisons.binary ? 'Fibonacci plus efficace' : 'Binaire plus efficace'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Complexité théorique */}
              <div className="bg-white/5 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-fibonacci-gold mb-3">
                  🧮 Complexité théorique
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="text-white/80">
                    <strong>Recherche Binaire:</strong> O(log₂ n)
                  </div>
                  <div className="text-white/80">
                    <strong>Recherche Fibonacci:</strong> O(logφ n) où φ = 1.618...
                  </div>
                  <div className="text-white/60 text-xs mt-2">
                    φ étant le nombre d'or, la recherche Fibonacci est théoriquement 
                    plus efficace pour de très grands tableaux.
                  </div>
                </div>
              </div>
            </div>

            {/* Résultat de la recherche */}
            <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-green-500/20 to-blue-500/20">
              <div className="text-center">
                <div className="text-2xl mb-2">
                  {found ? '✅ Trouvé !' : '❌ Non trouvé'}
                </div>
                <div className="text-white/80">
                  {found 
                    ? `La valeur ${target} a été trouvée en ${steps.length} étapes`
                    : `La valeur ${target} n'existe pas dans le tableau`
                  }
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explication technique */}
      <div className="fibonacci-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          🔬 Pourquoi Fibonacci est-il plus efficace ?
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-fibonacci-gold mb-2">
              📐 Optimisation des intervalles
            </h4>
            <p className="text-white/80 text-sm mb-4">
              La recherche Fibonacci divise l'intervalle selon les proportions dorées, 
              créant des divisions plus naturelles et équilibrées que la division binaire classique.
            </p>
            
            <h4 className="text-lg font-semibold text-fibonacci-gold mb-2">
              ⚖️ Équilibre optimal
            </h4>
            <p className="text-white/80 text-sm">
              Le ratio d'or (φ ≈ 1.618) minimise le nombre moyen de comparaisons 
              nécessaires, surtout pour les grandes structures de données.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-fibonacci-gold mb-2">
              🎯 Applications pratiques
            </h4>
            <ul className="text-white/80 text-sm space-y-1">
              <li>• Optimisation de fonctions unimodales</li>
              <li>• Recherche dans des structures triées</li>
              <li>• Algorithmes de minimisation</li>
              <li>• Optimisation de requêtes de base de données</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-fibonacci-gold mb-2 mt-4">
              🧠 Avantage cognitif
            </h4>
            <p className="text-white/80 text-sm">
              Les proportions dorées sont plus "naturelles" pour notre perception, 
              rendant l'algorithme plus intuitif à comprendre et déboguer.
            </p>
          </div>
        </div>
      </div>

      {/* Animation des étapes */}
      <AnimatePresence>
        {isRunning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fibonacci-card p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4">
              🔄 Étape {currentStep + 1} sur {steps.length}
            </h3>
            
            {currentStep < steps.length && (
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-white/60">Gauche:</span>
                    <div className="text-white font-semibold">{steps[currentStep]?.left}</div>
                  </div>
                  <div>
                    <span className="text-white/60">Droite:</span>
                    <div className="text-white font-semibold">{steps[currentStep]?.right}</div>
                  </div>
                  <div>
                    <span className="text-white/60">Milieu:</span>
                    <div className="text-white font-semibold">{steps[currentStep]?.mid}</div>
                  </div>
                  <div>
                    <span className="text-white/60">Comparaisons:</span>
                    <div className="text-white font-semibold">{steps[currentStep]?.comparisons}</div>
                  </div>
                </div>
                
                {searchType === 'fibonacci' && (
                  <div className="mt-4 text-sm">
                    <span className="text-white/60">Nombre Fibonacci utilisé:</span>
                    <div className="text-orange-400 font-semibold">{steps[currentStep]?.fibValue}</div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FibonacciSearchVisualizer
