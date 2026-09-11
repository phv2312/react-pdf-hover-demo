import type { Polygon } from '../types'

export function polygonToSvgPoints(polygon: Polygon): string {
  const points: string[] = []

  for (let index = 0; index < polygon.length; index += 2) {
    points.push(`${polygon[index]},${polygon[index + 1]}`)
  }

  return points.join(' ')
}

export function isNormalizedPolygon(polygon: readonly number[]): polygon is Polygon {
  return polygon.length === 8 && polygon.every((coordinate) => coordinate >= 0 && coordinate <= 1)
}
