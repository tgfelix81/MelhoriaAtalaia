import { useEffect, useState } from 'react'
import { KPICards } from '@/components/dashboard/KPICards'
import { InstructorsTable } from '@/components/dashboard/InstructorsTable'
import { FilterBar } from '@/components/dashboard/FilterBar'
import { StudentRiskCards } from '@/components/dashboard/StudentRiskCards'
import { RiskBarChart } from '@/components/dashboard/RiskBarChart'
import { PerformanceOverviewChart } from '@/components/dashboard/PerformanceOverviewChart'
import { RiskLegend } from '@/components/dashboard/RiskLegend'
import { StandardDeviationChart } from '@/components/charts/StandardDeviationChart'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { DataManagement } from '@/components/dashboard/DataManagement'
import useDashboardStore from '@/stores/useDashboardStore'
import { processDashboardData } from '@/lib/data-processor'

export default function Index() {
  const { uete, disciplina } = useDashboardStore()
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setIsLoading(true)

    // Simulating async fetch for real-world like behavior
    setTimeout(() => {
      if (mounted) {
        const res = processDashboardData(uete, disciplina)
        setData(res)
        setIsLoading(false)
      }
    }, 400)

    return () => {
      mounted = false
    }
  }, [uete, disciplina])

  return (
    <div className="space-y-6 pb-12 pt-6 px-4 md:px-8 max-w-[1400px] mx-auto animate-fade-in">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Dashboard Analítico Pedagógico
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Monitoramento de desempenho, alertas e intervenções por UETE e disciplina.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <FilterBar />
          <DataManagement />
        </div>
      </div>

      <KPICards data={data?.estatisticas_gerais} isLoading={isLoading} />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PerformanceOverviewChart
            data={data?.performanceOverview}
            isLoading={isLoading}
            isUeteFiltered={uete !== 'Todas'}
          />
        </div>
        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Distribuição Estatística (DP)</CardTitle>
              <CardDescription>Alunos por desvio padrão em relação à média</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-2">
              {isLoading ? (
                <div className="h-[240px] flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                </div>
              ) : (
                <StandardDeviationChart grades={data?.allGrades || []} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <RiskLegend />
      </div>

      <div className="mt-8 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4 border-b pb-2">
            Alunos e Matérias em Risco
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
            <div className="lg:col-span-2 space-y-6">
              <RiskBarChart data={data?.riskByDiscipline} isLoading={isLoading} />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800">Alunos Identificados</h3>
                <StudentRiskCards alunos={data?.alunos_risco} isLoading={isLoading} />
              </div>
            </div>
            <div className="lg:col-span-1">
              <InstructorsTable data={data?.instrutores_atencao} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
