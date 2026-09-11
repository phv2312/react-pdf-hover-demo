import { describe, expect, it } from 'vitest'
import { isNormalizedPolygon, polygonToSvgPoints } from './polygon'

describe('polygon utilities', () => {
  it('pairs the eight coordinates into four SVG points', () => {
    expect(polygonToSvgPoints([0.1, 0.2, 0.8, 0.2, 0.8, 0.4, 0.1, 0.4])).toBe(
      '0.1,0.2 0.8,0.2 0.8,0.4 0.1,0.4',
    )
  })

  it('accepts exactly eight normalized coordinates', () => {
    expect(isNormalizedPolygon([0, 0, 1, 0, 1, 1, 0, 1])).toBe(true)
    expect(isNormalizedPolygon([0, 0, 1, 0])).toBe(false)
    expect(isNormalizedPolygon([0, 0, 1.2, 0, 1, 1, 0, 1])).toBe(false)
  })
})
