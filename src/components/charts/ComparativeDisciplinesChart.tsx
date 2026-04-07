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
  Legend,
} from 'recharts'
import { ENRICHED_NOTAS, DISCIPLINAS_ACADEMICAS, DISCIPLINAS_FISICAS } from '@/lib/mock-data'
import { calculateMean } from '@/lib/statistics'

export function ComparativeDisciplinesChart({ uete }: { uete: string }) {
  const data = useMemo(() => {
    const result: any[] = []
    const validGrades =
      uete === 'Todas' ? ENRICHED_NOTAS : ENRICHED_NOTAS.filter((n) => n.aluno.uete === uete)

    DISCIPLINAS_ACADEMICAS.forEach((dName) => {
      const grades = validGrades
        .filter((n) => n.disciplina.nome_disciplina === dName)
        .map((n) => n.valor)
      result.push({
        nome: dName,
        tipo: 'Acadêmica',
        media: calculateMean(grades),
      })
    })

    DISCIPLINAS_FISICAS.forEach((dName) => {
      const grades = validGrades
        .filter((n) => n.disciplina.nome_disciplina === dName)
        .map((n) => n.valor)
      result.push({
        nome: dName,
        tipo: 'Física',
        media: calculateMean(grades),
      })
    })

    return result.filter((d) => d.media > 0).sort((a, b) => b.media - a.media)
  }, [uete])

  if (data.length === 0)
    return (
      <div className="h-full min-h-[300px] flex items-center justify-center text-muted-foreground">
        Sem dados
      </div>
    )

  return (
    <ResponsiveContainer width="100%" height={380}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: -20, bottom: 90 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
        <XAxis
          dataKey="nome"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
          angle={-45}
          textAnchor="end"
          interval={0}
        />
        <YAxis
          domain={[0, 10]}
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
          formatter={(value: number, name: string, props: any) => [
            value.toFixed(2),
            props.payload.tipo,
          ]}
        />
        <Bar dataKey="media" radius={[4, 4, 0, 0]} maxBarSize={40} animationDuration={800}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.tipo === 'Acadêmica' ? '#3B82F6' : '#10B981'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
