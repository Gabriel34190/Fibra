import React from 'react'
import { motion } from 'framer-motion'

const Header = () => {
  return (
    <motion.header 
      className="text-center py-12 px-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto">
        <motion.h1 
          className="text-6xl md:text-8xl font-bold mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="bg-gradient-to-r from-fibonacci-gold via-yellow-300 to-fibonacci-gold bg-clip-text text-transparent">
            Fibra
          </span>
        </motion.h1>
        
        <motion.div
          className="text-xl md:text-2xl text-white/80 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <p>Fibonacci Visualization & Creation Engine</p>
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto text-white/70 text-lg leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p>
            Explorez la beauté mathématique de la suite de Fibonacci à travers des visualisations spectaculaires,
            de la musique générée algorithmiquement et des algorithmes d'optimisation avancés.
          </p>
        </motion.div>

        {/* Golden ratio indicator */}
        <motion.div
          className="mt-8 inline-flex items-center gap-4 px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full border border-white/20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">φ</span>
            <span className="text-fibonacci-gold font-mono text-xl">= 1.618...</span>
          </div>
          <div className="w-px h-8 bg-white/30"></div>
          <div className="text-sm text-white/60">
            Le nombre d'or
          </div>
        </motion.div>
      </div>
    </motion.header>
  )
}

export default Header
