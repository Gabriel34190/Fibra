import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { generateFibonacciSequence, fibonacciRatio, GOLDEN_RATIO } from '../utils/fibonacci.js'

const SequenceViewer = ({ count }) => {
  const sequence = useMemo(() => generateFibonacciSequence(count), [count])

  const ratios = useMemo(() => {
    return sequence.slice(1).map((_, i) => {
      const current = sequence[i + 1]
      const previous = sequence[i]
      return {
        ratio: previous !== 0 ? current / previous : 0,
        index: i,
        error: previous !== 0 ? Math.abs(current / previous - GOLDEN_RATIO) : 0
      }
    })
  }, [sequence])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3 }
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Sequence Display */}
      <div className="fibonacci-card p-6">
        <h2 className="section-title mb-6">Séquence de Fibonacci</h2>
        <motion.div
          className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2 max-h-96 overflow-y-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {sequence.map((number, index) => (
            <motion.div
              key={index}
              className="number-display text-center p-2"
              variants={itemVariants}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              {number.toLocaleString()}
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-6 p-4 bg-black/20 rounded-lg">
          <p className="text-white/80 text-sm">
            <strong>Terme {count}:</strong> {sequence[count - 1]?.toLocaleString() || 'N/A'}
          </p>
        </div>
      </div>

      {/* Ratio Analysis */}
      <div className="fibonacci-card p-6">
        <h2 className="section-title mb-6">Convergence vers φ</h2>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {ratios.slice(0, Math.min(20, ratios.length)).map((ratio, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-center gap-4">
                <span className="text-white/60 text-sm">n={index + 1}:</span>
                <span className="text-fibonacci-gold font-mono">
                  {ratio.ratio.toFixed(6)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-fibonacci-gold to-yellow-300 rounded-full"
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.max(0, 100 - (ratio.error / GOLDEN_RATIO) * 1000)}%`
                    }}
                    transition={{ delay: index * 0.05 + 0.5, duration: 0.5 }}
                  />
                </div>
                <span className="text-xs text-white/60">
                  {((1 - ratio.error / GOLDEN_RATIO) * 100).toFixed(1)}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {count > 20 && (
          <div className="mt-4 text-center text-white/60 text-sm">
            ... et {ratios.length - 20} autres termes
          </div>
        )}
      </div>

      {/* Mathematical Properties */}
      <div className="fibonacci-card p-6 lg:col-span-2">
        <h2 className="section-title mb-6">Propriétés Mathématiques</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-fibonacci-gold/20 to-transparent rounded-lg">
            <div className="text-3xl font-bold text-fibonacci-gold mb-2">
              {sequence.length > 2 ? (sequence[sequence.length - 1] / sequence[sequence.length - 2]).toFixed(6) : 'N/A'}
            </div>
            <div className="text-white/80">Limite des ratios</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-blue-500/20 to-transparent rounded-lg">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {GOLDEN_RATIO.toFixed(6)}
            </div>
            <div className="text-white/80">Nombre d'or (φ)</div>
          </div>

          <div className="text-center p-4 bg-gradient-to-br from-green-500/20 to-transparent rounded-lg">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {sequence.length > 0 ? sequence.reduce((a, b) => a + b, 0).toLocaleString() : '0'}
            </div>
            <div className="text-white/80">Somme totale</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SequenceViewer
