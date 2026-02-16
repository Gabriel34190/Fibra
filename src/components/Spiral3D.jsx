import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Float } from '@react-three/drei'
import { generateFibonacciSequence, fibonacciSphere, GOLDEN_RATIO } from '../utils/fibonacci.js'

const GOLDEN_ANGLE = (2 * Math.PI) / (GOLDEN_RATIO * GOLDEN_RATIO) // ~137.5° en rad

// ——— 1. Spirale dorée 3D (hélice dont le rayon suit Fibonacci) ———
function GoldenSpiral3D({ count, speed, wireframe }) {
  const groupRef = useRef()
  const tubeRef = useRef()
  const sequence = useMemo(() => generateFibonacciSequence(Math.min(count, 25)), [count])

  const { curve, points } = useMemo(() => {
    const pts = []
    const scale = 0.25
    let radius = 0
    let angle = 0
    let height = 0

    for (let i = 0; i < sequence.length; i++) {
      const fib = Number(sequence[i] ?? 0)
      radius = Math.sqrt(fib + 1) * scale
      angle += GOLDEN_ANGLE
      height += 0.15
      pts.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      ))
    }

    const curve = pts.length >= 2
      ? new THREE.CatmullRomCurve3(pts, false)
      : null
    return { curve, points: pts }
  }, [sequence])

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2 * speed
    }
  })

  return (
    <group ref={groupRef}>
      {curve && (
        <mesh ref={tubeRef}>
          <tubeGeometry args={[curve, 64, 0.08, 16, false]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#b45309"
            emissiveIntensity={0.3}
            metalness={0.2}
            roughness={0.6}
            wireframe={wireframe}
          />
        </mesh>
      )}

      {points.map((pos, i) => {
        const fib = Number(sequence[i] ?? 0)
        const size = Math.max(0.06, Math.log(fib + 1) * 0.06)
        const hue = (i / Math.max(1, points.length - 1)) * 0.15 + 0.1
        return (
          <Float key={i} speed={1.5} floatIntensity={0.2}>
            <mesh position={pos}>
              <sphereGeometry args={[size, 16, 16]} />
              <meshStandardMaterial
                color={new THREE.Color().setHSL(hue, 0.9, 0.5)}
                emissive={new THREE.Color().setHSL(hue, 0.8, 0.2)}
                emissiveIntensity={0.4}
                metalness={0.3}
                roughness={0.5}
              />
            </mesh>
          </Float>
        )
      })}
    </group>
  )
}

