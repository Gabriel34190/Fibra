import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { generateFibonacciSequence, fibonacciRatio, GOLDEN_RATIO } from '../utils/fibonacci.js'

const SequenceViewer = ({ count }) => {
  const sequence = useMemo(() => generateFibonacciSequence(count), [count])

  const ratios = useMemo(() => {
    return sequence.slice(1).map((_, i) => {
      const current = sequence[i + 1]
      const previous = sequence[i]

      // handle BigInt values by converting to Number for ratio/error calculation
      let ratio = 0
      if (previous === 0 || previous === 0n) {
        ratio = 0
      } else if (typeof current === 'bigint' || typeof previous === 'bigint') {
        ratio = Number(current) / Number(previous)
      } else {
        ratio = current / previous
      }

      const error = Math.abs(ratio - GOLDEN_RATIO)

      return {
        ratio,
        index: i,
        error
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

  const formatFullNumber = (n) => {
    if (typeof n === 'bigint') {
      return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
    }
    if (typeof n === 'number' && isFinite(n)) {
      return new Intl.NumberFormat('fr-FR').format(n)
    }
    return String(n)
  }

  const formatNumberForDisplay = (n) => {
    if (typeof n === 'bigint') {
      const s = n.toString()
      const len = s.length
      const suffixes = ['', 'k', 'M', 'G', 'T', 'P']
      const group = Math.floor((len - 1) / 3)
      if (group === 0) return s
      const divisor = Math.pow(10, group * 3)
      // take the first digits to create a compact string
      const main = Number(s.slice(0, Math.min(3, s.length)))
      const scaled = main / Math.pow(10, Math.max(0, (s.length - Math.min(3, s.length))))
      return `${scaled.toFixed(2).replace('.', ',')} ${suffixes[group]}`
    }

    if (typeof n === 'number' && isFinite(n)) {
      if (Math.abs(n) >= 1000) {
        try {
          return new Intl.NumberFormat('fr-FR', { notation: 'compact', maximumFractionDigits: 2 }).format(n)
        } catch (e) {
          return n.toLocaleString('fr-FR')
        }
      }
      return n.toLocaleString('fr-FR')
    }

    return String(n)
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
              className="number-display text-center p-2 w-full min-w-0 relative group overflow-visible"
              variants={itemVariants}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <div className="absolute z-50 -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-xs text-white px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="font-mono">{formatFullNumber(number)}</span>
              </div>

              <span className="block w-full overflow-hidden break-words">
                {formatNumberForDisplay(number)}
              </span>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-6 p-4 bg-black/20 rounded-lg">
          <p className="text-white/80 text-sm">
            <strong>Terme {count}:</strong>{' '}
            {sequence[count - 1] == null ? (
              'N/A'
            ) : (
              <span title={formatFullNumber(sequence[count - 1])}>
                {formatNumberForDisplay(sequence[count - 1])}
              </span>
            )}
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
                {sequence.length > 2 ? fibonacciRatio(sequence.length - 2).toFixed(6) : 'N/A'}
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
              {sequence.length > 0 ? (
                <span title={formatFullNumber(
                  typeof sequence[0] === 'bigint'
                    ? sequence.reduce((a, b) => a + b, 0n)
                    : sequence.reduce((a, b) => a + b, 0)
                )}>
                  {formatNumberForDisplay(
                    typeof sequence[0] === 'bigint'
                      ? sequence.reduce((a, b) => a + b, 0n)
                      : sequence.reduce((a, b) => a + b, 0)
                  )}
                </span>
              ) : (
                '0'
              )}
            </div>
            <div className="text-white/80">Somme totale</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SequenceViewer
