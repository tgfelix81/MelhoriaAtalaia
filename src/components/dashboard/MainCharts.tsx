import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BoxPlotChart } from '@/components/charts/BoxPlotChart'
import { DistributionChart } from '@/components/charts/DistributionChart'
import { MOCK_STUDENTS } from '@/lib/mock-data'
import useDashboardStore from '@/stores/useDashboardStore'
import { Info } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export function MainCharts() {
  const { turma, disciplina } = useDashboardStore()

  const validGrades = useMemo(() => {
    const grades: number[] = []
    MOCK_STUDENTS.forEach((student) => {
      if (turma !== 'Todas' && student.className !== turma) return
      student.grades.forEach((g) => {
        if (disciplina !== 'Todas' && g.subject !== disciplina) return
        grades.push(g.value)
      })
    })
    return grades
  }, [turma, disciplina])

  return (
    <div
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mt-4 animate-fade-in-up"
      style={{ animationDelay: '300ms' }}
    >
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
                    dos alunos está). Os pontos vermelhos são outliers, indicando desempenho
                    estatisticamente muito abaixo do resto do grupo.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <CardDescription>Dispersão e identificação de extremos</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center pb-8">
          <BoxPlotChart grades={validGrades} />
        </CardContent>
      </Card>

      <Card className="flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Distribuição de Notas</CardTitle>
          <CardDescription>Frequência versus Curva Normal Teórica</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-end">
          <DistributionChart grades={validGrades} />
        </CardContent>
      </Card>
    </div>
  )
}
