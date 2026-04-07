import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { calculateMean, calculateStandardDeviation } from '@/lib/statistics'

export function StandardDeviationChart({ grades }: { grades: number[] }) {
  const data = useMemo(() => {
    if (grades.length === 0) return []
    const mean = calculateMean(grades)
    const sd = calculateStandardDeviation(grades, mean)

    let bucket1 = 0 // < -2 DP (Prioridade Alta)
    let bucket2 = 0 // -2 a -1 DP (Risco)
    let bucket3 = 0 // -1 DP a Média (Atenção)
    let bucket4 = 0 // > Média (Normal)

    grades.forEach((g) => {
      if (g < mean - 2 * sd) bucket1++
      else if (g < mean - sd) bucket2++
      else if (g < mean) bucket3++
      else bucket4++
    })

    return [
      { name: '< -2 DP', count: bucket1, fill: '#ef4444' }, // Red
      { name: '-2 a -1 DP', count: bucket2, fill: '#eab308' }, // Yellow
      { name: '-1 a Média', count: bucket3, fill: '#3b82f6' }, // Blue
      { name: '> Média', count: bucket4, fill: '#22c55e' }, // Green
    ]
  }, [grades])

  if (grades.length === 0)
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">Sem dados</div>
    )

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
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
          formatter={(value: number) => [value, 'Alunos']}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={50} animationDuration={800}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
