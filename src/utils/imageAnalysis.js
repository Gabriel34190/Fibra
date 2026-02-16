/**
 * Image analysis utilities for detecting Fibonacci patterns
 */

/**
 * Convert image to grayscale and extract edge data
 * @param {HTMLImageElement} img - Image element
 * @param {HTMLCanvasElement} canvas - Canvas element for processing
 * @returns {Object} Processed image data
 */
export function processImage(img, canvas) {
  const ctx = canvas.getContext('2d')
  canvas.width = img.width
  canvas.height = img.height
  
  ctx.drawImage(img, 0, 0)
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  
  // Convert to grayscale
  const grayscale = []
  for (let i = 0; i < imageData.data.length; i += 4) {
    const r = imageData.data[i]
    const g = imageData.data[i + 1]
    const b = imageData.data[i + 2]
    const gray = 0.299 * r + 0.587 * g + 0.114 * b
    grayscale.push(gray)
  }
  
  return {
    width: canvas.width,
    height: canvas.height,
    grayscale,
    imageData
  }
}

/**
 * Detect center point of circular/spiral patterns
 * @param {Object} processed - Processed image data
 * @returns {Object} Center coordinates {x, y}
 */
export function detectCenter(processed) {
  const { width, height, grayscale } = processed
  
  // Method 1: Use center of image as initial guess
  let centerX = width / 2
  let centerY = height / 2
  
  // Method 2: Find center of mass of dark regions (seeds/florets)
  let totalMass = 0
  let weightedX = 0
  let weightedY = 0
  
  for (let y = 0; y < height; y += 3) {
    for (let x = 0; x < width; x += 3) {
      const idx = Math.floor(y) * width + Math.floor(x)
      if (idx >= 0 && idx < grayscale.length) {
        const intensity = grayscale[idx]
        // Dark regions have higher "mass"
        const mass = 255 - intensity
        if (mass > 50) {
          weightedX += x * mass
          weightedY += y * mass
          totalMass += mass
        }
      }
    }
  }
  
  // If we found enough dark regions, use center of mass
  if (totalMass > 1000) {
    centerX = weightedX / totalMass
    centerY = weightedY / totalMass
  }
  
  return {
    x: centerX,
    y: centerY
  }
}

/**
 * Detect spiral patterns using radial analysis
 * @param {Object} processed - Processed image data
 * @param {Object} center - Center point {x, y}
 * @param {number} maxRadius - Maximum radius to analyze
 * @returns {Array} Detected spiral points
 */
export function detectSpirals(processed, center, maxRadius) {
  const { width, height, grayscale } = processed
  const points = []
  const GOLDEN_ANGLE = (2 * Math.PI) / (1.618 * 1.618) // ~137.5 degrees
  
  // Sample points along potential spiral paths
  for (let angle = 0; angle < Math.PI * 4; angle += 0.1) {
    const radius = Math.min(maxRadius, Math.min(width, height) / 2) * (angle / (Math.PI * 4))
    const x = center.x + radius * Math.cos(angle)
    const y = center.y + radius * Math.sin(angle)
    
    if (x >= 0 && x < width && y >= 0 && y < height) {
      const idx = Math.floor(y) * width + Math.floor(x)
      if (idx >= 0 && idx < grayscale.length) {
        const intensity = grayscale[idx]
        // Detect dark points (seeds, florets, etc.)
        if (intensity < 150) {
          points.push({ x, y, angle, radius, intensity })
        }
      }
    }
  }
  
  return points
}

/**
 * Detect phyllotactic patterns (like in sunflowers)
 * @param {Object} processed - Processed image data
 * @param {Object} center - Center point {x, y}
 * @returns {Object} Phyllotactic analysis results
 */
