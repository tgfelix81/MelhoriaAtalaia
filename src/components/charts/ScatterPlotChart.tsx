import { useMemo } from 'react'
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import {
  calculateMean,
  calculateStandardDeviation,
  calculateQuartiles,
  getAlertLevel,
} from '@/lib/statistics'

export function ScatterPlotChart({
  gradesData,
}: {
  gradesData: { valor: number; name: string }[]
}) {
  const data = useMemo(() => {
    if (gradesData.length === 0) return []
    const gradesOnly = gradesData.map((g) => g.valor)
    const mean = calculateMean(gradesOnly)
    const sd = calculateStandardDeviation(gradesOnly, mean)
    const { q1, iqr } = calculateQuartiles(gradesOnly)

    return gradesData.map((g, i) => {
      const level = getAlertLevel(g.valor, mean, sd, q1, iqr)
      let color = '#3B82F6' // Blue
      if (level === 'Atenção')
        color = '#FBBF24' // Yellow
      else if (level === 'Risco pedagógico')
        color = '#F97316' // Orange
      else if (level === 'Outlier negativo' || level === 'Prioridade alta') color = '#EF4444' // Red

      return {
        index: i,
        valor: g.valor,
        name: g.name,
        color,
      }
    })
  }, [gradesData])

  if (data.length === 0)
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">Sem dados</div>
    )

  return (
    <ResponsiveContainer width="100%" height={240}>
      <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
        <XAxis dataKey="index" type="number" hide />
        <YAxis
          dataKey="valor"
          type="number"
          domain={[0, 10]}
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          cursor={{ strokeDasharray: '3 3' }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const row = payload[0].payload
              return (
                <div className="bg-background border border-border p-2 rounded-md shadow-sm text-xs">
                  <p className="font-medium">{row.name}</p>
                  <p>Nota: {row.valor.toFixed(1)}</p>
                </div>
              )
            }
            return null
          }}
        />
        <Scatter data={data} fill="#8884d8">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} opacity={0.7} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  )
}
