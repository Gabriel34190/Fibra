import { describe, it, expect } from 'vitest'
import { generateFibonacciSequence, fibonacciBinet, GOLDEN_RATIO } from '../fibonacci'

describe('fibonacci utilities', () => {
  describe('generateFibonacciSequence', () => {
    it('should generate empty array for n <= 0', () => {
      expect(generateFibonacciSequence(0)).toEqual([])
      expect(generateFibonacciSequence(-5)).toEqual([])
    })

    it('should generate correct first terms', () => {
      expect(generateFibonacciSequence(1)).toEqual([0])
      expect(generateFibonacciSequence(2)).toEqual([0, 1])
      expect(generateFibonacciSequence(5)).toEqual([0, 1, 1, 2, 3])
      expect(generateFibonacciSequence(10)).toEqual([
        0, 1, 1, 2, 3, 5, 8, 13, 21, 34
      ])
    })

    it('should handle large sequences', () => {
      const seq = generateFibonacciSequence(50)
      expect(seq.length).toBe(50)
      expect(seq[49]).toBeGreaterThan(0)
    })
  })

  describe('fibonacciBinet', () => {
    it('should calculate correct Fibonacci numbers', () => {
      expect(fibonacciBinet(0)).toBe(0)
      expect(fibonacciBinet(1)).toBe(1)
      expect(fibonacciBinet(6)).toBe(8)
      expect(fibonacciBinet(10)).toBe(55)
    })

    it('should handle edge cases', () => {
      expect(fibonacciBinet(20)).toBeGreaterThan(0)
    })
  })

  describe('GOLDEN_RATIO', () => {
    it('should be approximately 1.618', () => {
      expect(GOLDEN_RATIO).toBeCloseTo(1.618, 2)
    })

    it('should satisfy phi^2 = phi + 1', () => {
      const phi = GOLDEN_RATIO
      expect(phi * phi).toBeCloseTo(phi + 1, 5)
    })
  })
})
