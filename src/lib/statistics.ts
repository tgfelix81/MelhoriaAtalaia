export type AlertLevel = 'Dentro do padrão' | 'Atenção' | 'Risco' | 'Outlier' | 'Prioridade alta'

export function calculateMean(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((sum, val) => sum + val, 0) / values.length
}

export function calculateStandardDeviation(values: number[], mean: number): number {
  if (values.length <= 1) return 0
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
  return Math.sqrt(variance)
}

export function calculateQuartiles(values: number[]) {
  if (values.length === 0) return { min: 0, q1: 0, median: 0, q3: 0, max: 0, iqr: 0 }
  const sorted = [...values].sort((a, b) => a - b)
  const getMedian = (arr: number[]) => {
    const mid = Math.floor(arr.length / 2)
    return arr.length % 2 !== 0 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2
  }

  const median = getMedian(sorted)
  const lowerHalf = sorted.slice(0, Math.floor(sorted.length / 2))
  const upperHalf = sorted.slice(Math.ceil(sorted.length / 2))

  const q1 = getMedian(lowerHalf) || sorted[0]
  const q3 = getMedian(upperHalf) || sorted[sorted.length - 1]
  const iqr = q3 - q1

  return { min: sorted[0], q1, median, q3, max: sorted[sorted.length - 1], iqr }
}

export function getAlertLevel(
  grade: number,
  mean: number,
  sd: number,
  q1: number,
  iqr: number,
): AlertLevel {
  const isOutlier = grade < q1 - 1.5 * iqr
  if (isOutlier && grade < mean - 2 * sd) return 'Prioridade alta'
  if (isOutlier) return 'Outlier'
  if (grade < q1 - 0.5 * iqr) return 'Risco'
  if (grade < mean - 1 * sd) return 'Atenção'
  return 'Dentro do padrão'
}

export function calculateNormalDistribution(x: number, mean: number, sd: number): number {
  if (sd === 0) return 0
  const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(sd, 2))
  return (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(exponent)
}
