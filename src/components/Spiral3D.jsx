import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import * as THREE from 'three'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Text, Sphere } from '@react-three/drei'
import { generateFibonacciSequence, fibonacciSphere, GOLDEN_RATIO } from '../utils/fibonacci.js'

// 3D Fibonacci Spiral Component
function FibonacciSpiral3D({ count, speed = 1 }) {
  const groupRef = useRef()
  const sequence = generateFibonacciSequence(count)
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005 * speed
      groupRef.current.rotation.x += 0.002 * speed
    }
  })

  // Generate 3D spiral points
  const spiralPoints = sequence.slice(0, Math.min(count, 30)).map((fib, index) => {
    const ratio = index / Math.max(1, count - 1)
    const angle = ratio * Math.PI * 4 // Multiple turns
    const radius = fib * 0.1
    const height = index * 0.3
    
    return {
      position: [
        Math.cos(angle) * radius,
        height - (fib * 0.05),
        Math.sin(angle) * radius
      ],
      size: Math.max(0.1, Math.log(fib + 1) * 0.2),
      color: new THREE.Color().setHSL(ratio * 0.3, 0.8, 0.6),
      number: fib
    }
  })

  return (
    <group ref={groupRef}>
      {/* Spiral curve */}
      <mesh>
        <tubeGeometry args={[
          new THREE.CatmullRomCurve3(
            spiralPoints.map(p => new THREE.Vector3(...p.position))
          ),
          64,
          0.05,
          8,
          false
        ]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.2} />
      </mesh>

      {/* Points with Fibonacci numbers */}
      {spiralPoints.map((point, index) => (
        <group key={index}>
          <Sphere position={point.position} args={[point.size]}>
            <meshStandardMaterial color={point.color} emissive={point.color} emissiveIntensity={0.3} />
          </Sphere>
          <Text
            position={[point.position[0], point.position[1] + point.size + 0.2, point.position[2]]}
            fontSize={0.3}
            color="#FFFFFF"
            anchorX="center"
            anchorY="middle"
          >
            {point.number.toString()}
          </Text>
        </group>
      ))}
    </group>
  )
}

// Golden Section Visualization
function GoldenSectionVisual({ count }) {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
    }
  })

  // Create golden rectangle spiral
  const rectangles = []
  let width = 2
  let height = 2
  
  for (let i = 0; i < Math.min(count, 8); i++) {
    rectangles.push({
      width,
      height,
      rotation: i * Math.PI / 2,
      position: [0, 0, -i * 0.1]
    })
    
    if (i % 2 === 0) {
      width = height / GOLDEN_RATIO
    } else {
      height = width / GOLDEN_RATIO
    }
  }

  return (
    <group ref={meshRef}>
      {rectangles.map((rect, index) => (
        <mesh key={index} position={rect.position} rotation={[0, 0, rect.rotation]}>
          <planeGeometry args={[rect.width, rect.height]} />
          <meshStandardMaterial 
            color={`hsl(${index * 45}, 70%, 50%)`}
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
          />
          <mesh position={[rect.width/2, 0, 0.01]}>
            <planeGeometry args={[0.01, rect.height]} />
            <meshStandardMaterial color="#FFD700" />
          </mesh>
        </mesh>
      ))}
    </group>
  )
}

// Fibonacci Sphere Distribution
function FibonacciSphereVisual({ count }) {
  const points = fibonacciSphere(Math.min(count, 100))
  
  return (
    <group>
      {points.map((point, index) => (
        <Sphere 
          key={index}
          position={[point.x * 3, point.y * 3, point.z * 3]}
          args={[0.05]}
        >
          <meshStandardMaterial 
            color={`hsl(${(index / points.length) * 360}, 80%, 60%)`}
            emissive={`hsl(${(index / points.length) * 360}, 80%, 20%)`}
          />
        </Sphere>
      ))}
    </group>
  )
}

const Spiral3D = ({ count }) => {
  const [visualization, setVisualization] = useState('spiral')
  const [speed, setSpeed] = useState(1)
  const [showControls, setShowControls] = useState(true)

  const visualizations = [
    { id: 'spiral', name: 'Spirale 3D', icon: '🌀' },
    { id: 'rectangles', name: 'Rectangles', icon: '⬜' },
    { id: 'sphere', name: 'Sphère', icon: '🌐' }
  ]

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="fibonacci-card p-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            {visualizations.map(viz => (
              <button
                key={viz.id}
                onClick={() => setVisualization(viz.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  visualization === viz.id
                    ? 'bg-fibonacci-gold text-black'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <span className="mr-2">{viz.icon}</span>
                {viz.name}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <span className="text-white/80 text-sm">Vitesse:</span>
              <input
                type="range"
                min="0"
                max="3"
                step="0.1"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-24"
              />
              <span className="text-fibonacci-gold text-sm font-mono w-8">{speed.toFixed(1)}x</span>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showControls}
                onChange={(e) => setShowControls(e.target.checked)}
                className="w-4 h-4 text-fibonacci-gold"
              />
              <span className="text-white text-sm">Contrôles</span>
            </label>
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="fibonacci-card p-6">
        <h2 className="section-title mb-6">Exploration 3D</h2>
        
        <div className="h-96 rounded-lg overflow-hidden border border-white/20">
          <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
            <ambientLight intensity={0.4} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <pointLight position={[-10, -10, -5]} color="#FFD700" intensity={0.5} />
            
            {visualization === 'spiral' && <FibonacciSpiral3D count={count} speed={speed} />}
            {visualization === 'rectangles' && <GoldenSectionVisual count={count} />}
            {visualization === 'sphere' && <FibonacciSphereVisual count={count} />}
            
            {showControls && <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />}
          </Canvas>
        </div>

        {/* Info Panel */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-fibonacci-gold">{count}</div>
            <div className="text-white/80 text-sm">Termes générés</div>
          </div>
          
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">
              {visualization === 'spiral' && '🌀'}
              {visualization === 'rectangles' && '⬜'}
              {visualization === 'sphere' && '🌐'}
            </div>
            <div className="text-white/80 text-sm">Mode actuel</div>
          </div>
          
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-green-400">{GOLDEN_RATIO.toFixed(2)}</div>
            <div className="text-white/80 text-sm">Ratio d'or</div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-black/20 rounded-lg">
          <h3 className="text-lg font-semibold text-fibonacci-gold mb-2">Instructions</h3>
          <ul className="text-white/80 text-sm space-y-1">
            <li>• <strong>Souris:</strong> Cliquez et glissez pour tourner la vue</li>
            <li>• <strong>Molette:</strong> Zoomer/dézoomer</li>
            <li>• <strong>Clic droit + glisser:</strong> Déplacer la vue</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Spiral3D
