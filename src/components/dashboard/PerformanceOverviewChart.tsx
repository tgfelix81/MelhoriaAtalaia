import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'

export function PerformanceOverviewChart({
  data,
  isLoading,
  isUeteFiltered,
}: {
  data: any[]
  isLoading: boolean
  isUeteFiltered: boolean
}) {
  if (isLoading) return <Skeleton className="h-[350px] w-full rounded-xl" />

  if (!data || data.length === 0)
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Visão Geral de Desempenho</CardTitle>
          <CardDescription>
            {isUeteFiltered
              ? 'Média de desempenho por disciplina'
              : 'Comparativo de desempenho médio por UETE'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
          Nenhum dado encontrado para os filtros selecionados.
        </CardContent>
      </Card>
    )

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Visão Geral de Desempenho</CardTitle>
        <CardDescription>
          {isUeteFiltered
            ? 'Média de desempenho por disciplina'
            : 'Comparativo de desempenho médio por UETE'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ChartContainer config={{ media: { label: 'Média', color: 'hsl(var(--primary))' } }}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(val) => (val.length > 15 ? val.substring(0, 15) + '...' : val)}
              />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} domain={[0, 10]} />
              <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} content={<ChartTooltipContent />} />
              <Bar
                dataKey="media"
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
