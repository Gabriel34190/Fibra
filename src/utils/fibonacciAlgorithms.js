/**
 * Fibonacci-based algorithms and optimizations
 */

/**
 * Fibonacci Search Algorithm for finding optimal value in unimodal function
 * @param {Function} func - Function to optimize (should be unimodal)
 * @param {number} left - Left boundary
 * @param {number} right - Right boundary
 * @param {number} precision - Search precision (default: 1e-6)
 * @param {number} maxIterations - Maximum iterations (default: 100)
 * @returns {Object} Result with optimal point, value, and iterations
 */
export function fibonacciSearch(func, left, right, precision = 1e-6, maxIterations = 100) {
  const iterations = []
  let a = left
  let b = right

  // Find the smallest n such that F(n) >= (b - a) / precision
  let n = 1
  while (fibonacciNumber(n) < (b - a) / precision && n < maxIterations) {
    n++
  }

  let x1 = a + (fibonacciNumber(n - 2) / fibonacciNumber(n)) * (b - a)
  let x2 = a + (fibonacciNumber(n - 1) / fibonacciNumber(n)) * (b - a)

  for (let i = 0; i < n - 1; i++) {
    const f1 = func(x1)
    const f2 = func(x2)

    iterations.push({
      iteration: i + 1,
      a,
      b,
      x1,
      x2,
      f1,
      f2,
      range: b - a
    })

    if (f1 < f2) {
      b = x2
      x2 = x1
      x1 = a + (fibonacciNumber(n - i - 3) / fibonacciNumber(n - i - 1)) * (b - a)
    } else {
      a = x1
      x1 = x2
      x2 = a + (fibonacciNumber(n - i - 2) / fibonacciNumber(n - i - 1)) * (b - a)
    }
  }

  const optimal = (a + b) / 2

  return {
    optimal,
    value: func(optimal),
    iterations: iterations.length,
    details: iterations
  }
}

/**
 * Helper function to get nth Fibonacci number
 */
function fibonacciNumber(n) {
  if (n <= 1) {
    return 1
  }
  let a = 1, b = 1
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b]
  }
  return b
}

/**
 * Fibonacci Heap Node structure simulation
 */
class FibonacciHeapNode {
  constructor(key, value) {
    this.key = key
    this.value = value
    this.degree = 0
    this.marked = false
    this.parent = null
    this.child = null
    this.left = this
    this.right = this
  }
}

/**
 * Simplified Fibonacci Heap implementation for demonstration
 */
export class FibonacciHeap {
  constructor() {
    this.min = null
    this.n = 0
    this.operations = []
  }

  insert(key, value = null) {
    const node = new FibonacciHeapNode(key, value)

    if (this.min === null) {
      this.min = node
    } else {
      this.addToRootList(node)
      if (node.key < this.min.key) {
        this.min = node
      }
    }

    this.n++
    this.operations.push({
      type: 'insert',
      key,
      totalNodes: this.n,
      description: `Inserted node with key ${key}`
    })

    return node
  }

  extractMin() {
    const z = this.min
    if (z !== null) {
      // Add children to root list
      if (z.child !== null) {
        let current = z.child
        do {
          const next = current.right
          this.addToRootList(current)
          current.parent = null
          current = next
        } while (current !== z.child)
      }

      // Remove z from root list
      this.removeFromRootList(z)

      if (z === z.right) {
        this.min = null
      } else {
        this.min = z.right
        this.consolidate()
      }

      this.n--

      this.operations.push({
        type: 'extractMin',
        extractedKey: z.key,
        totalNodes: this.n,
        description: `Extracted minimum key: ${z.key}`
      })
    }

    return z
  }

  addToRootList(node) {
    if (this.min === null) {
      this.min = node
    } else {
      node.right = this.min.right
      node.left = this.min
      this.min.right.left = node
      this.min.right = node
    }
  }

  removeFromRootList(node) {
    node.left.right = node.right
    node.right.left = node.left
  }

  consolidate() {
    const A = new Array(Math.floor(Math.log2(this.n)) + 2)

    let current = this.min
    const visited = new Set()

    do {
      let x = current
      let degree = x.degree

      while (A[degree] !== undefined) {
        let y = A[degree]
        if (x.key > y.key) {
          [x, y] = [y, x]
        }
        this.heapLink(y, x)
        A[degree] = undefined
        degree++
      }

      A[degree] = x
      current = current.right
    } while (!visited.has(current) && (visited.add(current), true))

    this.min = null
    for (let i = 0; i < A.length; i++) {
      if (A[i] !== undefined) {
        if (this.min === null) {
          this.min = A[i]
        } else if (A[i].key < this.min.key) {
          this.min = A[i]
        }
      }
    }
  }

  heapLink(y, x) {
    this.removeFromRootList(y)
    y.parent = x

    if (x.child === null) {
      x.child = y
      y.left = y.right = y
    } else {
      y.right = x.child.right
      y.left = x.child
      x.child.right.left = y
      x.child.right = y
    }

    x.degree++
    y.marked = false
  }

  getOperations() {
    return this.operations
  }
}

/**
 * Golden Section Search - optimization using golden ratio
 * @param {Function} func - Function to minimize
 * @param {number} a - Left boundary
 * @param {number} b - Right boundary
 * @param {number} tolerance - Convergence tolerance
 * @param {number} maxIterations - Maximum iterations
 * @returns {Object} Optimization result
 */
export function goldenSectionSearch(func, a, b, tolerance = 1e-6, maxIterations = 100) {
  const phi = (1 + Math.sqrt(5)) / 2 // Golden ratio
  const resphi = 2 - phi

  const iterations = []
  let x1 = a + resphi * (b - a)
  let x2 = a + phi * resphi * (b - a)
  let f1 = func(x1)
  let f2 = func(x2)

  let iteration = 0

  while (Math.abs(b - a) > tolerance && iteration < maxIterations) {
    iteration++

    iterations.push({
      iteration,
      a,
      b,
      x1,
      x2,
      f1,
      f2,
      range: b - a
    })

    if (f1 < f2) {
      b = x2
      x2 = x1
      x1 = a + resphi * (b - a)
      f2 = f1
      f1 = func(x1)
    } else {
      a = x1
      x1 = x2
      x2 = a + phi * resphi * (b - a)
      f1 = f2
      f2 = func(x2)
    }
  }

  const optimal = (a + b) / 2

  return {
    optimal,
    value: func(optimal),
    iterations: iteration,
    details: iterations
  }
}
