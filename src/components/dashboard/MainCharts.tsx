import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BoxPlotChart } from '@/components/charts/BoxPlotChart'
import { DistributionChart } from '@/components/charts/DistributionChart'
import { ScatterPlotChart } from '@/components/charts/ScatterPlotChart'
import { StandardDeviationChart } from '@/components/charts/StandardDeviationChart'
import { ComparativeDisciplinesChart } from '@/components/charts/ComparativeDisciplinesChart'
import { ENRICHED_NOTAS } from '@/lib/mock-data'
import useDashboardStore from '@/stores/useDashboardStore'
import { Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export function MainCharts() {
  const { uete, disciplina } = useDashboardStore()

  const { validGrades, scatterData } = useMemo(() => {
    const grades: number[] = []
    const scatter: { valor: number; name: string }[] = []

    ENRICHED_NOTAS.forEach((n) => {
      if (uete !== 'Todas' && n.aluno.uete !== uete) return
      if (disciplina !== 'Todas' && n.disciplina.nome_disciplina !== disciplina) return

      grades.push(n.valor)
      scatter.push({ valor: n.valor, name: n.aluno.nome_guerra })
    })

    return { validGrades: grades, scatterData: scatter }
  }, [uete, disciplina])

  if (disciplina === 'Todas') {
    return (
      <div className="mt-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <Card className="flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <CardTitle className="text-base">Comparativo de Desempenho por Disciplina</CardTitle>
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#3B82F6]"></div> Acadêmica
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#10B981]"></div> Física
                </span>
              </div>
            </div>
            <CardDescription>
              Média de notas considerando {uete === 'Todas' ? 'todas as UETEs' : `a UETE ${uete}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-end pt-4 pb-2 px-2">
            <ComparativeDisciplinesChart uete={uete} />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div
      className="grid gap-4 md:grid-cols-2 mt-6 animate-fade-in-up"
      style={{ animationDelay: '300ms' }}
    >
      <Card className="flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Histograma de Notas</CardTitle>
          <CardDescription>Frequência versus Curva Normal Teórica</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-end">
          <DistributionChart grades={validGrades} />
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Dispersão de Alunos</CardTitle>
          <CardDescription>Distribuição individual das notas</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-end">
          <ScatterPlotChart gradesData={scatterData} />
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">Boxplot Interativo</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">
                    Exibe a dispersão das notas. A caixa representa os 50% centrais (onde a maioria
                    dos alunos está). Os pontos vermelhos são outliers.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardDescription>Quartis e identificação de extremos</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center pb-8">
          <BoxPlotChart grades={validGrades} />
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Análise de Desvio Padrão</CardTitle>
          <CardDescription>Agrupamento por distância da média</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-end">
          <StandardDeviationChart grades={validGrades} />
        </CardContent>
      </Card>
    </div>
  )
}
