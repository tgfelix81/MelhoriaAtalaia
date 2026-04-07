import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'

export function RiskBarChart({ data, isLoading }: { data: any[]; isLoading: boolean }) {
  if (isLoading) return <Skeleton className="h-[350px] w-full rounded-xl" />

  if (!data || data.length === 0) return null

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Alunos em Risco por Disciplina</CardTitle>
        <CardDescription>
          Distribuição de alertas e outliers nas disciplinas da UETE selecionada
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ChartContainer config={{ risk: { label: 'Alunos', color: 'hsl(var(--primary))' } }}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="disciplina"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(val) => (val.length > 15 ? val.substring(0, 15) + '...' : val)}
              />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
              <Bar
                dataKey="alunosEmRisco"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
