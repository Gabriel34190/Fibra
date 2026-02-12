import React, { useState } from 'react'
import { motion } from 'framer-motion'

const FibonacciComposer = () => {
  const [composition, setComposition] = useState({
    name: '',
    notes: [],
    tempo: 120
  })
  const [saved, setSaved] = useState(false)

  const addNote = () => {
    setComposition(prev => ({
      ...prev,
      notes: [...prev.notes, Math.floor(Math.random() * 88) + 21]
    }))
  }

  const removeNote = (index) => {
    setComposition(prev => ({
      ...prev,
      notes: prev.notes.filter((_, i) => i !== index)
    }))
  }

  const saveComposition = () => {
    // Logique pour sauvegarder la composition
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fibonacci-card p-8"
    >
      <h2 className="text-3xl font-bold text-white mb-8">Compositeur Fibonacci</h2>

      <div className="space-y-6">
        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
          <label className="block text-white/80 mb-2">Nom de la composition:</label>
          <input
            type="text"
            value={composition.name}
            onChange={(e) => setComposition(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Entrez un nom..."
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-white/30"
          />
        </div>

        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
          <label className="block text-white/80 mb-2">Tempo:</label>
          <input
            type="range"
            min="40"
            max="300"
            value={composition.tempo}
            onChange={(e) => setComposition(prev => ({ ...prev, tempo: parseInt(e.target.value) }))}
            className="w-full h-2 bg-white/20 rounded-lg"
          />
          <p className="text-center text-white mt-2">{composition.tempo} BPM</p>
        </div>

        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
          <button
            onClick={addNote}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition mb-4"
          >
            Ajouter une note
          </button>

          {composition.notes.length > 0 && (
            <div className="mt-4">
              <p className="text-white/80 mb-3">Notes: ({composition.notes.length})</p>
              <div className="flex flex-wrap gap-2">
                {composition.notes.map((note, index) => (
                  <div key={index} className="bg-white/20 px-3 py-1 rounded text-white text-sm flex items-center gap-2">
                    {note}
                    <button
                      onClick={() => removeNote(index)}
                      className="text-white/60 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={saveComposition}
          className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition font-semibold"
        >
          {saved ? '✓ Sauvegardée' : 'Sauvegarder la composition'}
        </button>
      </div>
    </motion.div>
  )
}

export default FibonacciComposer