// ——— 2. Escalier / rectangles de Fibonacci en 3D (cubes en spirale) ———
function FibonacciStaircase3D({ count, speed }) {
  const groupRef = useRef()
  const sequence = useMemo(() => generateFibonacciSequence(Math.min(count, 12)), [count])

  const boxes = useMemo(() => {
    const list = []
    let x = 0
    let z = 0
    let angle = 0
    const scale = 0.35

    for (let i = 0; i < sequence.length; i++) {
      const fib = Number(sequence[i] ?? 1)
      const size = Math.max(0.3, Math.min(fib, 8) * scale * 0.5)

      list.push({
        position: [x, size / 2, z],
        size: [size, size, size * 0.3],
        angle,
        index: i,
        value: fib
      })

      angle += Math.PI / 2
      const step = size
      x += Math.cos(angle) * step
      z += Math.sin(angle) * step
    }

    return list
  }, [sequence])

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15 * speed
    }
  })

  return (
    <group ref={groupRef}>
      {boxes.map((box, i) => {
        const hue = (i / Math.max(1, boxes.length)) * 0.12 + 0.08
        return (
          <group key={i} position={box.position} rotation={[0, box.angle, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={box.size} />
              <meshStandardMaterial
                color={new THREE.Color().setHSL(hue, 0.85, 0.5)}
                emissive={new THREE.Color().setHSL(hue, 0.6, 0.15)}
                emissiveIntensity={0.2}
                metalness={0.2}
                roughness={0.7}
              />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

// ——— 3. Sphère Fibonacci (distribution des points sur une sphère) ———
function FibonacciSphere3D({ count, speed }) {
  const groupRef = useRef()
  const n = Math.min(Math.max(count, 10), 200)
  const points = useMemo(() => fibonacciSphere(n, 2.2), [n])

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.25 * speed
    }
  })

  return (
    <group ref={groupRef}>
      {points.map((p, i) => {
        const hue = (i / points.length) * 0.3 + 0.5
        return (
          <mesh
            key={i}
            position={[p.x, p.y, p.z]}
            castShadow
          >
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial
              color={new THREE.Color().setHSL(hue, 0.9, 0.55)}
              emissive={new THREE.Color().setHSL(hue, 0.7, 0.2)}
              emissiveIntensity={0.3}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// Grille au sol optionnelle
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#1e1b4b" metalness={0} roughness={1} />
    </mesh>
  )
}

// Contenu 3D selon le mode
function Scene({ mode, count, speed, wireframe, showFloor }) {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[8, 12, 6]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-5, 5, 5]} color="#fbbf24" intensity={0.4} />
      <pointLight position={[5, -5, -5]} color="#a78bfa" intensity={0.2} />

      {showFloor && <Floor />}

      {mode === 'spiral' && (
        <GoldenSpiral3D count={count} speed={speed} wireframe={wireframe} />
      )}
      {mode === 'staircase' && (
        <FibonacciStaircase3D count={count} speed={speed} />
      )}
      {mode === 'sphere' && (
        <FibonacciSphere3D count={count} speed={speed} />
      )}

      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={2}
        maxDistance={25}
        maxPolarAngle={Math.PI * 0.98}
        minPolarAngle={0.05}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.5}
      />
    </>
  )
}

const Spiral3D = ({ count }) => {
  const [mode, setMode] = useState('spiral')
  const [speed, setSpeed] = useState(1)
  const [wireframe, setWireframe] = useState(false)
  const [showFloor, setShowFloor] = useState(true)
  const canvasRef = useRef(null)

  const onCreated = useCallback((state) => {
    // Configure renderer properly
    if (state.gl) {
      state.gl.shadowMap.enabled = true
      state.gl.shadowMap.type = THREE.PCFSoftShadowMap
    }
  }, [])

  // Cleanup on unmount to prevent WebGL context issues
  useEffect(() => {
    return () => {
      // Cleanup function
    }
  }, [])

  const modes = [
    { id: 'spiral', label: 'Spirale dorée 3D', icon: '🌀' },
    { id: 'staircase', label: 'Escalier Fibonacci', icon: '📐' },
    { id: 'sphere', label: 'Sphère Fibonacci', icon: '🌐' }
  ]

  return (
    <div className="space-y-6">
      <div className="fibonacci-card p-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {modes.map((m) => (
              <motion.button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  mode === m.id
                    ? 'bg-fibonacci-gold text-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="mr-2">{m.icon}</span>
                {m.label}
              </motion.button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2">
              <span className="text-white/80 text-sm">Vitesse</span>
              <input
                type="range"
                min={0}
                max={2.5}
                step={0.1}
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-24 accent-fibonacci-gold"
              />
              <span className="text-fibonacci-gold text-sm font-mono w-10">
                {speed.toFixed(1)}x
              </span>
            </label>

            {mode === 'spiral' && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={wireframe}
                  onChange={(e) => setWireframe(e.target.checked)}
                  className="w-4 h-4 rounded accent-fibonacci-gold"
                />
                <span className="text-white text-sm">Fil de fer</span>
              </label>
            )}

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showFloor}
                onChange={(e) => setShowFloor(e.target.checked)}
                className="w-4 h-4 rounded accent-fibonacci-gold"
              />
              <span className="text-white text-sm">Sol</span>
            </label>
          </div>
        </div>
      </div>

      <div className="fibonacci-card p-6">
        <h2 className="section-title mb-6">Exploration 3D</h2>

        <div className="relative w-full rounded-xl overflow-hidden border border-white/20 bg-slate-900/50">
          <div className="w-full aspect-[4/3]" style={{ minHeight: '420px' }}>
            <Canvas
              ref={canvasRef}
              gl={{
                antialias: true,
                alpha: false,
                powerPreference: 'high-performance',
                preserveDrawingBuffer: false
              }}
              camera={{
                position: [6, 5, 6],
                fov: 50,
                near: 0.1,
                far: 100
              }}
              shadows
              dpr={[1, 2]}
              onCreated={onCreated}
              frameloop="always"
              performance={{ min: 0.5 }}
            >
              <Scene
                mode={mode}
                count={count}
                speed={speed}
                wireframe={wireframe}
                showFloor={showFloor}
              />
            </Canvas>
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end pointer-events-none">
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 text-white/90 text-sm">
              Termes: <span className="text-fibonacci-gold font-mono">{count}</span>
              {' · '} φ = {GOLDEN_RATIO.toFixed(4)}
            </div>
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2 text-white/70 text-xs">
              Souris: tourner · Molette: zoom · Clic droit: déplacer
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-black/20 rounded-lg">
          <h3 className="text-fibonacci-gold font-semibold mb-2">Modes 3D</h3>
          <ul className="text-white/80 text-sm space-y-1">
            <li><strong>Spirale dorée 3D</strong> — Hélice dont le rayon suit la suite de Fibonacci (angle d’or ~137,5°).</li>
            <li><strong>Escalier Fibonacci</strong> — Cubes dont les tailles suivent la suite, disposés en spirale (rectangles d’or en 3D).</li>
            <li><strong>Sphère Fibonacci</strong> — Répartition de points sur une sphère avec l’angle d’or (phyllotaxie).</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Spiral3D
