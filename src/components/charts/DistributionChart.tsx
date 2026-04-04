import { useMemo } from 'react'
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  calculateMean,
  calculateStandardDeviation,
  calculateNormalDistribution,
} from '@/lib/statistics'

export function DistributionChart({ grades }: { grades: number[] }) {
  const data = useMemo(() => {
    if (grades.length === 0) return []

    const mean = calculateMean(grades)
    const sd = calculateStandardDeviation(grades, mean)

    // Create bins from 0 to 10
    const bins = Array.from({ length: 11 }).map((_, i) => ({
      name: i.toString(),
      val: i,
      frequencia: 0,
      curvaNormal: 0,
    }))

    // Fill histogram
    grades.forEach((g) => {
      const binIndex = Math.min(10, Math.max(0, Math.round(g)))
      bins[binIndex].frequencia++
    })

    // Calculate normal curve
    // Scale curve to match histogram height visually
    const maxFreq = Math.max(...bins.map((b) => b.frequencia)) || 1
    const maxCurve = calculateNormalDistribution(mean, mean, sd) || 1
    const scale = maxFreq / maxCurve

    return bins.map((b) => ({
      ...b,
      curvaNormal: calculateNormalDistribution(b.val, mean, sd) * scale,
    }))
  }, [grades])

  if (grades.length === 0)
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">Sem dados</div>
    )

  return (
    <ResponsiveContainer width="100%" height={240}>
      <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
        />
        <Tooltip
          contentStyle={{
            borderRadius: '8px',
            border: '1px solid hsl(var(--border))',
            fontSize: '12px',
          }}
          formatter={(value: number, name: string) => [
            name === 'frequencia' ? value : '',
            name === 'frequencia' ? 'Alunos' : '',
          ]}
          labelFormatter={(label) => `Nota aprox: ${label}`}
        />
        <Bar
          dataKey="frequencia"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
          animationDuration={800}
        />
        <Line
          type="monotone"
          dataKey="curvaNormal"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={false}
          activeDot={false}
          animationDuration={800}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}
