/**
 * Core Fibonacci mathematical functions and utilities
 */

/**
 * Generate Fibonacci sequence up to n terms
 * @param {number} n - Number of terms to generate
 * @returns {number[]} Array of Fibonacci numbers
 */
export function generateFibonacciSequence(n) {
  if (n <= 0) {
    return []
  }
  if (n === 1) {
    return [0]
  }
  if (n === 2) {
    return [0, 1]
  }

  const MAX_SAFE = Number.MAX_SAFE_INTEGER || 9007199254740991
  const sequence = [0, 1]
  let usingBigInt = false

  for (let i = 2; i < n; i++) {
    const prev = sequence[i - 1]
    const prev2 = sequence[i - 2]

    if (!usingBigInt) {
      const next = prev + prev2
      // If next would overflow JS safe integer, switch to BigInt mode
      if (next > MAX_SAFE) {
        usingBigInt = true
        // convert all previous values to BigInt to keep array homogeneous
        for (let j = 0; j < sequence.length; j++) {
          sequence[j] = BigInt(sequence[j])
        }
        // now push using BigInt math
        sequence.push(sequence[i - 1] + sequence[i - 2])
      } else {
        sequence.push(next)
      }
    } else {
      // operate with BigInt
      sequence.push(sequence[i - 1] + sequence[i - 2])
    }
  }

  return sequence
}

/**
 * Calculate the nth Fibonacci number using Binet's formula (approximation)
 * @param {number} n - Position in sequence
 * @returns {number} Fibonacci number at position n
 */
export function fibonacciBinet(n) {
  const phi = (1 + Math.sqrt(5)) / 2
  const psi = (1 - Math.sqrt(5)) / 2
  return Math.round((Math.pow(phi, n) - Math.pow(psi, n)) / Math.sqrt(5))
}

/**
 * Calculate the golden ratio (φ = 1.618...)
 */
export const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2

/**
 * Calculate the reciprocal of golden ratio (1/φ = 0.618...)
 */
export const GOLDEN_RATIO_INVERSE = 1 / GOLDEN_RATIO

/**
 * Generate golden spiral coordinates
 * @param {number} t - Parameter for spiral (0 to maxT)
 * @param {number} _maxT - Maximum t value (unused, kept for API compatibility)
 * @param {number} scale - Scale factor
 * @returns {Object} x, y coordinates
 */
export function goldenSpiralCoordinates(t, _maxT = 8 * Math.PI, scale = 1) {
  const theta = t
  const radius = scale * Math.pow(GOLDEN_RATIO, theta / (2 * Math.PI))

  return {
    x: radius * Math.cos(theta),
    y: radius * Math.sin(theta)
  }
}

/**
 * Generate points for a golden rectangle spiral
 * @param {number} n - Number of points to generate
 * @returns {Array} Array of {x, y, width, height, angle} objects
 */
export function goldenRectangleSpiral(n = 20) {
  const rectangles = []
  let width = 1
  let height = 1
  let x = 0
  let y = 0
  let angle = 0

  for (let i = 0; i < n; i++) {
    rectangles.push({
      x,
      y,
      width,
      height,
      angle,
      index: i
    })

    // Rotate and position for next rectangle
    if (i % 4 === 0) {
      // Add right side
      x += width
      width = height * GOLDEN_RATIO_INVERSE
    } else if (i % 4 === 1) {
      // Add bottom side
      height = width * GOLDEN_RATIO_INVERSE
      angle += Math.PI / 2
    } else if (i % 4 === 2) {
      // Add left side
      x -= width - height * GOLDEN_RATIO_INVERSE
      width = height * GOLDEN_RATIO_INVERSE
      angle += Math.PI / 2
    } else {
      // Add top side
      y -= height - width * GOLDEN_RATIO_INVERSE
      height = width * GOLDEN_RATIO_INVERSE
      angle += Math.PI / 2
    }
  }

  return rectangles
}

/**
 * Check if a number is a perfect square
 * @param {number} n - Number to check
 * @returns {boolean}
 */
function isPerfectSquare(n) {
  const s = Math.sqrt(n)
  return s === Math.floor(s)
}

/**
 * Check if a number is a Fibonacci number
 * @param {number} n - Number to check
 * @returns {boolean}
 */
export function isFibonacci(n) {
  return isPerfectSquare(5 * n * n + 4) || isPerfectSquare(5 * n * n - 4)
}

/**
 * Find the closest Fibonacci number to a given value
 * @param {number} n - Target number
 * @returns {number} Closest Fibonacci number
 */
export function closestFibonacci(n) {
  if (n <= 0) {
    return 0
  }
  if (n <= 1) {
    return 1
  }

  let a = 0, b = 1, c = a + b

  while (c < n) {
    a = b
    b = c
    c = a + b
  }

  // Check which is closer
  const diff1 = Math.abs(n - b)
  const diff2 = Math.abs(n - c)

  return diff1 <= diff2 ? b : c
}

/**
 * Calculate the ratio between consecutive Fibonacci numbers
 * @param {number} position - Position in sequence (0-based)
 * @returns {number} Ratio F(n+1)/F(n)
 */
export function fibonacciRatio(position) {
  const sequence = generateFibonacciSequence(position + 2)
  if (sequence.length < 2) {
    return 1
  }

  const current = sequence[position + 1]
  const previous = sequence[position]

  if (previous === 0 || previous === 0n) {
    // return a Number
    return typeof current === 'bigint' ? Number(current) : current
  }

  // Ensure we return a floating point ratio (Number). Convert BigInt to Number if needed.
  if (typeof current === 'bigint' || typeof previous === 'bigint') {
    return Number(current) / Number(previous)
  }

  return current / previous
}

/**
 * Generate 3D coordinates for a Fibonacci sphere
 * @param {number} n - Number of points
 * @param {number} radius - Sphere radius
 * @returns {Array} Array of {x, y, z} coordinates
 */
export function fibonacciSphere(n, radius = 1) {
  const points = []

  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2 // y goes from 1 to -1
    const radiusAtY = Math.sqrt(1 - y * y)

    const theta = GOLDEN_RATIO * i * 2 * Math.PI

    points.push({
      x: radius * Math.cos(theta) * radiusAtY,
      y: radius * y,
      z: radius * Math.sin(theta) * radiusAtY
    })
  }

  return points
}