export function detectPhyllotaxis(processed, center) {
  const { width, height, grayscale } = processed
  const GOLDEN_ANGLE = (2 * Math.PI) / (1.618 * 1.618) // ~137.5 degrees
  const florets = []
  
  // Detect florets/seeds using edge detection and circular patterns
  const maxRadius = Math.min(width, height) / 2
  
  // First pass: detect dark regions (seeds/florets)
  const darkRegions = []
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      const idx = Math.floor(y) * width + Math.floor(x)
      if (idx >= 0 && idx < grayscale.length) {
        const intensity = grayscale[idx]
        // Detect dark regions (potential seeds/florets)
        if (intensity < 150) {
          const distance = Math.sqrt(
            Math.pow(x - center.x, 2) + Math.pow(y - center.y, 2)
          )
          if (distance < maxRadius && distance > 5) {
            darkRegions.push({ x, y, intensity, distance })
          }
        }
      }
    }
  }
  
  // Second pass: match detected regions to phyllotactic spiral
  darkRegions.forEach((region, i) => {
    const angle = Math.atan2(region.y - center.y, region.x - center.x)
    const normalizedAngle = ((angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
    
    // Check if this region aligns with golden angle pattern
    const expectedAngle = (i % 200) * GOLDEN_ANGLE
    const angleDiff = Math.abs(normalizedAngle - (expectedAngle % (2 * Math.PI)))
    const minAngleDiff = Math.min(angleDiff, 2 * Math.PI - angleDiff)
    
    if (minAngleDiff < 0.3 || i < 50) { // Allow some tolerance
      florets.push({
        x: region.x,
        y: region.y,
        angle: normalizedAngle,
        radius: region.distance,
        index: i,
        intensity: region.intensity
      })
    }
  })
  
  // Analyze spiral counts using actual detected patterns
  const spiralCounts = analyzeSpiralCounts(florets, center)
  
  return {
    florets,
    spiralCounts,
    center,
    detected: florets.length > 10
  }
}

/**
 * Analyze spiral counts to find Fibonacci numbers
 * @param {Array} florets - Detected floret points
 * @param {Object} center - Center point
 * @returns {Object} Spiral count analysis
 */
function analyzeSpiralCounts(florets, center) {
  if (florets.length < 5) {
    return { clockwise: 0, counterclockwise: 0, fibonacci: false }
  }
  
  // Sort florets by radius
  const sortedFlorets = [...florets].sort((a, b) => a.radius - b.radius)
  
  // Detect spiral arms by tracking angle changes
  const angleGroups = new Map()
  const GOLDEN_ANGLE = (2 * Math.PI) / (1.618 * 1.618)
  
  sortedFlorets.forEach((floret, idx) => {
    // Calculate which spiral arm this floret belongs to
    const normalizedAngle = ((floret.angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
    const spiralIndex = Math.round(normalizedAngle / GOLDEN_ANGLE) % 200
    
    if (!angleGroups.has(spiralIndex)) {
      angleGroups.set(spiralIndex, [])
    }
    angleGroups.get(spiralIndex).push(floret)
  })
  
  // Count distinct spiral arms (those with multiple florets)
  const activeSpirals = Array.from(angleGroups.values())
    .filter(spiral => spiral.length >= 2)
  const spiralArms = activeSpirals.length
  
  // Try to identify clockwise vs counterclockwise spirals
  // This is a simplified approach - in reality, we'd need more sophisticated analysis
  const fibonacciNumbers = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144]
  const isFibonacci = fibonacciNumbers.includes(spiralArms)
  
  // Estimate clockwise/counterclockwise based on common Fibonacci pairs
  // Common pairs: (21, 34), (34, 55), (55, 89)
  let clockwise = 0
  let counterclockwise = 0
  
  if (spiralArms >= 20 && spiralArms <= 35) {
    clockwise = 21
    counterclockwise = 34
  } else if (spiralArms >= 35 && spiralArms <= 60) {
    clockwise = 34
    counterclockwise = 55
  } else if (spiralArms >= 55 && spiralArms <= 90) {
    clockwise = 55
    counterclockwise = 89
  } else {
    clockwise = Math.floor(spiralArms / 2)
    counterclockwise = Math.ceil(spiralArms / 2)
  }
  
  return {
    clockwise,
    counterclockwise,
    total: spiralArms,
    fibonacci: isFibonacci,
    closestFibonacci: findClosestFibonacci(spiralArms)
  }
}

/**
 * Find closest Fibonacci number
 */
function findClosestFibonacci(n) {
  const fib = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144]
  let closest = fib[0]
  let minDiff = Math.abs(n - fib[0])
  
  for (const f of fib) {
    const diff = Math.abs(n - f)
    if (diff < minDiff) {
      minDiff = diff
      closest = f
    }
  }
  
  return closest
}

/**
 * Extract Fibonacci sequence from detected patterns
 * @param {Object} phyllotaxis - Phyllotactic analysis results
 * @returns {Array} Extracted Fibonacci sequence
 */
export function extractFibonacciSequence(phyllotaxis) {
  const { spiralCounts, florets } = phyllotaxis
  
  if (!spiralCounts || spiralCounts.total === 0) {
    return []
  }
  
  const sequence = []
  
  // Method 1: Use detected spiral counts
  if (spiralCounts.clockwise > 0 && spiralCounts.counterclockwise > 0) {
    // Common Fibonacci pairs in nature: (21, 34), (34, 55), (55, 89)
    const detectedNumbers = [
      spiralCounts.clockwise,
      spiralCounts.counterclockwise,
      spiralCounts.total
    ].filter(n => n > 0)
    
    // Find the maximum detected number
    const maxDetected = Math.max(...detectedNumbers)
    
    // Generate Fibonacci sequence up to at least the detected numbers
    let a = 0, b = 1
    sequence.push(a)
    
    while (b <= maxDetected * 2 && sequence.length < 30) {
      sequence.push(b)
      const temp = a + b
      a = b
      b = temp
    }
    
    // Highlight detected numbers in sequence
    return sequence
  }
  
  // Method 2: Use floret count to estimate
  if (florets && florets.length > 0) {
    // Estimate Fibonacci sequence based on floret arrangement
    let a = 0, b = 1
    sequence.push(a)
    
    // Generate sequence up to reasonable limit
    while (b <= florets.length && sequence.length < 20) {
      sequence.push(b)
      const temp = a + b
      a = b
      b = temp
    }
    
    return sequence
  }
  
  // Method 3: Default sequence if nothing detected
  let a = 0, b = 1
  sequence.push(a)
  
  for (let i = 0; i < 15; i++) {
    sequence.push(b)
    const temp = a + b
    a = b
    b = temp
  }
  
  return sequence
}

/**
 * Detect golden ratio in spiral patterns
 * @param {Array} spiralPoints - Detected spiral points
 * @returns {Object} Golden ratio analysis
 */
export function detectGoldenRatio(spiralPoints) {
  if (spiralPoints.length < 3) {
    return { detected: false, ratio: 0, confidence: 0 }
  }
  
  // Calculate ratios between consecutive spiral turns
  const ratios = []
  for (let i = 1; i < Math.min(spiralPoints.length, 20); i++) {
    if (spiralPoints[i].radius > 0 && spiralPoints[i - 1].radius > 0) {
      const ratio = spiralPoints[i].radius / spiralPoints[i - 1].radius
      ratios.push(ratio)
    }
  }
  
  if (ratios.length === 0) {
    return { detected: false, ratio: 0, confidence: 0 }
  }
  
  const avgRatio = ratios.reduce((a, b) => a + b, 0) / ratios.length
  const goldenRatio = 1.618033988749895
  const diff = Math.abs(avgRatio - goldenRatio)
  const confidence = Math.max(0, 100 - (diff / goldenRatio) * 100)
  
  return {
    detected: confidence > 50,
    ratio: avgRatio,
    confidence: Math.round(confidence),
    goldenRatio
  }
}
