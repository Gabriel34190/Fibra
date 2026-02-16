import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  fibonacciSearch,
  goldenSectionSearch,
  FibonacciHeap
} from '../utils/fibonacciAlgorithms.js'

const COMPLEXITY = {
  search: { time: 'O(log n)', space: 'O(1)', desc: 'n = nombre d\'itérations pour atteindre la précision' },
  golden: { time: 'O(log n)', space: 'O(1)', desc: 'Convergence par réduction d\'intervalle avec φ' },
  heap: { time: 'Insert O(1) amorti, ExtractMin O(log n) amorti', space: 'O(n)', desc: 'n = nombre de nœuds dans le tas' }
}

const AlgorithmViewer = ({ count }) => {
  const [activeAlgorithm, setActiveAlgorithm] = useState('search')
  const [functionType, setFunctionType] = useState('quadratic')
  const [searchResult, setSearchResult] = useState(null)
  const [heapOperations, setHeapOperations] = useState([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [benchmarkResult, setBenchmarkResult] = useState(null)
  const [benchmarking, setBenchmarking] = useState(false)

  // Test functions for optimization
  const testFunctions = {
    quadratic: (x) => Math.pow(x - 3, 2) + 2,
    sine: (x) => Math.sin(x) + 0.5 * x,
    exponential: (x) => Math.exp(-Math.pow(x - 2, 2)) - 0.5 * x,
    polynomial: (x) => Math.pow(x, 4) - 8 * Math.pow(x, 3) + 18 * Math.pow(x, 2) - 27 * x + 20
  }

  const algorithms = [
    { id: 'search', name: 'Fibonacci Search', icon: '🔍' },
    { id: 'golden', name: 'Golden Section', icon: '⚖️' },
    { id: 'heap', name: 'Fibonacci Heap', icon: '📊' }
  ]

  // Run Fibonacci Search
  const runFibonacciSearch = () => {
    setIsAnimating(true)

    setTimeout(() => {
      const func = testFunctions[functionType]
      const result = fibonacciSearch(func, -10, 10, 1e-6, 50)
      setSearchResult(result)
      setIsAnimating(false)
    }, 1000)
  }

  // Run Golden Section Search
  const runGoldenSectionSearch = () => {
    setIsAnimating(true)

    setTimeout(() => {
      const func = testFunctions[functionType]
      const result = goldenSectionSearch(func, -10, 10, 1e-6, 50)
      setSearchResult(result)
      setIsAnimating(false)
    }, 1000)
  }

  // Demonstrate Fibonacci Heap
  const demonstrateHeap = () => {
    setIsAnimating(true)
    setHeapOperations([])

    setTimeout(() => {
      const heap = new FibonacciHeap()
      const operations = []

      // Insert Fibonacci numbers
      const sequence = []
      let a = 0, b = 1
      for (let i = 0; i < Math.min(count, 10); i++) {
        const value = a + b
        heap.insert(value, `Node-${value}`)
        sequence.push(value)
        a = b
        b = value
        if (i === 0) {
          a = 1
        }
      }

      // Extract minimum a few times
      for (let i = 0; i < Math.min(3, Math.floor(count / 3)); i++) {
        heap.extractMin()
      }

      setHeapOperations(heap.getOperations())
      setIsAnimating(false)
    }, 1500)
  }

  const runAlgorithm = () => {
    setStepIndex(0)
    setBenchmarkResult(null)
    switch (activeAlgorithm) {
    case 'search':
      runFibonacciSearch()
      break
    case 'golden':
      runGoldenSectionSearch()
      break
    case 'heap':
      demonstrateHeap()
      break
    }
  }

  const runBenchmark = () => {
    setBenchmarking(true)
    setBenchmarkResult(null)
    const runs = 100
    const func = testFunctions[functionType]
    setTimeout(() => {
      const t0 = performance.now()
      for (let i = 0; i < runs; i++) {
        fibonacciSearch(func, -10, 10, 1e-6, 50)
      }
      const tFib = performance.now() - t0

      const t1 = performance.now()
      for (let i = 0; i < runs; i++) {
        goldenSectionSearch(func, -10, 10, 1e-6, 50)
      }
      const tGolden = performance.now() - t1

      setBenchmarkResult({
        fibonacciSearch: { totalMs: tFib, perRunMs: tFib / runs, runs },
        goldenSectionSearch: { totalMs: tGolden, perRunMs: tGolden / runs, runs }
      })
      setBenchmarking(false)
    }, 50)
  }

  const details = searchResult?.details ?? []
  const canStep = details.length > 0
  const currentStep = details[stepIndex]

  // Visualization data for the test function
  const functionData = useMemo(() => {
    const data = []
    for (let x = -10; x <= 10; x += 0.2) {
      data.push({
        x: x,
        y: testFunctions[functionType](x)
      })
    }
    return data
  }, [functionType])

  return (
    <div className="space-y-6">
      {/* Algorithm Selection */}
      <div className="fibonacci-card p-6">
        <h2 className="section-title mb-6">Algorithmes d'Optimisation</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Type d'algorithme</h3>
            <div className="flex flex-wrap gap-2">
              {algorithms.map(algo => (
                <button
                  key={algo.id}
                  onClick={() => setActiveAlgorithm(algo.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeAlgorithm === algo.id
                      ? 'bg-fibonacci-gold text-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <span className="mr-2">{algo.icon}</span>
                  {algo.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Fonction de test</h3>
            <select
              value={functionType}
              onChange={(e) => setFunctionType(e.target.value)}
              className="fibonacci-input w-full"
              disabled={activeAlgorithm === 'heap'}
            >
              <option value="quadratic">f(x) = (x-3)² + 2</option>
              <option value="sine">f(x) = sin(x) + 0.5x</option>
              <option value="exponential">f(x) = exp(-(x-2)²) - 0.5x</option>
              <option value="polynomial">f(x) = x⁴ - 8x³ + 18x² - 27x + 20</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-4">
          <motion.button
            onClick={runAlgorithm}
            disabled={isAnimating}
            className={`fibonacci-button ${isAnimating ? 'opacity-50 cursor-not-allowed' : ''}`}
            whileHover={{ scale: isAnimating ? 1 : 1.05 }}
            whileTap={{ scale: isAnimating ? 1 : 0.95 }}
          >
            {isAnimating ? (
              <> <span className="mr-2">⏳</span> Calcul en cours... </>
            ) : (
              <> <span className="mr-2">▶️</span> Exécuter l&apos;algorithme </>
            )}
          </motion.button>
          {(activeAlgorithm === 'search' || activeAlgorithm === 'golden') && (
            <motion.button
              onClick={runBenchmark}
              disabled={benchmarking}
              className="px-4 py-2 rounded-lg font-medium bg-white/10 text-white border border-white/20 hover:bg-white/20 disabled:opacity-50"
              whileHover={{ scale: benchmarking ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {benchmarking ? '⏳ Benchmark...' : '📊 Benchmark performance'}
            </motion.button>
          )}
        </div>
      </div>

      {/* Analyse de complexité (temps, espace) */}
      <div className="fibonacci-card p-6">
        <h3 className="text-xl font-semibold text-fibonacci-gold mb-4">Analyse de la complexité</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="text-fibonacci-gold font-mono text-lg mb-1">Temps</div>
            <div className="text-white/90">{COMPLEXITY[activeAlgorithm].time}</div>
          </div>
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="text-blue-400 font-mono text-lg mb-1">Espace</div>
            <div className="text-white/90">{COMPLEXITY[activeAlgorithm].space}</div>
          </div>
          <div className="p-4 bg-white/5 rounded-lg md:col-span-1">
            <div className="text-white/70 text-sm">{COMPLEXITY[activeAlgorithm].desc}</div>
          </div>
        </div>
      </div>

      {/* Benchmark performance */}
      {benchmarkResult && (
        <div className="fibonacci-card p-6">
          <h3 className="text-xl font-semibold text-fibonacci-gold mb-4">Résultat du benchmark</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
              <div className="font-semibold text-green-400 mb-2">Fibonacci Search</div>
              <div className="text-white/90 text-sm">
                {benchmarkResult.fibonacciSearch.runs} runs : {benchmarkResult.fibonacciSearch.totalMs.toFixed(2)} ms total
                ({benchmarkResult.fibonacciSearch.perRunMs.toFixed(4)} ms / run)
              </div>
            </div>
            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
              <div className="font-semibold text-blue-400 mb-2">Golden Section Search</div>
              <div className="text-white/90 text-sm">
                {benchmarkResult.goldenSectionSearch.runs} runs : {benchmarkResult.goldenSectionSearch.totalMs.toFixed(2)} ms total
                ({benchmarkResult.goldenSectionSearch.perRunMs.toFixed(4)} ms / run)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {(searchResult || heapOperations.length > 0) && (
        <div className="fibonacci-card p-6">
          <h3 className="text-xl font-semibold text-fibonacci-gold mb-6">
            Résultats de l'algorithme
          </h3>

          {activeAlgorithm !== 'heap' && searchResult && (
            <div className="space-y-6">
              {/* Optimization Results */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-green-500/20 to-transparent rounded-lg">
                  <div className="text-2xl font-bold text-green-400">
                    {searchResult.optimal.toFixed(4)}
                  </div>
                  <div className="text-white/80 text-sm">Point optimal</div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-blue-500/20 to-transparent rounded-lg">
                  <div className="text-2xl font-bold text-blue-400">
                    {searchResult.value.toFixed(4)}
                  </div>
                  <div className="text-white/80 text-sm">Valeur minimale</div>
                </div>

                <div className="text-center p-4 bg-gradient-to-br from-purple-500/20 to-transparent rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">
                    {searchResult.iterations}
                  </div>
                  <div className="text-white/80 text-sm">Itérations</div>
                </div>
              </div>

              {/* Iteration Details - Pas à pas */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">
                  Affichage pas à pas de l&apos;exécution
                </h4>
                {canStep && (
                  <div className="flex items-center gap-4 mb-4">
                    <button
                      type="button"
                      onClick={() => setStepIndex(Math.max(0, stepIndex - 1))}
                      disabled={stepIndex === 0}
                      className="px-3 py-1 rounded bg-white/10 text-white disabled:opacity-40 text-sm"
                    >
                      ← Précédent
                    </button>
                    <span className="text-white/80 text-sm">
                      Étape {stepIndex + 1} / {details.length}
                    </span>
                    <button
                      type="button"
                      onClick={() => setStepIndex(Math.min(details.length - 1, stepIndex + 1))}
                      disabled={stepIndex >= details.length - 1}
                      className="px-3 py-1 rounded bg-white/10 text-white disabled:opacity-40 text-sm"
                    >
                      Suivant →
                    </button>
                  </div>
                )}
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {canStep
                    ? details.map((step, index) => (
                        <motion.div
                          key={index}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            index === stepIndex ? 'bg-fibonacci-gold/20 border border-fibonacci-gold/50' : 'bg-white/5'
                          }`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-fibonacci-gold font-mono text-sm w-8">
                              {step.iteration}
                            </span>
                            <div className="text-white text-sm">
                              Range: [{step.a.toFixed(3)}, {step.b.toFixed(3)}]
                            </div>
                          </div>
                          <div className="text-white/60 text-sm">
                            Précision: {(step.range).toFixed(6)}
                          </div>
                        </motion.div>
                      ))
                    : searchResult.details.slice(0, 10).map((step, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-fibonacci-gold font-mono text-sm w-8">{step.iteration}</span>
                            <div className="text-white text-sm">
                              Range: [{step.a.toFixed(3)}, {step.b.toFixed(3)}]
                            </div>
                          </div>
                          <div className="text-white/60 text-sm">Précision: {(step.range).toFixed(6)}</div>
                        </motion.div>
                      ))}
                  {searchResult.details.length > 10 && !canStep && (
                    <div className="text-center text-white/60 text-sm">
                      ... et {searchResult.details.length - 10} autres itérations
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Heap Operations */}
          {activeAlgorithm === 'heap' && heapOperations.length > 0 && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white mb-4">
                Opérations sur le Fibonacci Heap
              </h4>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {heapOperations.map((op, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        op.type === 'insert'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {op.type}
                      </span>
                      <span className="text-white text-sm">
                        {op.description}
                      </span>
                    </div>
                    <div className="text-white/60 text-sm">
                      Nœuds: {op.totalNodes}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Algorithm Explanation */}
      <div className="fibonacci-card p-6">
        <h3 className="text-xl font-semibold text-fibonacci-gold mb-6">
          Explication de l'algorithme
        </h3>

        <div className="space-y-4">
          {activeAlgorithm === 'search' && (
            <div className="prose prose-invert max-w-none">
              <p className="text-white/80">
                <strong>Fibonacci Search</strong> est un algorithme d'optimisation unimodale qui utilise
                la suite de Fibonacci pour réduire efficacement l'intervalle de recherche.
                Il est particulièrement efficace pour des fonctions coûteuses à évaluer.
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-2">
                <li>Complexité temporelle: O(log n)</li>
                <li>Optimal pour les fonctions unimodales</li>
                <li>Utilise les ratios de Fibonacci pour diviser l'intervalle</li>
              </ul>
            </div>
          )}

          {activeAlgorithm === 'golden' && (
            <div className="prose prose-invert max-w-none">
              <p className="text-white/80">
                <strong>Golden Section Search</strong> est similaire au Fibonacci Search mais utilise
                directement le nombre d'or (φ ≈ 1.618) pour diviser l'intervalle de recherche.
                C'est une méthode classique d'optimisation.
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-2">
                <li>Utilise le ratio d'or constant</li>
                <li>Convergence théorique vers la solution optimale</li>
                <li>Réduction d'intervalle par facteur φ</li>
              </ul>
            </div>
          )}

          {activeAlgorithm === 'heap' && (
            <div className="prose prose-invert max-w-none">
              <p className="text-white/80">
                <strong>Fibonacci Heap</strong> est une structure de données avancée qui utilise
                les propriétés des nombres de Fibonacci pour optimiser les opérations de tas.
                Il offre des performances amorties exceptionnelles.
              </p>
              <ul className="list-disc list-inside text-white/80 space-y-2">
                <li>Insertion en O(1) amorti</li>
                <li>Extraction du minimum en O(log n) amorti</li>
                <li>Union de tas en O(1) amorti</li>
                <li>Utilisé dans l'algorithme de Dijkstra et Prim</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AlgorithmViewer
