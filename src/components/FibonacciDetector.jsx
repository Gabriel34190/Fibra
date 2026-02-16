import React, { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  processImage,
  detectCenter,
  detectSpirals,
  detectPhyllotaxis,
  extractFibonacciSequence,
  detectGoldenRatio
} from '../utils/imageAnalysis.js'
import { generateFibonacciSequence, GOLDEN_RATIO } from '../utils/fibonacci.js'

const FibonacciDetector = () => {
  const [image, setImage] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState(null)
  const [overlayVisible, setOverlayVisible] = useState(true)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const fileInputRef = useRef(null)
  const canvasRef = useRef(null)
  const overlayCanvasRef = useRef(null)
  const imageRef = useRef(null)

  const handleFileUpload = useCallback((e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const url = event.target.result
        setImageUrl(url)
        
        const img = new Image()
        img.onload = () => {
          setImage(img)
          imageRef.current = img
        }
        img.src = url
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const analyzeImage = useCallback(async () => {
    if (!image || !canvasRef.current) return

    setAnalyzing(true)
    setResults(null)
    setAnalysisProgress(0)

    try {
      // Step 1: Process image
      setAnalysisProgress(20)
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const canvas = canvasRef.current
      const processed = processImage(image, canvas)
      
      // Step 2: Detect center
      setAnalysisProgress(40)
      await new Promise(resolve => setTimeout(resolve, 50))
      const center = detectCenter(processed)
      const maxRadius = Math.min(processed.width, processed.height) / 2

      // Step 3: Detect phyllotactic patterns
      setAnalysisProgress(60)
      await new Promise(resolve => setTimeout(resolve, 50))
      const phyllotaxis = detectPhyllotaxis(processed, center)
      
      // Step 4: Detect spirals
      setAnalysisProgress(75)
      await new Promise(resolve => setTimeout(resolve, 50))
      const spiralPoints = detectSpirals(processed, center, maxRadius)
      
      // Step 5: Detect golden ratio
      setAnalysisProgress(85)
      await new Promise(resolve => setTimeout(resolve, 50))
      const goldenRatio = detectGoldenRatio(spiralPoints)
      
      // Step 6: Extract Fibonacci sequence
      setAnalysisProgress(90)
      const extractedSequence = extractFibonacciSequence(phyllotaxis)
      const referenceSequence = generateFibonacciSequence(20)

      // Calculate confidence score
      let confidence = 0
      if (phyllotaxis.detected) confidence += 40
      if (goldenRatio.detected) confidence += 30
      if (extractedSequence.length > 0) confidence += 20
      if (spiralPoints.length > 10) confidence += 10

      const analysisResults = {
        phyllotaxis,
        spiralPoints,
        goldenRatio,
        extractedSequence,
        referenceSequence,
        center,
        confidence: Math.min(100, confidence),
        detected: confidence > 30
      }

      setAnalysisProgress(100)
      setResults(analysisResults)
      await new Promise(resolve => setTimeout(resolve, 100))
      drawOverlay(analysisResults)
    } catch (error) {
      console.error('Error analyzing image:', error)
      setResults({
        error: 'Erreur lors de l\'analyse de l\'image',
        detected: false
      })
    } finally {
      setAnalyzing(false)
      setAnalysisProgress(0)
    }
  }, [image])

  const drawOverlay = (results) => {
    if (!overlayCanvasRef.current || !image || !imageRef.current) return

    const overlayCanvas = overlayCanvasRef.current
    const ctx = overlayCanvas.getContext('2d')
    const imgElement = imageRef.current
    
    // Match canvas size to displayed image size
    const displayWidth = imgElement.offsetWidth || image.width
    const displayHeight = imgElement.offsetHeight || image.height
    const scaleX = displayWidth / image.width
    const scaleY = displayHeight / image.height
    
    overlayCanvas.width = displayWidth
    overlayCanvas.height = displayHeight

    ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height)

    if (!overlayVisible) return

    // Scale coordinates to match displayed image
    const scaleCenter = {
      x: results.center.x * scaleX,
      y: results.center.y * scaleY
    }

    // Draw center point
    ctx.fillStyle = '#ff0000'
    ctx.beginPath()
    ctx.arc(scaleCenter.x, scaleCenter.y, 5, 0, Math.PI * 2)
    ctx.fill()

    // Draw detected florets
    if (results.phyllotaxis && results.phyllotaxis.florets) {
      ctx.fillStyle = '#00ff00'
      results.phyllotaxis.florets.forEach(floret => {
        ctx.beginPath()
        ctx.arc(floret.x * scaleX, floret.y * scaleY, 2, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    // Draw golden spiral overlay
    if (results.goldenRatio && results.goldenRatio.detected) {
      ctx.strokeStyle = '#ffff00'
      ctx.lineWidth = 2
      ctx.beginPath()
      
      const maxRadius = Math.min(overlayCanvas.width, overlayCanvas.height) / 2
      
      for (let angle = 0; angle < Math.PI * 4; angle += 0.1) {
        const radius = maxRadius * (angle / (Math.PI * 4)) * 0.7
        const x = scaleCenter.x + radius * Math.cos(angle)
        const y = scaleCenter.y + radius * Math.sin(angle)
        
        if (angle === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()
    }

    // Draw spiral points
    if (results.spiralPoints && results.spiralPoints.length > 0) {
      ctx.strokeStyle = '#00ffff'
      ctx.lineWidth = 1
      ctx.beginPath()
      
      results.spiralPoints.slice(0, 100).forEach((point, idx) => {
        const x = point.x * scaleX
        const y = point.y * scaleY
        if (idx === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()
    }
  }

  const handleOverlayToggle = () => {
    setOverlayVisible(!overlayVisible)
    if (results) {
      setTimeout(() => drawOverlay(results), 100)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fibonacci-card p-8"
    >
      <h2 className="text-3xl font-bold text-white mb-2">
        🌻 Détecteur IA de Patterns Fibonacci
      </h2>
      <p className="text-white/60 text-sm mb-8">
        Analysez des images (tournesols, coquillages, etc.) pour détecter automatiquement la suite de Fibonacci
      </p>

      <div className="space-y-6">
        {/* Upload Section */}
        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
          <label className="block text-white/80 mb-4 font-medium">
            📤 Importer une image :
          </label>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white cursor-pointer hover:bg-white/20 transition"
            accept="image/*"
          />
          <p className="text-white/50 text-xs mt-2">
            Formats supportés : JPG, PNG, WebP. Idéal pour : tournesols, nautilus, pommes de pin, etc.
          </p>
        </div>

        {/* Image Preview and Analysis */}
        {imageUrl && (
          <div className="bg-white/5 p-6 rounded-lg border border-white/10">
            <div className="relative mb-4">
              <div className="relative inline-block max-w-full">
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="Uploaded"
                  className="max-w-full h-auto rounded-lg block"
                  style={{ maxHeight: '500px' }}
                  onLoad={() => {
                    if (results && overlayCanvasRef.current) {
                      drawOverlay(results)
                    }
                  }}
                />
                <canvas
                  ref={canvasRef}
                  className="hidden"
                />
                {overlayVisible && (
                  <canvas
                    ref={overlayCanvasRef}
                    className="absolute top-0 left-0 pointer-events-none rounded-lg"
                    style={{ 
                      maxWidth: '100%', 
                      height: 'auto',
                      imageRendering: 'pixelated'
                    }}
                  />
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4 items-center flex-wrap">
                <button
                  onClick={analyzeImage}
                  disabled={analyzing}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {analyzing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      🔍 Analyser l'image
                    </>
                  )}
                </button>

                {results && (
                  <>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={overlayVisible}
                        onChange={handleOverlayToggle}
                        className="w-4 h-4 rounded accent-fibonacci-gold"
                      />
                      <span className="text-white/80 text-sm">Afficher les overlays</span>
                    </label>
                    <button
                      onClick={() => {
                        setImage(null)
                        setImageUrl(null)
                        setResults(null)
                        if (fileInputRef.current) {
                          fileInputRef.current.value = ''
                        }
                      }}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition text-sm"
                    >
                      🗑️ Réinitialiser
                    </button>
                  </>
                )}
              </div>
              
              {/* Progress bar */}
              {analyzing && (
                <div className="w-full">
                  <div className="flex justify-between text-xs text-white/60 mb-1">
                    <span>Analyse en cours...</span>
                    <span>{analysisProgress}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${analysisProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 p-6 rounded-lg border border-white/10 space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-white text-xl font-semibold">📊 Résultats de l'analyse</h3>
              <div className={`px-4 py-2 rounded-lg font-medium ${
                results.detected
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {results.detected ? '✅ Pattern détecté' : '❌ Aucun pattern détecté'}
              </div>
            </div>

            {results.error ? (
              <p className="text-red-400">{results.error}</p>
            ) : (
              <>
                {/* Confidence Score */}
                <div className="bg-black/20 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/80">Confiance de détection</span>
                    <span className="text-fibonacci-gold font-mono font-bold text-lg">
                      {results.confidence}%
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${results.confidence}%` }}
                    />
                  </div>
                </div>

                {/* Phyllotaxis Results */}
                {results.phyllotaxis && results.phyllotaxis.detected && (
                  <div className="bg-black/20 p-4 rounded-lg">
                    <h4 className="text-fibonacci-gold font-semibold mb-3">🌻 Analyse Phyllotactique</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-white/60">Florets détectés :</span>
                        <span className="text-white ml-2 font-mono">
                          {results.phyllotaxis.florets.length}
                        </span>
                      </div>
                      {results.phyllotaxis.spiralCounts && (
                        <>
                          <div>
                            <span className="text-white/60">Spirales totales :</span>
                            <span className="text-white ml-2 font-mono">
                              {results.phyllotaxis.spiralCounts.total}
                            </span>
                          </div>
                          <div>
                            <span className="text-white/60">Spirales horaires :</span>
                            <span className="text-white ml-2 font-mono">
                              {results.phyllotaxis.spiralCounts.clockwise}
                            </span>
                          </div>
                          <div>
                            <span className="text-white/60">Spirales anti-horaires :</span>
                            <span className="text-white ml-2 font-mono">
                              {results.phyllotaxis.spiralCounts.counterclockwise}
                            </span>
                          </div>
                          {results.phyllotaxis.spiralCounts.fibonacci && (
                            <div className="col-span-2 text-green-400 font-semibold">
                              ✅ Les nombres de spirales correspondent à la suite de Fibonacci !
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Golden Ratio Results */}
                {results.goldenRatio && results.goldenRatio.detected && (
                  <div className="bg-black/20 p-4 rounded-lg">
                    <h4 className="text-fibonacci-gold font-semibold mb-3">✨ Ratio d'Or Détecté</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-white/60">Ratio mesuré :</span>
                        <span className="text-white font-mono">{results.goldenRatio.ratio.toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Ratio d'or théorique (φ) :</span>
                        <span className="text-white font-mono">{GOLDEN_RATIO.toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Confiance :</span>
                        <span className="text-fibonacci-gold font-mono font-semibold">
                          {results.goldenRatio.confidence}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Extracted Fibonacci Sequence */}
                {results.extractedSequence && results.extractedSequence.length > 0 && (
                  <div className="bg-black/20 p-4 rounded-lg">
                    <h4 className="text-fibonacci-gold font-semibold mb-3">🔢 Suite de Fibonacci Extraite</h4>
                    <div className="flex flex-wrap gap-2">
                      {results.extractedSequence.slice(0, 15).map((num, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="px-3 py-1 bg-fibonacci-gold/20 border border-fibonacci-gold/40 rounded text-fibonacci-gold font-mono text-sm"
                        >
                          {num}
                        </motion.div>
                      ))}
                      {results.extractedSequence.length > 15 && (
                        <span className="text-white/60 text-sm self-center">
                          ... (+{results.extractedSequence.length - 15} autres)
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Reference Sequence */}
                <div className="bg-black/20 p-4 rounded-lg">
                  <h4 className="text-fibonacci-gold font-semibold mb-3">📚 Suite de Fibonacci de Référence</h4>
                  <div className="flex flex-wrap gap-2">
                    {results.referenceSequence.slice(0, 15).map((num, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-white/10 border border-white/20 rounded text-white/80 font-mono text-sm"
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Spiral Points Count */}
                <div className="text-white/60 text-sm">
                  <span>Points de spirale détectés : </span>
                  <span className="text-white font-mono">{results.spiralPoints.length}</span>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Instructions */}
        <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
          <h4 className="text-blue-400 font-semibold mb-2">💡 Comment utiliser</h4>
          <ul className="text-white/70 text-sm space-y-1 list-disc list-inside">
            <li>Uploadez une image contenant des patterns naturels (tournesol, nautilus, pomme de pin, etc.)</li>
            <li>Cliquez sur "Analyser l'image" pour lancer la détection automatique</li>
            <li>L'IA détectera les spirales, le ratio d'or et extraira la suite de Fibonacci si présente</li>
            <li>Les overlays colorés montrent les patterns détectés sur l'image</li>
          </ul>
        </div>
      </div>
    </motion.div>
  )
}

export default FibonacciDetector
