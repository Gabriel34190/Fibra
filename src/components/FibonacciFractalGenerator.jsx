import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FibonacciFractalGenerator = () => {
  const [fractalType, setFractalType] = useState('spiral')
  const [iterations, setIterations] = useState(8)
  const [scale, setScale] = useState(1)
  const [angle, setAngle] = useState(137.5)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(1)
  const [zoom, setZoom] = useState(1)
  const [panX, setPanX] = useState(0)
  const [panY, setPanY] = useState(0)
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  const GOLDEN_RATIO = 1.618033988749895
  const GOLDEN_ANGLE = 137.5 // Degrés

  // Générer la suite de Fibonacci
  const generateFibonacci = (n) => {
    const fib = [1, 1]
    for (let i = 2; i < n; i++) {
      fib[i] = fib[i - 1] + fib[i - 2]
    }
    return fib
  }

  // Spirale de Fibonacci
  const drawFibonacciSpiral = (ctx, width, height) => {
    ctx.clearRect(0, 0, width, height)

    // Appliquer la transformation de zoom et pan
    ctx.save()
    ctx.translate(width/2 + panX, height/2 + panY)
    ctx.scale(zoom, zoom)
    ctx.translate(-width/2, -height/2)

    ctx.strokeStyle = '#fbbf24'
    ctx.lineWidth = 2 / zoom

    const centerX = width / 2
    const centerY = height / 2
    const fib = generateFibonacci(iterations)

    let x = centerX
    let y = centerY
    let currentAngle = 0

    ctx.beginPath()
    ctx.moveTo(x, y)

    for (let i = 0; i < iterations; i++) {
      const radius = fib[i] * scale * 2
      const nextAngle = currentAngle + (GOLDEN_ANGLE * Math.PI / 180)

      x = centerX + radius * Math.cos(nextAngle)
      y = centerY + radius * Math.sin(nextAngle)

      ctx.lineTo(x, y)
      currentAngle = nextAngle
    }

    ctx.stroke()
    ctx.restore()
  }

  // Arbre de Fibonacci
  const drawFibonacciTree = (ctx, width, height) => {
    ctx.clearRect(0, 0, width, height)

    // Appliquer la transformation de zoom et pan
    ctx.save()
    ctx.translate(width/2 + panX, height/2 + panY)
    ctx.scale(zoom, zoom)
    ctx.translate(-width/2, -height/2)

    const fib = generateFibonacci(iterations)
    const startX = width / 2
    const startY = height - 50
    const startLength = 100 * scale

    const drawBranch = (x, y, length, angle, depth) => {
      if (depth <= 0) {
        return
      }

      const endX = x + length * Math.cos(angle)
      const endY = y - length * Math.sin(angle)

      ctx.strokeStyle = `hsl(${120 - depth * 10}, 70%, ${50 + depth * 5}%)`
      ctx.lineWidth = Math.max(1, depth) / zoom
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(endX, endY)
      ctx.stroke()

      // Branches récursives
      const newLength = length * 0.618 // Ratio d'or
      const fibIndex = Math.min(depth - 1, fib.length - 1)
      const angleVariation = (fib[fibIndex] % 60) - 30 // Variation basée sur Fibonacci

      drawBranch(endX, endY, newLength, angle + angleVariation * Math.PI / 180, depth - 1)
      drawBranch(endX, endY, newLength, angle - angleVariation * Math.PI / 180, depth - 1)
    }

    drawBranch(startX, startY, startLength, Math.PI / 2, iterations)
    ctx.restore()
  }

  // Galaxie de Fibonacci
  const drawFibonacciGalaxy = (ctx, width, height) => {
    ctx.clearRect(0, 0, width, height)

    const centerX = width / 2
    const centerY = height / 2
    const fib = generateFibonacci(iterations)

    for (let i = 0; i < iterations; i++) {
      const radius = fib[i] * scale * 3
      const angle = i * GOLDEN_ANGLE * Math.PI / 180

      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)

      // Dessiner une étoile
      ctx.fillStyle = `hsl(${200 + i * 10}, 80%, ${60 + i * 3}%)`
      ctx.beginPath()
      ctx.arc(x, y, Math.max(2, fib[i] * 0.1), 0, 2 * Math.PI)
      ctx.fill()

      // Dessiner les bras spiraux
      if (i > 0) {
        ctx.strokeStyle = `hsla(${200 + i * 10}, 60%, 50%, 0.3)`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(x, y)
        ctx.stroke()
      }
    }
  }

  // Fractale de Mandelbrot avec Fibonacci
  const drawFibonacciMandelbrot = (ctx, width, height) => {
    ctx.clearRect(0, 0, width, height)

    const fib = generateFibonacci(iterations)
    const maxIterations = Math.min(iterations * 10, 100)

    for (let x = 0; x < width; x += 2) {
      for (let y = 0; y < height; y += 2) {
        const zx = (x - width / 2) / (width / 4) * scale
        const zy = (y - height / 2) / (height / 4) * scale

        let cx = zx
        let cy = zy
        let iterCount = 0

        while (iterCount < maxIterations && cx * cx + cy * cy < 4) {
          const tmp = cx * cx - cy * cy + zx
          cy = 2 * cx * cy + zy
          cx = tmp
          iterCount++
        }

        // Couleur basée sur Fibonacci
        const fibIndex = iterCount % fib.length
        const hue = (fib[fibIndex] * 137.5) % 360

        ctx.fillStyle = `hsl(${hue}, 80%, ${50 + iterCount % 50}%)`
        ctx.fillRect(x, y, 2, 2)
      }
    }
  }

  // Fractale de Julia avec Fibonacci
  const drawFibonacciJulia = (ctx, width, height) => {
    ctx.clearRect(0, 0, width, height)

    const fib = generateFibonacci(iterations)
    const maxIterations = Math.min(iterations * 8, 80)

    // Constante Julia basée sur Fibonacci
    const fibIndex = Math.min(iterations - 1, fib.length - 1)
    const juliaReal = (fib[fibIndex] % 10) / 10 - 0.5
    const juliaImag = (fib[Math.min(fibIndex + 1, fib.length - 1)] % 10) / 10 - 0.5

    for (let x = 0; x < width; x += 2) {
      for (let y = 0; y < height; y += 2) {
        let zx = (x - width / 2) / (width / 4) * scale
        let zy = (y - height / 2) / (height / 4) * scale
        let iterCount = 0

        while (iterCount < maxIterations && zx * zx + zy * zy < 4) {
          const tmp = zx * zx - zy * zy + juliaReal
          zy = 2 * zx * zy + juliaImag
          zx = tmp
          iterCount++
        }

        // Couleur basée sur Fibonacci
        const fibIndex = iterCount % fib.length
        const hue = (fib[fibIndex] * 137.5) % 360

        ctx.fillStyle = `hsl(${hue}, 70%, ${30 + iterCount % 70}%)`
        ctx.fillRect(x, y, 2, 2)
      }
    }
  }

  // Fonction principale de dessin
  const drawFractal = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    const ctx = canvas.getContext('2d')
    const { width, height } = canvas

    if (width === 0 || height === 0) {
      return
    }

    switch (fractalType) {
    case 'spiral':
      drawFibonacciSpiral(ctx, width, height)
      break
    case 'tree':
      drawFibonacciTree(ctx, width, height)
      break
    case 'galaxy':
      drawFibonacciGalaxy(ctx, width, height)
      break
    case 'mandelbrot':
      drawFibonacciMandelbrot(ctx, width, height)
      break
    case 'julia':
      drawFibonacciJulia(ctx, width, height)
      break
    }
  }, [fractalType, iterations, scale, angle, zoom, panX, panY])

  // Animation
  const animate = () => {
    if (!isAnimating) {
      return
    }

    setScale(prev => prev + 0.01 * animationSpeed)
    setAngle(prev => (prev + 0.5 * animationSpeed) % 360)

    animationRef.current = requestAnimationFrame(animate)
  }

  // Effets
  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas && canvas.width === 0 && canvas.height === 0) {
      // Initialiser le canvas si pas encore dimensionné
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    drawFractal()
  }, [fractalType, iterations, scale, angle, zoom, panX, panY, drawFractal])

  useEffect(() => {
    if (isAnimating) {
      animationRef.current = requestAnimationFrame(animate)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isAnimating])

  // Redimensionner le canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const resizeCanvas = () => {
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
        drawFractal()
      }

      // Attendre que le canvas soit rendu
      setTimeout(() => {
        resizeCanvas()
      }, 100)

      window.addEventListener('resize', resizeCanvas)

      return () => window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  // Effet pour forcer le redessin initial
  useEffect(() => {
    const timer = setTimeout(() => {
      drawFractal()
    }, 200)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          🌀 Fibonacci Fractal Generator
        </h2>
        <p className="text-white/70 text-lg max-w-3xl mx-auto">
          Explorez les fractales générées par la suite de Fibonacci et le ratio d'or.
          Découvrez comment les mathématiques créent des formes infiniment complexes !
        </p>
      </div>

      {/* Controls */}
      <div className="fibonacci-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
          {/* Type de fractale */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Type de fractale
            </label>
            <select
              value={fractalType}
              onChange={(e) => setFractalType(e.target.value)}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="spiral">🌀 Spirale</option>
              <option value="tree">🌳 Arbre</option>
              <option value="galaxy">🌌 Galaxie</option>
              <option value="mandelbrot">🔮 Mandelbrot</option>
              <option value="julia">💎 Julia</option>
            </select>
          </div>

          {/* Itérations */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Itérations: {iterations}
            </label>
            <input
              type="range"
              min="3"
              max="15"
              value={iterations}
              onChange={(e) => setIterations(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Échelle */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Échelle: {scale.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Angle */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Angle: {angle.toFixed(1)}°
            </label>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={angle}
              onChange={(e) => setAngle(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Zoom */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Zoom: {zoom.toFixed(2)}x
            </label>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Animation */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Vitesse: {animationSpeed}x
            </label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Bouton d'animation */}
          <div className="flex items-end">
            <motion.button
              onClick={() => setIsAnimating(!isAnimating)}
              className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors ${
                isAnimating
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-fibonacci-gold hover:bg-yellow-400 text-black'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isAnimating ? '⏸️ Pause' : '▶️ Animer'}
            </motion.button>
          </div>
        </div>

        {/* Contrôles supplémentaires */}
        <div className="mt-4 flex flex-wrap gap-2">
          <motion.button
            onClick={() => {
              setZoom(1)
              setPanX(0)
              setPanY(0)
              setScale(1)
            }}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔄 Reset
          </motion.button>

          <motion.button
            onClick={() => setZoom(prev => Math.min(prev * 1.2, 5))}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔍+ Zoom In
          </motion.button>

          <motion.button
            onClick={() => setZoom(prev => Math.max(prev / 1.2, 0.1))}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔍- Zoom Out
          </motion.button>
        </div>
      </div>

      {/* Canvas */}
      <div className="fibonacci-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          🎨 Fractale générée
        </h3>

        <div className="bg-black/20 p-4 rounded-lg">
          <canvas
            ref={canvasRef}
            className="w-full h-96 border border-white/20 rounded"
            style={{ maxHeight: '600px' }}
          />
        </div>
      </div>

      {/* Informations sur la fractale */}
      <div className="fibonacci-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          📊 Informations sur la fractale
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-fibonacci-gold mb-3">
              🔢 Paramètres actuels
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Type:</span>
                <span className="text-white font-semibold">
                  {fractalType === 'spiral' && 'Spirale de Fibonacci'}
                  {fractalType === 'tree' && 'Arbre fractal'}
                  {fractalType === 'galaxy' && 'Galaxie spirale'}
                  {fractalType === 'mandelbrot' && 'Mandelbrot Fibonacci'}
                  {fractalType === 'julia' && 'Julia Fibonacci'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Itérations:</span>
                <span className="text-white font-semibold">{iterations}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Échelle:</span>
                <span className="text-white font-semibold">{scale.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Angle:</span>
                <span className="text-white font-semibold">{angle.toFixed(1)}°</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-fibonacci-gold mb-3">
              🧮 Propriétés mathématiques
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Ratio d'or (φ):</span>
                <span className="text-white font-semibold">1.618...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Angle d'or:</span>
                <span className="text-white font-semibold">137.5°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Complexité:</span>
                <span className="text-white font-semibold">
                  {iterations > 10 ? 'Élevée' : iterations > 6 ? 'Moyenne' : 'Faible'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Auto-similarité:</span>
                <span className="text-white font-semibold">
                  {fractalType === 'tree' ? 'Oui' : 'Partielle'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Types de fractales */}
      <div className="fibonacci-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          🌟 Types de fractales Fibonacci
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              type: 'spiral',
              name: 'Spirale de Fibonacci',
              description: 'Spirale logarithmique basée sur les rectangles dorés',
              emoji: '🌀',
              formula: 'r = φ^(θ/137.5°)'
            },
            {
              type: 'tree',
              name: 'Arbre fractal',
              description: 'Arbre avec branches suivant les proportions dorées',
              emoji: '🌳',
              formula: 'L(n+1) = L(n) × φ'
            },
            {
              type: 'galaxy',
              name: 'Galaxie spirale',
              description: 'Modèle de galaxie avec bras spiraux Fibonacci',
              emoji: '🌌',
              formula: 'θ = n × 137.5°'
            },
            {
              type: 'mandelbrot',
              name: 'Mandelbrot Fibonacci',
              description: 'Ensemble de Mandelbrot coloré avec Fibonacci',
              emoji: '🔮',
              formula: 'z = z² + c'
            },
            {
              type: 'julia',
              name: 'Julia Fibonacci',
              description: 'Ensemble de Julia avec constantes Fibonacci',
              emoji: '💎',
              formula: 'z = z² + F(n)'
            }
          ].map((fractal, index) => (
            <motion.button
              key={index}
              onClick={() => setFractalType(fractal.type)}
              className={`p-4 rounded-lg text-left transition-colors ${
                fractalType === fractal.type
                  ? 'bg-fibonacci-gold/20 border-2 border-fibonacci-gold'
                  : 'bg-white/5 hover:bg-white/10 border border-white/20'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-2xl mb-2">{fractal.emoji}</div>
              <div className="font-semibold text-white">{fractal.name}</div>
              <div className="text-white/60 text-sm mt-1">{fractal.description}</div>
              <div className="text-fibonacci-gold text-xs mt-2 font-mono">{fractal.formula}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Théorie des fractales */}
      <div className="fibonacci-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          🔬 Pourquoi Fibonacci crée-t-il des fractales ?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-fibonacci-gold mb-2">
              🌿 Auto-similarité naturelle
            </h4>
            <p className="text-white/80 text-sm mb-4">
              Les fractales Fibonacci reproduisent les patterns de croissance naturelle
              où chaque partie ressemble au tout, créant une harmonie visuelle.
            </p>

            <h4 className="text-lg font-semibold text-fibonacci-gold mb-2">
              📐 Proportions optimales
            </h4>
            <p className="text-white/80 text-sm">
              Le ratio d'or maximise l'efficacité de l'espace et de l'énergie,
              expliquant pourquoi ces formes apparaissent dans la nature.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-fibonacci-gold mb-2">
              🎯 Applications pratiques
            </h4>
            <ul className="text-white/80 text-sm space-y-1">
              <li>• Modélisation de croissance végétale</li>
              <li>• Simulation de galaxies</li>
              <li>• Design d'antennes fractales</li>
              <li>• Compression d'images</li>
            </ul>

            <h4 className="text-lg font-semibold text-fibonacci-gold mb-2 mt-4">
              🧠 Perception humaine
            </h4>
            <p className="text-white/80 text-sm">
              Notre cerveau reconnaît instinctivement les fractales Fibonacci
              comme "naturelles" et esthétiquement plaisantes.
            </p>
          </div>
        </div>
      </div>

      {/* Exemples dans la nature */}
      <div className="fibonacci-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          🌍 Fractales Fibonacci dans la nature
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Tournesol', pattern: 'Spirales de graines', complexity: 'Élevée' },
            { name: 'Pomme de pin', pattern: 'Écailles en spirale', complexity: 'Moyenne' },
            { name: 'Chou romanesco', pattern: 'Fractales naturelles', complexity: 'Très élevée' },
            { name: 'Galaxie M51', pattern: 'Bras spiraux', complexity: 'Élevée' },
            { name: 'Coquillage', pattern: 'Croissance logarithmique', complexity: 'Moyenne' },
            { name: 'Fougère', pattern: 'Auto-similarité', complexity: 'Élevée' },
            { name: 'Cristaux', pattern: 'Croissance fractale', complexity: 'Variable' },
            { name: 'Vaisseaux sanguins', pattern: 'Réseau fractal', complexity: 'Très élevée' }
          ].map((example, index) => (
            <motion.div
              key={index}
              className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <div className="font-semibold text-white">{example.name}</div>
              <div className="text-white/60 text-sm mt-1">{example.pattern}</div>
              <div className={`text-xs mt-2 px-2 py-1 rounded ${
                example.complexity === 'Très élevée' ? 'bg-red-500/20 text-red-300' :
                  example.complexity === 'Élevée' ? 'bg-orange-500/20 text-orange-300' :
                    example.complexity === 'Moyenne' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-green-500/20 text-green-300'
              }`}>
                {example.complexity}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FibonacciFractalGenerator
