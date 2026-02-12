import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import * as Tone from 'tone'
import { 
  generateFibonacciMelody, 
  generateFibonacciChords, 
  createFibonacciComposition,
  generateFibonacciScale 
} from '../utils/fibonacciMusic.js'

const MusicGenerator = ({ count }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [tempo, setTempo] = useState(120)
  const [key, setKey] = useState('C')
  const [instrument, setInstrument] = useState('piano')
  const [currentNote, setCurrentNote] = useState(null)
  const [composition, setComposition] = useState(null)
  
  const synthRef = useRef(null)
  const sequenceRef = useRef(null)

  // Initialize Tone.js and synthesizer
  useEffect(() => {
    const initAudio = async () => {
      if (!isLoaded) {
        await Tone.start()
        
        synthRef.current = new Tone.PolySynth(Tone.Synth, {
          oscillator: {
            type: 'triangle'
          },
          envelope: {
            attack: 0.02,
            decay: 0.1,
            sustain: 0.3,
            release: 1.2
          }
        }).toDestination()

        setIsLoaded(true)
      }
    }

    initAudio()

    return () => {
      if (sequenceRef.current) {
        sequenceRef.current.dispose()
      }
    }
  }, [isLoaded])

  // Generate new composition when count changes
  useEffect(() => {
    if (isLoaded) {
      generateComposition()
    }
  }, [count, key, tempo, instrument])

  const generateComposition = () => {
    const newComposition = createFibonacciComposition({
      melodyLength: Math.min(count, 16),
      chordLength: Math.min(Math.floor(count / 2), 8),
      key,
      tempo,
      instrument
    })
    setComposition(newComposition)
  }

  const playComposition = async () => {
    if (!isLoaded || !composition || isPlaying) return

    setIsPlaying(true)
    
    try {
      // Set tempo
      Tone.Transport.bpm.value = tempo

      // Clear previous sequence
      if (sequenceRef.current) {
        sequenceRef.current.dispose()
      }

      // Create melody sequence
      const melodyPart = new Tone.Part((time, note) => {
        setCurrentNote(`${note.note}${note.octave}`)
        synthRef.current.triggerAttackRelease(
          `${note.note}${note.octave}`, 
          note.duration, 
          time,
          note.velocity
        )
        
        // Clear current note display after duration
        setTimeout(() => setCurrentNote(null), note.duration * 1000)
      }, composition.melody.map((note, index) => ({
        time: index * 0.5, // 0.5 seconds between notes
        ...note
      })))

      // Create chord sequence
      const chordPart = new Tone.Part((time, chord) => {
        chord.notes.forEach(note => {
          synthRef.current.triggerAttackRelease(
            `${note}4`, 
            chord.duration, 
            time - (chord.notes.indexOf(note) * 0.1), // Slight offset for chord effect
            0.5
          )
        })
      }, composition.chords.map((chord, index) => ({
        time: index * 1, // 1 second between chords
        ...chord
      })))

      melodyPart.loop = false
      chordPart.loop = false

      sequenceRef.current = { melodyPart, chordPart }

      melodyPart.start(0)
      chordPart.start(0)

      Tone.Transport.start()

      // Stop when composition ends
      const duration = Math.max(
        composition.melody.length * 0.5,
        composition.chords.length * 1
      )

      setTimeout(() => {
        stopComposition()
      }, duration * 1000 + 2000) // Extra 2 seconds for fade out

    } catch (error) {
      console.error('Error playing composition:', error)
      setIsPlaying(false)
    }
  }

  const stopComposition = () => {
    if (!isPlaying) return

    Tone.Transport.stop()
    Tone.Transport.cancel()

    if (sequenceRef.current) {
      sequenceRef.current.melodyPart?.dispose()
      sequenceRef.current.chordPart?.dispose()
      sequenceRef.current = null
    }

    setCurrentNote(null)
    setIsPlaying(false)
  }

  const playSingleNote = (frequency) => {
    if (!isLoaded) return
    
    synthRef.current.triggerAttackRelease(frequency, '8n')
  }

  const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  const instruments = [
    { value: 'piano', label: 'Piano', icon: '🎹' },
    { value: 'synth', label: 'Synthétiseur', icon: '🎛️' },
    { value: 'bell', label: 'Cloche', icon: '🔔' }
  ]

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="fibonacci-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-fibonacci-gold mb-4">Paramètres</h3>
            
            <div>
              <label className="block text-white/80 text-sm mb-2">Tonalité</label>
              <select
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="fibonacci-input w-full"
                disabled={isPlaying}
              >
                {keys.map(k => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/80 text-sm mb-2">Tempo (BPM)</label>
              <input
                type="range"
                min="60"
                max="180"
                value={tempo}
                onChange={(e) => setTempo(parseInt(e.target.value))}
                className="w-full"
                disabled={isPlaying}
              />
              <div className="text-center mt-2">
                <span className="number-display">{tempo}</span>
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm mb-2">Instrument</label>
              <div className="flex gap-2">
                {instruments.map(inst => (
                  <button
                    key={inst.value}
                    onClick={() => setInstrument(inst.value)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      instrument === inst.value
                        ? 'bg-fibonacci-gold text-black'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    disabled={isPlaying}
                  >
                    <span>{inst.icon}</span>
                    {inst.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-fibonacci-gold mb-4">Contrôles</h3>
            
            <div className="flex gap-4">
              <motion.button
                onClick={isPlaying ? stopComposition : playComposition}
                disabled={!isLoaded || !composition}
                className={`fibonacci-button flex-1 ${!isLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoaded ? (
                  isPlaying ? (
                    <>
                      <span className="mr-2">⏹️</span>
                      Arrêter
                    </>
                  ) : (
                    <>
                      <span className="mr-2">▶️</span>
                      Jouer
                    </>
                  )
                ) : (
                  <>
                    <span className="mr-2">⏳</span>
                    Chargement...
                  </>
                )}
              </motion.button>
            </div>

            {currentNote && (
              <motion.div
                className="text-center p-4 bg-fibonacci-gold/20 rounded-lg border border-fibonacci-gold/30"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <div className="text-2xl font-bold text-fibonacci-gold">{currentNote}</div>
                <div className="text-white/80 text-sm">Note actuelle</div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Composition View */}
      {composition && (
        <div className="fibonacci-card p-6">
          <h2 className="section-title mb-6">Composition Fibonacci</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Melody */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>🎵</span> Mélodie ({composition.melody.length} notes)
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {composition.melody.slice(0, 12).map((note, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-fibonacci-gold font-mono text-sm w-8">{index + 1}</span>
                      <button
                        onClick={() => playSingleNote(note.frequency)}
                        className="flex items-center gap-2 text-white hover:text-fibonacci-gold transition-colors"
                      >
                        <span className="font-semibold">{note.note}{note.octave}</span>
                      </button>
                    </div>
                    <div className="text-white/60 text-sm">
                      {note.frequency.toFixed(1)} Hz
                    </div>
                  </motion.div>
                ))}
                {composition.melody.length > 12 && (
                  <div className="text-center text-white/60 text-sm">
                    ... et {composition.melody.length - 12} notes supplémentaires
                  </div>
                )}
              </div>
            </div>

            {/* Chords */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>🎼</span> Accords ({composition.chords.length} accords)
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {composition.chords.map((chord, index) => (
                  <motion.div
                    key={index}
                    className="p-3 bg-white/5 rounded-lg"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-fibonacci-gold">
                        {chord.root}{chord.type}
                      </span>
                      <span className="text-white/60 text-sm">
                        {chord.duration}s
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {chord.notes.map((note, noteIndex) => (
                        <span
                          key={noteIndex}
                          className="text-xs bg-white/10 px-2 py-1 rounded text-white/80"
                        >
                          {note}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="mt-6 p-4 bg-black/20 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-fibonacci-gold font-semibold">{composition.metadata.key}</div>
                <div className="text-white/60 text-sm">Tonalité</div>
              </div>
              <div>
                <div className="text-fibonacci-gold font-semibold">{composition.metadata.tempo}</div>
                <div className="text-white/60 text-sm">BPM</div>
              </div>
              <div>
                <div className="text-fibonacci-gold font-semibold">{composition.metadata.length}</div>
                <div className="text-white/60 text-sm">Longueur</div>
              </div>
              <div>
                <div className="text-fibonacci-gold font-semibold">{count}</div>
                <div className="text-white/60 text-sm">Termes Fibonacci</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MusicGenerator
