import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const FibonacciCodingExplorer = () => {
  const [inputText, setInputText] = useState('FIBONACCI')
  const [encodedText, setEncodedText] = useState('')
  const [decodedText, setDecodedText] = useState('')
  const [compressionRatio, setCompressionRatio] = useState(0)
  const [isEncoding, setIsEncoding] = useState(false)
  const [fibonacciSequence, setFibonacciSequence] = useState([])
  const [encodingSteps, setEncodingSteps] = useState([])
  const [decodingSteps, setDecodingSteps] = useState([])
  const [compressionComparison, setCompressionComparison] = useState({
    original: 0,
    fibonacci: 0,
    huffman: 0,
    lzw: 0,
    fibonacciRatio: 0,
    huffmanRatio: 0,
    lzwRatio: 0
  })
  const [tutorialStep, setTutorialStep] = useState(0)
  const [codeExample, setCodeExample] = useState('fib')
  const [runResult, setRunResult] = useState(null)
  const [running, setRunning] = useState(false)

  // Générer la suite de Fibonacci
  const generateFibonacci = (n) => {
    const fib = [1, 1]
    for (let i = 2; i < n; i++) {
      fib[i] = fib[i - 1] + fib[i - 2]
    }
    return fib
  }

  // Trouver la représentation Zeckendorf d'un nombre
  const findZeckendorfRepresentation = (n) => {
    const fib = generateFibonacci(20)
    const representation = []
    let remaining = n

    // Trouver le plus grand nombre Fibonacci <= n
    for (let i = fib.length - 1; i >= 0; i--) {
      if (fib[i] <= remaining) {
        representation.push(fib[i])
        remaining -= fib[i]
      }
    }

    return representation.reverse()
  }

  // Encoder un caractère en Fibonacci Coding
  const encodeCharacter = (char) => {
    const charCode = char.charCodeAt(0)
    const zeckendorf = findZeckendorfRepresentation(charCode)
    const fib = generateFibonacci(20)

    // Créer la représentation binaire
    let binary = ''
    let fibIndex = 0

    for (let i = 0; i < zeckendorf.length; i++) {
      // Trouver l'index dans la suite Fibonacci
      while (fib[fibIndex] !== zeckendorf[i]) {
        binary += '0'
        fibIndex++
      }
      binary += '1'
      fibIndex++
    }

    // Terminer avec '11' pour marquer la fin
    binary += '11'

    return {
      character: char,
      charCode: charCode,
      zeckendorf: zeckendorf,
      binary: binary,
      length: binary.length
    }
  }

  // Décoder un caractère depuis Fibonacci Coding
  const decodeCharacter = (binaryString) => {
    const fib = generateFibonacci(20)
    let value = 0
    const i = 0

    // Trouver la fin du caractère (marquée par '11')
    const endIndex = binaryString.indexOf('11')
    if (endIndex === -1) {
      return null
    }

    const charBinary = binaryString.substring(0, endIndex)

    // Convertir la représentation binaire en valeur
    for (let j = 0; j < charBinary.length; j++) {
      if (charBinary[j] === '1') {
        value += fib[j]
      }
    }

    return {
      character: String.fromCharCode(value),
      charCode: value,
      binary: charBinary + '11',
      length: endIndex + 2
    }
  }

  // Encoder le texte complet
  const encodeText = (text) => {
    setIsEncoding(true)
    const steps = []
    let encoded = ''

    for (let i = 0; i < text.length; i++) {
      const char = text[i]
      const encodedChar = encodeCharacter(char)
      steps.push({
        position: i,
        ...encodedChar
      })
      encoded += encodedChar.binary
    }

    setEncodingSteps(steps)
    setEncodedText(encoded)
    setIsEncoding(false)

    // Calculer le ratio de compression
    const originalBits = text.length * 8 // ASCII = 8 bits par caractère
    const compressedBits = encoded.length
    setCompressionRatio(((originalBits - compressedBits) / originalBits) * 100)

    return encoded
  }

  // Décoder le texte complet
  const decodeText = (encoded) => {
    const steps = []
    let decoded = ''
    let position = 0

    while (position < encoded.length) {
      const decodedChar = decodeCharacter(encoded.substring(position))
      if (!decodedChar) {
        break
      }

      steps.push({
        position: decoded.length,
        ...decodedChar
      })

      decoded += decodedChar.character
      position += decodedChar.length
    }

    setDecodingSteps(steps)
    setDecodedText(decoded)
    return decoded
  }

  // Effet pour encoder automatiquement
  useEffect(() => {
    if (inputText) {
      const encoded = encodeText(inputText)
      decodeText(encoded)

      // Calculer la comparaison de compression
      const comparison = compareCompressionMethods(inputText, encoded)
      setCompressionComparison(comparison)
    }
  }, [inputText])

  // Effet pour générer la suite Fibonacci
  useEffect(() => {
    setFibonacciSequence(generateFibonacci(15))
  }, [])

  // Comparer avec d'autres méthodes de compression
  const compareCompressionMethods = (text, fibonacciEncoded) => {
    const fibonacciBits = fibonacciEncoded.length

    // Simulation d'autres méthodes
    const huffmanBits = Math.floor(text.length * 6.5) // Approximation
    const lzwBits = Math.floor(text.length * 5.8) // Approximation
    const originalBits = text.length * 8

    return {
      original: originalBits,
      fibonacci: fibonacciBits,
      huffman: huffmanBits,
      lzw: lzwBits,
      fibonacciRatio: ((originalBits - fibonacciBits) / originalBits) * 100,
      huffmanRatio: ((originalBits - huffmanBits) / originalBits) * 100,
      lzwRatio: ((originalBits - lzwBits) / originalBits) * 100
    }
  }

  const runExample = () => {
    setRunning(true)
    setRunResult(null)
    setTimeout(() => {
      try {
        if (codeExample === 'fib') {
          const fib = generateFibonacci(15)
          setRunResult({ type: 'fib', value: fib, text: `fib(1..15) = [${fib.join(', ')}]` })
        } else if (codeExample === 'zeckendorf') {
          const z = findZeckendorfRepresentation(42)
          setRunResult({ type: 'zeckendorf', value: z, text: `Zeckendorf(42) = ${z.join(' + ')} = 42` })
        } else if (codeExample === 'encode') {
          const enc = encodeCharacter('A')
          setRunResult({ type: 'encode', value: enc, text: `'A' (${enc.charCode}) → ${enc.zeckendorf.join('+')} → ${enc.binary}` })
        }
      } catch (e) {
        setRunResult({ error: e.message })
      }
      setRunning(false)
    }, 300)
  }

  const TUTORIAL_STEPS = [
    { title: 'Qu\'est-ce que le codage de Fibonacci ?', body: 'Le codage de Fibonacci représente des entiers en utilisant la suite de Fibonacci. Chaque entier s\'écrit de façon unique comme somme de nombres de Fibonacci non consécutifs (théorème de Zeckendorf).' },
    { title: 'Représentation de Zeckendorf', body: 'Pour obtenir la représentation de Zeckendorf d\'un nombre n, on soustrait successivement le plus grand nombre de Fibonacci ≤ n. Exemple : 42 = 34 + 8.' },
    { title: 'Encodage binaire', body: 'On représente chaque terme de la somme par un bit 1 à la position correspondante dans la suite de Fibonacci, et on termine par "11" pour marquer la fin du caractère (code sans préfixe).' },
    { title: 'Décodage', body: 'On lit les bits jusqu\'au marqueur "11", on somme les nombres de Fibonacci aux positions des 1, et on obtient le code du caractère (ex. ASCII).' }
  ]

  const CODE_SNIPPETS = {
    fib: `// Générer les n premiers nombres de Fibonacci (hors 0)
function fib(n) {
  const f = [1, 1];
  for (let i = 2; i < n; i++)
    f[i] = f[i-1] + f[i-2];
  return f;
}
// Exemple: fib(10) → [1, 1, 2, 3, 5, 8, 13, 21, 34, 55]`,
    zeckendorf: `// Représentation de Zeckendorf : n comme somme de Fibonacci non consécutifs
function zeckendorf(n) {
  const f = fib(20);
  const repr = [];
  for (let i = f.length - 1; i >= 0; i--)
    if (f[i] <= n) { repr.push(f[i]); n -= f[i]; }
  return repr.reverse();
}
// Exemple: zeckendorf(42) → [34, 8]`,
    encode: `// Encoder un caractère en code Fibonacci (binaire avec marqueur "11")
function encodeChar(c) {
  const code = c.charCodeAt(0);
  const z = zeckendorf(code);
  let binary = "";
  let j = 0;
  for (const v of z) {
    while (f[j] !== v) { binary += "0"; j++; }
    binary += "1"; j++;
  }
  return binary + "11";
}`
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          🔐 Fibonacci Coding Explorer
        </h2>
        <p className="text-white/70 text-lg max-w-3xl mx-auto">
          Découvrez comment la suite de Fibonacci peut encoder efficacement l&apos;information
          grâce à la représentation de Zeckendorf. Un système de compression unique !
        </p>
      </div>

      {/* Tutoriel interactif */}
      <div className="fibonacci-card p-6">
        <h3 className="text-xl font-semibold text-fibonacci-gold mb-4">📚 Tutoriel interactif</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {TUTORIAL_STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setTutorialStep(i)}
              className={`px-3 py-1 rounded text-sm font-medium ${
                tutorialStep === i ? 'bg-fibonacci-gold text-black' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              Étape {i + 1}
            </button>
          ))}
        </div>
        <div className="bg-white/5 p-4 rounded-lg">
          <h4 className="text-fibonacci-gold font-semibold mb-2">{TUTORIAL_STEPS[tutorialStep].title}</h4>
          <p className="text-white/80 text-sm">{TUTORIAL_STEPS[tutorialStep].body}</p>
        </div>
      </div>

      {/* Exemples de code commentés */}
      <div className="fibonacci-card p-6">
        <h3 className="text-xl font-semibold text-fibonacci-gold mb-4">💻 Exemples de code commentés</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.keys(CODE_SNIPPETS).map((key) => (
            <button
              key={key}
              onClick={() => setCodeExample(key)}
              className={`px-3 py-1 rounded text-sm ${
                codeExample === key ? 'bg-fibonacci-gold text-black' : 'bg-white/10 text-white'
              }`}
            >
              {key === 'fib' ? 'Fibonacci' : key === 'zeckendorf' ? 'Zeckendorf' : 'Encode char'}
            </button>
          ))}
        </div>
        <pre className="bg-black/30 p-4 rounded-lg text-sm text-green-300 overflow-x-auto whitespace-pre font-mono">
          {CODE_SNIPPETS[codeExample]}
        </pre>
      </div>

      {/* Exécution directe dans l'interface */}
      <div className="fibonacci-card p-6">
        <h3 className="text-xl font-semibold text-fibonacci-gold mb-4">▶️ Exécuter un exemple</h3>
        <p className="text-white/70 text-sm mb-4">
          Choisissez un exemple et cliquez sur Exécuter pour voir le résultat (calcul côté client, sans envoyer de code).
        </p>
        <div className="flex flex-wrap gap-4 items-center">
          <select
            value={codeExample}
            onChange={(e) => setCodeExample(e.target.value)}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded text-white"
          >
            <option value="fib">Calculer fib(1..15)</option>
            <option value="zeckendorf">Zeckendorf(42)</option>
            <option value="encode">Encoder le caractère &apos;A&apos;</option>
          </select>
          <button
            type="button"
            onClick={runExample}
            disabled={running}
            className="px-4 py-2 rounded font-medium bg-fibonacci-gold text-black hover:opacity-90 disabled:opacity-50"
          >
            {running ? 'Exécution...' : 'Exécuter'}
          </button>
        </div>
        {runResult && (
          <div className="mt-4 p-4 bg-black/20 rounded-lg font-mono text-sm text-green-300">
            {runResult.error ? (
              <span className="text-red-400">Erreur: {runResult.error}</span>
            ) : (
              <div>{runResult.text}</div>
            )}
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="fibonacci-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          📝 Texte à encoder
        </h3>

        <div className="space-y-4">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white resize-none"
            rows={3}
            placeholder="Entrez votre texte ici..."
          />

          <div className="text-sm text-white/60">
            Caractères: {inputText.length} | Bits originaux: {inputText.length * 8}
          </div>
        </div>
      </div>

      {/* Encoding Process */}
      <AnimatePresence>
        {encodingSteps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fibonacci-card p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4">
              🔄 Processus d'encodage
            </h3>

            <div className="space-y-4">
              {encodingSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 p-4 rounded-lg"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-white/60">Caractère:</span>
                      <div className="text-white font-semibold text-lg">{step.character}</div>
                    </div>
                    <div>
                      <span className="text-white/60">Code ASCII:</span>
                      <div className="text-white font-semibold">{step.charCode}</div>
                    </div>
                    <div>
                      <span className="text-white/60">Représentation Zeckendorf:</span>
                      <div className="text-fibonacci-gold font-semibold">
                        {step.zeckendorf.join(' + ')}
                      </div>
                    </div>
                    <div>
                      <span className="text-white/60">Code Fibonacci:</span>
                      <div className="text-orange-400 font-mono text-sm">
                        {step.binary}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <div className="fibonacci-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          📊 Résultats de l'encodage
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Texte encodé */}
          <div className="bg-white/5 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-fibonacci-gold mb-3">
              🔐 Texte encodé
            </h4>
            <div className="bg-black/20 p-3 rounded font-mono text-sm text-green-400 break-all">
              {encodedText}
            </div>
            <div className="text-white/60 text-sm mt-2">
              Longueur: {encodedText.length} bits
            </div>
          </div>

          {/* Texte décodé */}
          <div className="bg-white/5 p-4 rounded-lg">
            <h4 className="text-lg font-semibold text-fibonacci-gold mb-3">
              🔓 Texte décodé
            </h4>
            <div className="bg-black/20 p-3 rounded text-white">
              {decodedText}
            </div>
            <div className="text-white/60 text-sm mt-2">
              Vérification: {decodedText === inputText ? '✅ Correct' : '❌ Erreur'}
            </div>
          </div>
        </div>

        {/* Statistiques de compression */}
        <div className="mt-6 bg-gradient-to-r from-fibonacci-gold/20 to-purple-500/20 p-4 rounded-lg">
          <h4 className="text-lg font-semibold text-fibonacci-gold mb-3">
            📈 Statistiques de compression
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-white/60">Bits originaux:</span>
              <div className="text-white font-semibold">{compressionComparison.original}</div>
            </div>
            <div>
              <span className="text-white/60">Bits Fibonacci:</span>
              <div className="text-orange-400 font-semibold">{compressionComparison.fibonacci}</div>
            </div>
            <div>
              <span className="text-white/60">Compression:</span>
              <div className="text-green-400 font-semibold">
                {compressionRatio.toFixed(1)}%
              </div>
            </div>
            <div>
              <span className="text-white/60">Ratio:</span>
              <div className="text-white font-semibold">
                1:{((compressionComparison.original / compressionComparison.fibonacci)).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparaison avec autres méthodes */}
      <div className="fibonacci-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          ⚖️ Comparaison des méthodes de compression
        </h3>

        <div className="space-y-4">
          {[
            { name: 'ASCII original', bits: compressionComparison.original, ratio: 0, color: 'text-gray-400' },
            { name: 'Fibonacci Coding', bits: compressionComparison.fibonacci, ratio: compressionComparison.fibonacciRatio, color: 'text-orange-400' },
            { name: 'Huffman', bits: compressionComparison.huffman, ratio: compressionComparison.huffmanRatio, color: 'text-blue-400' },
            { name: 'LZW', bits: compressionComparison.lzw, ratio: compressionComparison.lzwRatio, color: 'text-purple-400' }
          ].map((method, index) => (
            <div key={index} className="bg-white/5 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div className={`font-semibold ${method.color}`}>
                  {method.name}
                </div>
                <div className="text-white">
                  {method.bits} bits ({method.ratio.toFixed(1)}% compression)
                </div>
              </div>

              {/* Barre de progression */}
              <div className="mt-2 bg-white/10 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${method.color.replace('text-', 'bg-')}`}
                  style={{ width: `${100 - method.ratio}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suite de Fibonacci utilisée */}
      <div className="fibonacci-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          🔢 Suite de Fibonacci utilisée
        </h3>

        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {fibonacciSequence.map((fib, index) => (
            <motion.div
              key={index}
              className="bg-white/10 p-2 rounded text-center text-white font-semibold"
              whileHover={{ scale: 1.1 }}
            >
              {fib}
            </motion.div>
          ))}
        </div>

        <div className="mt-4 text-white/60 text-sm">
          Les nombres Fibonacci sont utilisés pour créer la représentation de Zeckendorf,
          où chaque entier positif peut être exprimé de manière unique comme somme de nombres
          Fibonacci non consécutifs.
        </div>
      </div>

      {/* Théorie du Fibonacci Coding */}
      <div className="fibonacci-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          🧮 Théorie du Fibonacci Coding
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-semibold text-fibonacci-gold mb-2">
              📐 Représentation de Zeckendorf
            </h4>
            <p className="text-white/80 text-sm mb-4">
              Tout entier positif peut être exprimé de manière unique comme somme de
              nombres Fibonacci non consécutifs. Cette propriété permet un encodage
              sans préfixe optimal.
            </p>

            <h4 className="text-lg font-semibold text-fibonacci-gold mb-2">
              🔗 Code sans préfixe
            </h4>
            <p className="text-white/80 text-sm">
              Le Fibonacci Coding utilise '11' comme marqueur de fin, garantissant
              qu'aucun code n'est préfixe d'un autre. Cela permet un décodage sans ambiguïté.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-fibonacci-gold mb-2">
              ⚡ Avantages
            </h4>
            <ul className="text-white/80 text-sm space-y-1">
              <li>• Encodage sans préfixe optimal</li>
              <li>• Décodage simple et rapide</li>
              <li>• Pas de table de correspondance nécessaire</li>
              <li>• Compression efficace pour certains types de données</li>
            </ul>

            <h4 className="text-lg font-semibold text-fibonacci-gold mb-2 mt-4">
              🎯 Applications
            </h4>
            <ul className="text-white/80 text-sm space-y-1">
              <li>• Compression de données</li>
              <li>• Encodage de séquences</li>
              <li>• Algorithmes de recherche</li>
              <li>• Systèmes de communication</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Exemples pratiques */}
      <div className="fibonacci-card p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          💡 Exemples pratiques
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { text: 'HELLO', description: 'Mot simple' },
            { text: 'FIBONACCI', description: 'Nom de la suite' },
            { text: 'COMPRESSION', description: 'Mot technique' },
            { text: '123456789', description: 'Chiffres' },
            { text: 'ABCDEFGHIJ', description: 'Séquence alphabétique' },
            { text: 'MATHEMATICS', description: 'Mot long' }
          ].map((example, index) => (
            <motion.button
              key={index}
              onClick={() => setInputText(example.text)}
              className="bg-white/5 p-4 rounded-lg text-left hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <div className="font-semibold text-white">{example.text}</div>
              <div className="text-white/60 text-sm">{example.description}</div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FibonacciCodingExplorer
