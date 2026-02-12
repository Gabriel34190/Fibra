/**
 * Fibonacci-based music generation utilities
 */

// Note frequencies for equal temperament
const NOTE_FREQUENCIES = {
  'C': 261.63,   'C#': 277.18,  'D': 293.66,   'D#': 311.13,
  'E': 329.63,   'F': 349.23,   'F#': 369.99,  'G': 392.00,
  'G#': 415.30,  'A': 440.00,   'A#': 466.16,  'B': 493.88
}

const SCALE_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B']
const CHROMATIC_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

/**
 * Generate musical notes based on Fibonacci sequence
 * @param {number} length - Number of notes to generate
 * @param {string} baseNote - Starting note (default: 'C')
 * @param {number} octave - Starting octave (default: 4)
 * @returns {Array} Array of note objects
 */
export function generateFibonacciMelody(length = 16, baseNote = 'C', octave = 4) {
  const sequence = generateFibonacciSequence(length + 1, 1, 13) // modulo 12 for chromatic scale
  const melody = []

  for (let i = 0; i < length; i++) {
    const fibValue = sequence[i] % 12
    const noteIndex = (CHROMATIC_NOTES.indexOf(baseNote) + fibValue) % 12
    const noteOctave = octave + Math.floor((CHROMATIC_NOTES.indexOf(baseNote) + fibValue) / 12)
    const note = CHROMATIC_NOTES[noteIndex]

    melody.push({
      note,
      octave: noteOctave,
      frequency: getNoteFrequency(note, noteOctave),
      duration: getFibonacciRhythm(i),
      velocity: 0.7 + (sequence[i] % 3) * 0.1 // Dynamic velocity based on sequence
    })
  }

  return melody
}

/**
 * Generate Fibonacci sequence with custom starting values
 */
function generateFibonacciSequence(length, start1 = 1, start2 = 1, modulo = null) {
  if (length === 0) {
    return []
  }
  if (length === 1) {
    return [start1]
  }
  if (length === 2) {
    return [start1, start2]
  }

  const sequence = [start1, start2]
  for (let i = 2; i < length; i++) {
    const next = sequence[i - 1] + sequence[i - 2]
    sequence.push(modulo ? next % modulo : next)
  }
  return sequence
}

/**
 * Get note frequency based on note name and octave
 */
function getNoteFrequency(note, octave) {
  const baseFreq = NOTE_FREQUENCIES[note.replace(/#/g, '#')]
  return baseFreq * Math.pow(2, octave - 4)
}

/**
 * Generate rhythm based on Fibonacci sequence
 */
function getFibonacciRhythm(position) {
  const rhythmPatterns = [0.25, 0.5, 0.75, 1.0, 1.5] // Quarter, half, dotted quarter, whole, dotted half
  const fibValue = generateFibonacciSequence(position + 3, 1, 1)[position + 2]
  return rhythmPatterns[fibValue % rhythmPatterns.length]
}

/**
 * Generate chord progression based on Fibonacci
 * @param {number} count - Number of chords
 * @param {string} key - Musical key
 * @returns {Array} Array of chord objects
 */
export function generateFibonacciChords(count = 8, key = 'C') {
  const majorScaleIntervals = [0, 2, 4, 5, 7, 9, 11]
  const chordTypes = ['maj', 'min', 'maj', 'min', 'min', 'maj', 'dim']

  const chords = []
  const sequence = generateFibonacciSequence(count + 10, 1, 1, 7) // modulo 7 for scale degrees

  for (let i = 0; i < count; i++) {
    const scaleDegree = sequence[i] % 7
    const rootInterval = majorScaleIntervals[scaleDegree]
    const rootNote = getNoteFromInterval(key, rootInterval)
    const chordType = chordTypes[scaleDegree]

    chords.push({
      root: rootNote,
      type: chordType,
      notes: generateChordNotes(rootNote, chordType),
      duration: getFibonacciRhythm(i) * 2 // Longer duration for chords
    })
  }

  return chords
}

/**
 * Get note name from root note and interval
 */
function getNoteFromInterval(rootNote, interval) {
  const rootIndex = CHROMATIC_NOTES.indexOf(rootNote)
  const noteIndex = (rootIndex + interval) % 12
  return CHROMATIC_NOTES[noteIndex]
}

/**
 * Generate chord notes based on root and type
 */
function generateChordNotes(root, type) {
  const rootIndex = CHROMATIC_NOTES.indexOf(root)
  const notes = [root]

  if (type === 'maj') {
    notes.push(CHROMATIC_NOTES[(rootIndex + 4) % 12]) // Major third
    notes.push(CHROMATIC_NOTES[(rootIndex + 7) % 12]) // Perfect fifth
  } else if (type === 'min') {
    notes.push(CHROMATIC_NOTES[(rootIndex + 3) % 12]) // Minor third
    notes.push(CHROMATIC_NOTES[(rootIndex + 7) % 12]) // Perfect fifth
  } else if (type === 'dim') {
    notes.push(CHROMATIC_NOTES[(rootIndex + 3) % 12]) // Minor third
    notes.push(CHROMATIC_NOTES[(rootIndex + 6) % 12]) // Diminished fifth
  }

  return notes
}

/**
 * Create a complete musical piece combining melody and chords
 * @param {Object} options - Generation options
 * @returns {Object} Complete musical piece
 */
export function createFibonacciComposition(options = {}) {
  const {
    melodyLength = 16,
    chordLength = 8,
    key = 'C',
    tempo = 120,
    instrument = 'piano'
  } = options

  const melody = generateFibonacciMelody(melodyLength, key, 4)
  const chords = generateFibonacciChords(chordLength, key)

  return {
    melody,
    chords,
    metadata: {
      key,
      tempo,
      instrument,
      timeSignature: '4/4',
      length: Math.max(melody.length, chords.length)
    }
  }
}

/**
 * Convert composition to MIDI-like representation
 */
export function compositionToMIDI(composition) {
  const midiEvents = []
  let currentTime = 0

  // Add melody events
  composition.melody.forEach((note) => {
    midiEvents.push({
      type: 'noteOn',
      time: currentTime,
      note: note.note,
      octave: note.octave,
      frequency: note.frequency,
      velocity: note.velocity,
      duration: note.duration
    })

    currentTime += note.duration
  })

  // Add chord events
  currentTime = 0
  composition.chords.forEach((chord) => {
    chord.notes.forEach(note => {
      midiEvents.push({
        type: 'chordOn',
        time: currentTime,
        note: note,
        chordType: chord.type,
        duration: chord.duration
      })
    })

    currentTime += chord.duration
  })

  return {
    events: midiEvents,
    duration: currentTime,
    metadata: composition.metadata
  }
}

/**
 * Generate musical scale based on Fibonacci ratios
 * @param {string} rootNote - Root note of the scale
 * @returns {Array} Array of frequency ratios
 */
export function generateFibonacciScale(rootNote = 'C') {
  const goldenRatio = (1 + Math.sqrt(5)) / 2
  const scale = []

  // Start with root frequency
  const rootFreq = NOTE_FREQUENCIES[rootNote]

  for (let i = 0; i < 8; i++) {
    const ratio = Math.pow(goldenRatio, i / 6) // Spread over octave
    scale.push({
      note: rootNote,
      octave: Math.floor(4 + i / 6),
      frequency: rootFreq * ratio,
      ratio: ratio
    })
  }

  return scale
}
