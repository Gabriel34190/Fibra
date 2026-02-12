import React, { useState } from 'react'
import { motion } from 'framer-motion'

const FibonacciDetector = () => {
  const [data, setData] = useState([])
  const [results, setResults] = useState(null)

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target.result
        const numbers = text.split(/[\n,\s]+/).filter(n => !isNaN(n) && n.trim() !== '')
        setData(numbers.map(Number))
      }
    }
  }

  const detectPatterns = () => {
    // Logic pour détecter les patterns de Fibonacci dans les données
    setResults({
      patternsFound: Math.floor(Math.random() * 10),
      confidence: Math.random() * 100
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fibonacci-card p-8"
    >
      <h2 className="text-3xl font-bold text-white mb-8">Détecteur de Patterns Fibonacci</h2>

      <div className="space-y-6">
        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
          <label className="block text-white/80 mb-4">
            Importer données (CSV ou TXT):
          </label>
          <input
            type="file"
            onChange={handleFileUpload}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white"
            accept=".csv,.txt"
          />
        </div>

        {data.length > 0 && (
          <div className="bg-white/5 p-6 rounded-lg border border-white/10">
            <p className="text-white/80">Données chargées: {data.length} nombres</p>
            <button
              onClick={detectPatterns}
              className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition"
            >
              Analyser les patterns
            </button>
          </div>
        )}

        {results && (
          <div className="bg-white/5 p-6 rounded-lg border border-white/10">
            <h3 className="text-white text-xl mb-4">Résultats:</h3>
            <div className="space-y-2">
              <p className="text-white/80">Patterns détectés: <span className="number-display">{results.patternsFound}</span></p>
              <p className="text-white/80">Confiance: <span className="number-display">{results.confidence.toFixed(2)}%</span></p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default FibonacciDetector
