import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FibonacciClock = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [displayMode, setDisplayMode] = useState('fibonacci')
  const [showSeconds, setShowSeconds] = useState(true)
  const [is24Hour, setIs24Hour] = useState(true)
  const [fibonacciValues, setFibonacciValues] = useState([])
  const [activePlates, setActivePlates] = useState({ hours: [], minutes: [], seconds: [] })

  // Générer la suite de Fibonacci
  const generateFibonacci = (n) => {
    const fib = [1, 2]
    for (let i = 2; i < n; i++) {
      fib[i] = fib[i - 1] + fib[i - 2]
    }
    return fib
  }

  // Convertir un nombre en représentation Zeckendorf (somme de Fibonacci)
  const toZeckendorf = (n) => {
    if (n === 0) return []
    
    const fib = fibonacciValues
    const result = []
    let remaining = n
    
    // Trouver la plus grande représentation possible
    for (let i = fib.length - 1; i >= 0; i--) {
      if (fib[i] <= remaining) {
        result.push(fib[i])
        remaining -= fib[i]
      }
    }
    
    return result.reverse()
  }

  // Mettre à jour l'heure
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Générer les valeurs Fibonacci
  useEffect(() => {
    setFibonacciValues(generateFibonacci(10))
  }, [])

  // Calculer les plaques actives
  useEffect(() => {
    const hours = is24Hour ? currentTime.getHours() : currentTime.getHours() % 12 || 12
    const minutes = currentTime.getMinutes()
    const seconds = currentTime.getSeconds()

    setActivePlates({
      hours: toZeckendorf(hours),
      minutes: toZeckendorf(minutes),
      seconds: showSeconds ? toZeckendorf(seconds) : []
    })
  }, [currentTime, fibonacciValues, is24Hour, showSeconds])

  // Obtenir la couleur d'une plaque
  const getPlateColor = (value, type) => {
    const isActive = activePlates[type].includes(value)
    
    if (isActive) {
      switch (type) {
        case 'hours': return 'bg-red-500'
        case 'minutes': return 'bg-green-500'
        case 'seconds': return 'bg-blue-500'
        default: return 'bg-gray-500'
      }
    }
    
    return 'bg-gray-700'
  }

  // Obtenir la couleur de bordure
  const getBorderColor = (value, type) => {
    const isActive = activePlates[type].includes(value)
    return isActive ? 'border-white' : 'border-gray-600'
  }

  // Formatage de l'heure traditionnelle
  const formatTraditionalTime = () => {
    const hours = is24Hour ? currentTime.getHours() : currentTime.getHours() % 12 || 12
    const minutes = currentTime.getMinutes()
    const seconds = currentTime.getSeconds()
    
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    const secondsString = showSeconds ? `:${seconds.toString().padStart(2, '0')}` : ''
    
    return timeString + secondsString
  }

  // Calculer la somme des plaques actives
  const calculateSum = (type) => {
    return activePlates[type].reduce((sum, value) => sum + value, 0)
  }

  // Vérifier si l'affichage est correct
  const isDisplayCorrect = () => {
    const hours = is24Hour ? currentTime.getHours() : currentTime.getHours() % 12 || 12
    const minutes = currentTime.getMinutes()
    const seconds = currentTime.getSeconds()
    
    return calculateSum('hours') === hours && 
           calculateSum('minutes') === minutes && 
           (!showSeconds || calculateSum('seconds') === seconds)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          ⏰ Fibonacci Clock
        </h2>
        <p className="text-white/70 text-lg max-w-3xl mx-auto">
          Découvrez une nouvelle façon de lire l'heure ! Cette horloge utilise la représentation 
          de Zeckendorf pour afficher le temps avec des plaques de valeurs Fibonacci.
        </p>
      </div>

      {/* Controls */}
      <div className="fibonacci-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Mode d'affichage */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Mode d'affichage
            </label>
            <select
              value={displayMode}
              onChange={(e) => setDisplayMode(e.target.value)}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="fibonacci">⏰ Fibonacci</option>
              <option value="traditional">🕐 Traditionnel</option>
              <option value="both">🔄 Les deux</option>
            </select>
          </div>

          {/* Format d'heure */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Format d'heure
            </label>
            <select
              value={is24Hour ? '24' : '12'}
              onChange={(e) => setIs24Hour(e.target.value === '24')}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="24">24h</option>
              <option value="12">12h</option>
            </select>
          </div>

          {/* Affichage des secondes */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Secondes
            </label>
            <select
              value={showSeconds ? 'yes' : 'no'}
              onChange={(e) => setShowSeconds(e.target.value === 'yes')}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
            >
              <option value="yes">Afficher</option>
              <option value="no">Masquer</option>
            </select>
          </div>

          {/* Statut */}
          <div className="flex items-end">
            <div className="w-full text-center">
              <div className={`text-sm font-semibold ${
                isDisplayCorrect() ? 'text-green-400' : 'text-red-400'
              }`}>
                {isDisplayCorrect() ? '✅ Correct' : '❌ Erreur'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Horloge Fibonacci */}
      <div className="fibonacci-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          ⏰ Horloge Fibonacci
        </h3>
        
        <div className="space-y-8">
          {/* Plaques Fibonacci */}
          <div className="bg-black/20 p-6 rounded-lg">
            <div className="grid grid-cols-5 gap-4">
              {fibonacciValues.map((value, index) => (
                <motion.div
                  key={value}
                  className={`p-4 rounded-lg border-2 text-center transition-all duration-300 ${
                    getPlateColor(value, 'hours')
                  } ${getBorderColor(value, 'hours')}`}
                  animate={{
                    scale: activePlates.hours.includes(value) ? [1, 1.1, 1] : 1
                  }}
                  transition={{ duration: 0.5, repeat: activePlates.hours.includes(value) ? Infinity : 0 }}
                >
                  <div className="text-white font-bold text-lg">{value}</div>
                  <div className="text-white/60 text-xs">F({index + 1})</div>
                </motion.div>
              ))}
            </div>
            
            {/* Légende */}
            <div className="mt-4 flex justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-white/80 text-sm">Heures</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-white/80 text-sm">Minutes</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-white/80 text-sm">Secondes</span>
              </div>
            </div>
          </div>

          {/* Affichage des valeurs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Heures */}
            <div className="bg-white/5 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-red-400 mb-2">
                🕐 Heures
              </h4>
              <div className="text-2xl font-bold text-white mb-2">
                {calculateSum('hours')}
              </div>
              <div className="text-white/60 text-sm">
                Plaques: {activePlates.hours.join(' + ') || '0'}
              </div>
            </div>

            {/* Minutes */}
            <div className="bg-white/5 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-green-400 mb-2">
                ⏱️ Minutes
              </h4>
              <div className="text-2xl font-bold text-white mb-2">
                {calculateSum('minutes')}
              </div>
              <div className="text-white/60 text-sm">
                Plaques: {activePlates.minutes.join(' + ') || '0'}
              </div>
            </div>

            {/* Secondes */}
            <div className="bg-white/5 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-blue-400 mb-2">
                ⏲️ Secondes
              </h4>
              <div className="text-2xl font-bold text-white mb-2">
                {calculateSum('seconds')}
              </div>
              <div className="text-white/60 text-sm">
                Plaques: {activePlates.seconds.join(' + ') || '0'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Affichage traditionnel */}
      <AnimatePresence>
        {(displayMode === 'traditional' || displayMode === 'both') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fibonacci-card p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4">
              🕐 Heure traditionnelle
            </h3>
            
            <div className="text-center">
              <div className="text-6xl font-bold text-fibonacci-gold mb-4">
                {formatTraditionalTime()}
              </div>
              <div className="text-white/60">
                {currentTime.toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explication du système */}
      <div className="fibonacci-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          🧮 Comment lire l'heure Fibonacci ?
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-fibonacci-gold mb-2">
              📐 Représentation de Zeckendorf
            </h4>
            <p className="text-white/80 text-sm mb-4">
              Chaque nombre peut être exprimé de manière unique comme somme de nombres 
              Fibonacci non consécutifs. Par exemple : 7 = 5 + 2, 12 = 8 + 3 + 1
            </p>
            
            <h4 className="text-lg font-semibold text-fibonacci-gold mb-2">
              🎨 Code couleur
            </h4>
            <ul className="text-white/80 text-sm space-y-1">
              <li>• <span className="text-red-400">Rouge</span> : Heures</li>
              <li>• <span className="text-green-400">Vert</span> : Minutes</li>
              <li>• <span className="text-blue-400">Bleu</span> : Secondes</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-fibonacci-gold mb-2">
              🔢 Exemple pratique
            </h4>
            <div className="bg-white/5 p-4 rounded-lg text-sm">
              <div className="text-white/80 mb-2">Si l'heure est 14:35:</div>
              <div className="text-red-400">Heures: 14 = 13 + 1</div>
              <div className="text-green-400">Minutes: 35 = 34 + 1</div>
              <div className="text-white/60 mt-2">
                Les plaques 13, 1, 34 s'allument !
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-fibonacci-gold mb-2 mt-4">
              ⚡ Avantages
            </h4>
            <ul className="text-white/80 text-sm space-y-1">
              <li>• Représentation unique</li>
              <li>• Pas d'ambiguïté</li>
              <li>• Esthétique mathématique</li>
              <li>• Éducatif</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Suite de Fibonacci utilisée */}
      <div className="fibonacci-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          🔢 Suite de Fibonacci utilisée
        </h3>
        
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {fibonacciValues.map((value, index) => (
            <motion.div
              key={value}
              className={`p-3 rounded text-center font-semibold transition-colors ${
                activePlates.hours.includes(value) || 
                activePlates.minutes.includes(value) || 
                activePlates.seconds.includes(value)
                  ? 'bg-fibonacci-gold text-black'
                  : 'bg-white/10 text-white'
              }`}
              whileHover={{ scale: 1.1 }}
            >
              <div>{value}</div>
              <div className="text-xs opacity-60">F({index + 1})</div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-4 text-white/60 text-sm">
          Cette suite permet de représenter n'importe quel nombre de manière unique 
          grâce au théorème de Zeckendorf.
        </div>
      </div>

      {/* Applications pratiques */}
      <div className="fibonacci-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          💡 Applications du Fibonacci Clock
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { 
              title: 'Éducation mathématique', 
              description: 'Apprendre les suites et représentations numériques',
              icon: '🎓'
            },
            { 
              title: 'Design innovant', 
              description: 'Horloges artistiques et conceptuelles',
              icon: '🎨'
            },
            { 
              title: 'Accessibilité', 
              description: 'Alternative pour personnes avec troubles visuels',
              icon: '♿'
            },
            { 
              title: 'Gamification', 
              description: 'Transformer la lecture du temps en jeu',
              icon: '🎮'
            },
            { 
              title: 'Art numérique', 
              description: 'Installations artistiques interactives',
              icon: '🖼️'
            },
            { 
              title: 'Recherche cognitive', 
              description: 'Études sur la perception du temps',
              icon: '🧠'
            }
          ].map((app, index) => (
            <motion.div
              key={index}
              className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-2xl mb-2">{app.icon}</div>
              <div className="font-semibold text-white">{app.title}</div>
              <div className="text-white/60 text-sm mt-1">{app.description}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Défi de lecture */}
      <div className="fibonacci-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          🎯 Défi de lecture
        </h3>
        
        <div className="text-center">
          <p className="text-white/80 mb-4">
            Pouvez-vous lire l'heure Fibonacci sans regarder l'affichage traditionnel ?
          </p>
          
          <div className="bg-white/5 p-4 rounded-lg inline-block">
            <div className="text-2xl font-bold text-fibonacci-gold mb-2">
              {calculateSum('hours')}:{calculateSum('minutes').toString().padStart(2, '0')}
              {showSeconds && `:${calculateSum('seconds').toString().padStart(2, '0')}`}
            </div>
            <div className="text-white/60 text-sm">
              Heure actuelle en Fibonacci
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FibonacciClock
