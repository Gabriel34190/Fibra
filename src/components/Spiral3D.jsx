import React from 'react'
import { motion } from 'framer-motion'
import { GOLDEN_RATIO } from '../utils/fibonacci.js'

// Version stable: 3D simulée avec CSS (aucun WebGL)
const Spiral3D = ({ count }) => {
  const rings = Array.from({ length: 12 }, (_, index) => {
    const radius = 40 + index * 18
    const opacity = 0.12 + index * 0.05
    return { radius, opacity }
  })

  const pointCount = Math.min(Math.max(count ?? 12, 8), 32)

  return (
    <div className="space-y-6">
      {/* Header / intro */}
      <div className="fibonacci-card p-6">
        <h2 className="section-title mb-2">Spirale 3D (vue stylisée, ultra stable)</h2>
        <p className="text-white/70 text-sm">
          Rendu 3D simulé à l&apos;aide de transformations CSS et d&apos;animations. 
          Cette version évite complètement WebGL pour ne plus jamais faire planter la page,
          tout en gardant une vraie impression de profondeur.
        </p>
      </div>

      {/* Spirale pseudo‑3D */}
      <div className="fibonacci-card p-6">
        <div className="relative h-96 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-slate-950 via-purple-900/70 to-slate-900">
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              perspective: 900,
            }}
          >
            <div
              className="relative"
              style={{
                transformStyle: 'preserve-3d',
                transform: 'rotateX(65deg)',
              }}
            >
              {rings.map((ring, index) => (
                <motion.div
                  key={index}
                  className="absolute rounded-full border border-fuchsia-400/60 shadow-[0_0_40px_rgba(236,72,153,0.45)]"
                  style={{
                    width: `${ring.radius * 2}px`,
                    height: `${ring.radius * 2}px`,
                    opacity: ring.opacity,
                    filter: 'blur(0.4px)',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                  initial={{ rotateZ: 0, translateZ: -index * 6 }}
                  animate={{
                    rotateZ: 360,
                  }}
                  transition={{
                    duration: 40 + index * 4,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              ))}

              {/* Points de la spirale */}
              {Array.from({ length: pointCount }, (_, i) => {
                const t = i + 1
                const angle = t * GOLDEN_RATIO * 1.1
                const radius = 24 + Math.sqrt(t) * 26

                const x = Math.cos(angle) * radius
                const y = Math.sin(angle) * radius * 0.4
                const z = -i * 5

                const size = 8 + t * 0.6

                return (
                  <motion.div
                    key={i}
                    className="absolute flex items-center justify-center rounded-full bg-fuchsia-400 shadow-[0_0_20px_rgba(244,114,182,0.9)]"
                    style={{
                      width: size,
                      height: size,
                      left: '50%',
                      top: '50%',
                      transform: `translate3d(${x}px, ${y}px, ${z}px)`,
                    }}
                    initial={{ scale: 0.6, opacity: 0.8 }}
                    animate={{ scale: [0.6, 1.05, 0.9], opacity: [0.7, 1, 0.85] }}
                    transition={{
                      duration: 2.6,
                      repeat: Infinity,
                      delay: i * 0.07,
                      ease: 'easeInOut',
                    }}
                  >
                    <span className="text-[8px] font-semibold text-white/90">
                      {t}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/60">
            <span>Points affichés: {pointCount}</span>
            <span>Ratio d&apos;or ≈ {GOLDEN_RATIO.toFixed(3)}</span>
          </div>
        </div>

        <p className="mt-4 text-xs text-white/65 leading-relaxed">
          La profondeur est simulée grâce à la perspective 3D CSS (transformations translate3d / rotateX).
          On voit les points s&apos;éloigner dans l&apos;espace en suivant une spirale contrôlée par le ratio d&apos;or,
          mais sans utiliser de moteur 3D qui pourrait faire planter ton navigateur.
        </p>
      </div>
    </div>
  )
}

export default Spiral3D
