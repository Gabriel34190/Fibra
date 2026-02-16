import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { generateFibonacciSequence, goldenSpiralCoordinates, goldenRectangleSpiral, GOLDEN_RATIO } from '../utils/fibonacci.js'

const Spiral2D = ({ count }) => {
  const canvasRef = useRef(null)
  const [animationSpeed, setAnimationSpeed] = useState(1)
  const [showRectangles, setShowRectangles] = useState(true)
  const [showSpiral, setShowSpiral] = useState(true)
  const [showGrid, setShowGrid] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [progressiveMode, setProgressiveMode] = useState(false)
  const [progressiveStep, setProgressiveStep] = useState(1)
  const [progressivePlaying, setProgressivePlaying] = useState(false)
  const maxProgressiveSteps = Math.min(count, 12)

  useEffect(() => {
    if (!progressivePlaying || !progressiveMode) return
    const t = setInterval(() => {
      setProgressiveStep((s) => (s >= maxProgressiveSteps ? 1 : s + 1))
    }, 800 / animationSpeed)
    return () => clearInterval(t)
  }, [progressivePlaying, progressiveMode, animationSpeed, maxProgressiveSteps])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()

    // Set canvas size
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const baseScale = Math.min(rect.width, rect.height) / 8
    const scale = baseScale * zoom

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    const sequence = generateFibonacciSequence(count)
    const limit = progressiveMode ? progressiveStep : null

    // Draw grid if enabled
    if (showGrid) {
      drawGrid(ctx, rect.width, rect.height, centerX, centerY)
    }

    // Draw golden rectangles
    if (showRectangles) {
      drawGoldenRectangles(ctx, centerX, centerY, scale, limit)
    }

    // Draw spiral
    if (showSpiral) {
      drawGoldenSpiral(ctx, centerX, centerY, scale, sequence, limit)
    }

    // Draw sequence numbers
    drawSequenceNumbers(ctx, centerX, centerY, scale, sequence, limit)

  }, [count, animationSpeed, showRectangles, showSpiral, showGrid, zoom, progressiveMode, progressiveStep])

  const drawGrid = (ctx, width, height, centerX, centerY) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
    ctx.lineWidth = 1

    // Vertical lines
    for (let x = 0; x < width; x += 50) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }

    // Horizontal lines
    for (let y = 0; y < height; y += 50) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Center cross
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(centerX - 20, centerY)
    ctx.lineTo(centerX + 20, centerY)
    ctx.moveTo(centerX, centerY - 20)
    ctx.lineTo(centerX, centerY + 20)
    ctx.stroke()
  }

  const drawGoldenRectangles = (ctx, centerX, centerY, scale, limit = null) => {
    const maxN = limit != null ? limit : Math.min(count, 12)
    const rectangles = goldenRectangleSpiral(maxN)

    rectangles.forEach((rect, index) => {
      const alpha = 0.3 + (index / rectangles.length) * 0.4
      ctx.strokeStyle = `rgba(255, 215, 0, ${alpha})`
      ctx.fillStyle = `rgba(255, 215, 0, ${alpha * 0.1})`
      ctx.lineWidth = 2

      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(rect.angle)
      ctx.fillRect(rect.x * scale, rect.y * scale, rect.width * scale, rect.height * scale)
      ctx.strokeRect(rect.x * scale, rect.y * scale, rect.width * scale, rect.height * scale)
      ctx.restore()
    })
  }

  const drawGoldenSpiral = (ctx, centerX, centerY, scale, sequence, limit = null) => {
    const maxTerms = limit != null ? Math.min(limit, 10) : Math.min(count, 10)
    const seq = sequence.slice(0, maxTerms)
    ctx.strokeStyle = '#FFD700'
    ctx.lineWidth = 3
    ctx.beginPath()

    const maxT = Math.PI * 4
    const steps = 200
    let firstPoint = true
    const tMax = seq.length > 1 ? (seq.length / Math.max(1, count)) * maxT : maxT

    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * tMax
      const coords = goldenSpiralCoordinates(t, maxT, scale / 20)

      const x = centerX + coords.x
      const y = centerY + coords.y

      if (firstPoint) {
        ctx.moveTo(x, y)
        firstPoint = false
      } else {
        ctx.lineTo(x, y)
      }
    }

    ctx.stroke()

    // Draw spiral points with Fibonacci numbers
    seq.forEach((fibNum, index) => {
      if (index === 0) return

      const t = (index / Math.max(1, seq.length)) * maxT
      const coords = goldenSpiralCoordinates(t, maxT, scale / 20)

      const x = centerX + coords.x
      const y = centerY + coords.y

      ctx.fillStyle = '#FFD700'
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, 2 * Math.PI)
      ctx.fill()
      ctx.stroke()

      ctx.fillStyle = '#000'
      ctx.font = 'bold 10px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(fibNum.toString(), x, y)
    })
  }

  const drawSequenceNumbers = (ctx, centerX, centerY, scale, sequence, limit = null) => {
    const slice = limit != null ? sequence.slice(0, Math.min(limit, 8)) : sequence.slice(0, 8)
    slice.forEach((num, index) => {
      const angle = (index / Math.max(1, slice.length)) * 2 * Math.PI
      const radius = 100 + index * 20

      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      ctx.fillStyle = 'rgba(255, 215, 0, 0.8)'
      ctx.font = 'bold 14px Arial'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(num.toString(), x, y)
    })
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="fibonacci-card p-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showRectangles}
                onChange={(e) => setShowRectangles(e.target.checked)}
                className="w-4 h-4 text-fibonacci-gold"
              />
              <span className="text-white">Rectangles d'or</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showSpiral}
                onChange={(e) => setShowSpiral(e.target.checked)}
                className="w-4 h-4 text-fibonacci-gold"
              />
              <span className="text-white">Spirale dorée</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
                className="w-4 h-4 text-fibonacci-gold"
              />
              <span className="text-white">Grille</span>
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={progressiveMode}
                onChange={(e) => {
                  setProgressiveMode(e.target.checked)
                  if (!e.target.checked) setProgressivePlaying(false)
                }}
                className="w-4 h-4 text-fibonacci-gold"
              />
              <span className="text-white">Animation progressive</span>
            </label>
            {progressiveMode && (
              <>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setProgressivePlaying((p) => !p)}
                    className="px-3 py-1 rounded bg-fibonacci-gold text-black text-sm font-medium"
                  >
                    {progressivePlaying ? '⏸ Pause' : '▶ Lecture'}
                  </button>
                  <span className="text-white/80 text-sm">
                    Étape {progressiveStep} / {maxProgressiveSteps}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max={maxProgressiveSteps}
                    value={progressiveStep}
                    onChange={(e) => setProgressiveStep(parseInt(e.target.value, 10))}
                    className="w-24"
                  />
                </div>
              </>
            )}
            <div className="flex items-center gap-2">
              <label className="text-white/80 text-sm">Vitesse:</label>
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                className="w-24"
              />
              <span className="text-fibonacci-gold text-sm font-mono">
                {animationSpeed.toFixed(1)}x
              </span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-white/80 text-sm">Zoom:</label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-24"
              />
              <span className="text-fibonacci-gold text-sm font-mono">
                {zoom.toFixed(1)}x
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="fibonacci-card p-6">
        <h2 className="section-title mb-6">Visualisation de la Spirale Dorée</h2>

        <div className="relative">
          <canvas
            ref={canvasRef}
            className="w-full h-96 border border-white/20 rounded-lg bg-gradient-to-br from-slate-800/50 to-purple-900/30"
            style={{ maxHeight: '500px' }}
          />

          {/* Overlay info */}
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
            <div>Ratio d'or: <span className="text-fibonacci-gold font-mono">{GOLDEN_RATIO.toFixed(6)}</span></div>
            <div>Termes: <span className="text-fibonacci-gold">{count}</span></div>
          </div>
        </div>

        {/* Mathematical explanation */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-fibonacci-gold">Propriétés de la Spirale</h3>
            <ul className="space-y-2 text-white/80 text-sm">
              <li>• Chaque rectangle a un ratio de 1:φ (nombre d'or)</li>
              <li>• La spirale suit une progression logarithmique</li>
              <li>• Apparaît naturellement dans les coquillages et galaxies</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-blue-400">Applications</h3>
            <ul className="space-y-2 text-white/80 text-sm">
              <li>• Architecture et design (Parthénon, Vitruve)</li>
              <li>• Art classique (peintures de la Renaissance)</li>
              <li>• Algorithmes d'optimisation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Spiral2D
