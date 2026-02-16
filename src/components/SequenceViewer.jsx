import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import { generateFibonacciSequence, fibonacciRatio, GOLDEN_RATIO } from '../utils/fibonacci.js'

// Représentation de Zeckendorf : somme de nombres de Fibonacci non consécutifs
function zeckendorfRepresentation(n) {
  if (n <= 0 || !Number.isInteger(n)) return []
  const fib = [1, 2]
  while (fib[fib.length - 1] < n) fib.push(fib[fib.length - 1] + fib[fib.length - 2])
  const out = []
  let rest = n
  for (let i = fib.length - 1; i >= 0 && rest > 0; i--) {
    if (fib[i] <= rest) {
      out.push(fib[i])
      rest -= fib[i]
    }
  }
  return out.reverse()
}

const SequenceViewer = ({ count }) => {
  const [searchText, setSearchText] = useState('')
  const [filterMode, setFilterMode] = useState('all') // 'all' | 'index' | 'value'
  const [indexMin, setIndexMin] = useState(0)
  const [indexMax, setIndexMax] = useState(count - 1)
  const [selectedIndex, setSelectedIndex] = useState(null)

  const sequence = useMemo(() => generateFibonacciSequence(count), [count])

  const filteredSequence = useMemo(() => {
    let list = sequence.map((value, index) => ({ value, index }))
    if (filterMode === 'index') {
      const min = Math.max(0, parseInt(indexMin, 10) || 0)
      const max = Math.min(sequence.length - 1, parseInt(indexMax, 10) ?? sequence.length - 1)
      list = list.filter(({ index: i }) => i >= min && i <= max)
    } else if (searchText.trim()) {
      const q = searchText.trim().toLowerCase()
      list = list.filter(({ value, index: i }) => {
        const strVal = String(value)
        return strVal.includes(q) || String(i).includes(q)
      })
    }
    return list
  }, [sequence, searchText, filterMode, indexMin, indexMax, count])

  const ratios = useMemo(() => {
    return sequence.slice(1).map((_, i) => {
      const current = sequence[i + 1]
      const previous = sequence[i]

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

  const chartGrowthData = useMemo(() => {
    const maxPoints = 50
    const step = Math.max(1, Math.floor(sequence.length / maxPoints))
    const out = []
    for (let i = 0; i < sequence.length; i += step) {
      const value = sequence[i]
      const num = typeof value === 'bigint' ? Number(value) : value
      out.push({
        terme: i + 1,
        valeur: isFinite(num) ? num : 0
      })
    }
    if (sequence.length > 0 && (out.length === 0 || out[out.length - 1].terme !== sequence.length)) {
      const value = sequence[sequence.length - 1]
      const num = typeof value === 'bigint' ? Number(value) : value
      out.push({ terme: sequence.length, valeur: isFinite(num) ? num : 0 })
    }
    return out
  }, [sequence])

  const chartRatioData = useMemo(() => {
    return ratios.map((r, i) => ({
      index: i + 1,
      ratio: r.ratio,
      phi: GOLDEN_RATIO
    }))
  }, [ratios])

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
    <div className="space-y-8">
      {/* Recherche et filtrage */}
      <div className="fibonacci-card p-6">
        <h2 className="section-title mb-4">Recherche et filtrage</h2>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-white/80 text-sm mb-1">Rechercher un nombre ou un index</label>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Ex: 21, 144, 5..."
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40"
            />
          </div>
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2 text-white/80 text-sm">
              <input
                type="radio"
                name="filterMode"
                checked={filterMode === 'all'}
                onChange={() => setFilterMode('all')}
                className="text-fibonacci-gold"
              />
              Tous
            </label>
            <label className="flex items-center gap-2 text-white/80 text-sm">
              <input
                type="radio"
                name="filterMode"
                checked={filterMode === 'index'}
                onChange={() => setFilterMode('index')}
                className="text-fibonacci-gold"
              />
              Plage d&apos;indices
            </label>
          </div>
          {filterMode === 'index' && (
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min={0}
                max={sequence.length - 1}
                value={indexMin}
                onChange={(e) => setIndexMin(e.target.value)}
                className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
              />
              <span className="text-white/60">à</span>
              <input
                type="number"
                min={0}
                max={sequence.length - 1}
                value={indexMax}
                onChange={(e) => setIndexMax(e.target.value)}
                className="w-20 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm"
              />
            </div>
          )}
        </div>
        <p className="mt-2 text-white/60 text-sm">
          {filteredSequence.length} terme(s) affiché(s) sur {sequence.length}
        </p>
      </div>

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
            {filteredSequence.map(({ value: number, index }) => (
            <motion.div
              key={index}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedIndex(index)}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedIndex(index)}
              className={`number-display text-center p-2 w-full min-w-0 relative group overflow-visible cursor-pointer rounded-lg transition-colors ${selectedIndex === index ? 'ring-2 ring-fibonacci-gold bg-fibonacci-gold/20' : 'hover:bg-white/10'}`}
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

        {selectedIndex != null && sequence[selectedIndex] != null && (
          <motion.div
            className="mt-6 p-4 bg-black/30 border border-fibonacci-gold/30 rounded-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-fibonacci-gold font-semibold mb-3 flex items-center justify-between">
              Propriétés du terme n°{selectedIndex + 1}
              <button
                type="button"
                onClick={() => setSelectedIndex(null)}
                className="text-white/60 hover:text-white text-sm"
                aria-label="Fermer"
              >
                ✕ Fermer
              </button>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-white/90">
              <div><span className="text-white/60">Index (n) :</span> {selectedIndex + 1}</div>
              <div><span className="text-white/60">Valeur F(n) :</span> <span className="font-mono text-fibonacci-gold">{formatFullNumber(sequence[selectedIndex])}</span></div>
              {selectedIndex > 0 && (
                <>
                  <div><span className="text-white/60">Ratio F(n)/F(n-1) :</span> <span className="font-mono">{ratios[selectedIndex - 1]?.ratio.toFixed(6) ?? '—'}</span></div>
                  <div><span className="text-white/60">Écart à φ :</span> <span className="font-mono">{ratios[selectedIndex - 1] ? (ratios[selectedIndex - 1].error < 1e-4 ? '≈ φ' : ratios[selectedIndex - 1].error.toExponential(2)) : '—'}</span></div>
                </>
              )}
              {(() => {
                const val = Number(sequence[selectedIndex])
                if (Number.isInteger(val) && val > 0) {
                  const z = zeckendorfRepresentation(val)
                  return (
                    <div className="sm:col-span-2"><span className="text-white/60">Représentation de Zeckendorf :</span> {z.length ? `${z.join(' + ')} = ${val}` : '—'}</div>
                  )
                }
                return null
              })()}
            </div>
          </motion.div>
        )}

        <div className="mt-6 p-4 bg-black/20 rounded-lg">
          <p className="text-white/80 text-sm">
            <strong>Terme {count} (valeur complète) :</strong>{' '}
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

      {/* Graphiques : croissance exponentielle et ratio d'or */}
      <div className="fibonacci-card p-6 lg:col-span-2">
        <h2 className="section-title mb-6">Graphiques</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-3">Croissance exponentielle de la séquence</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartGrowthData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="terme" stroke="rgba(255,255,255,0.6)" tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }} />
                  <YAxis stroke="rgba(255,255,255,0.6)" tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,215,0,0.3)' }}
                    labelStyle={{ color: '#FFD700' }}
                    formatter={(val) => [val?.toLocaleString('fr-FR'), 'Valeur']}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="valeur" stroke="#FFD700" strokeWidth={2} dot={false} name="F(n)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-3">Convergence du ratio F(n+1)/F(n) vers φ</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartRatioData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="index" stroke="rgba(255,255,255,0.6)" tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }} />
                  <YAxis stroke="rgba(255,255,255,0.6)" tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }} domain={[1.5, 2]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,215,0,0.3)' }}
                    labelStyle={{ color: '#FFD700' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="ratio" stroke="#FFD700" strokeWidth={2} dot={false} name="Ratio F(n+1)/F(n)" />
                  <Line type="monotone" dataKey="phi" stroke="#22c55e" strokeDasharray="5 5" strokeWidth={1.5} dot={false} name="φ (nombre d'or)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SequenceViewer
