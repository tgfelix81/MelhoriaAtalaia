import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, AlertTriangle, Target, TrendingDown, BookOpen } from 'lucide-react'
import useDashboardStore from '@/stores/useDashboardStore'
import { analisarRiscoUete } from '@/lib/edge-function'
import { ENRICHED_NOTAS, DISCIPLINAS_NOMES } from '@/lib/mock-data'
import { calculateMean } from '@/lib/statistics'

export function KPICards() {
  const { uete, disciplina } = useDashboardStore()

  const { stats, lowestDiscipline } = useMemo(() => {
    const analysis = analisarRiscoUete(uete, disciplina)

    let lowest = { name: '-', mean: 10 }
    if (disciplina === 'Todas') {
      const means = DISCIPLINAS_NOMES.map((dName) => {
        const dGrades = ENRICHED_NOTAS.filter(
          (n) =>
            n.disciplina.nome_disciplina === dName && (uete === 'Todas' || n.aluno.uete === uete),
        ).map((n) => n.valor)
        return { name: dName, mean: calculateMean(dGrades) }
      }).filter((d) => d.mean > 0)

      if (means.length > 0) {
        lowest = means.reduce((prev, curr) => (prev.mean < curr.mean ? prev : curr))
      }
    }

    return {
      stats: analysis.estatisticas_gerais,
      lowestDiscipline: lowest,
    }
  }, [uete, disciplina])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card
        className="hover:shadow-md transition-shadow animate-fade-in-up"
        style={{ animationDelay: '0ms' }}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Média Geral</CardTitle>
          <Target className="h-4 w-4 text-[#3B82F6]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">{stats.media.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-1">Média da distribuição atual</p>
        </CardContent>
      </Card>

      <Card
        className="hover:shadow-md transition-shadow animate-fade-in-up"
        style={{ animationDelay: '75ms' }}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Desvio Padrão</CardTitle>
          <Activity className="h-4 w-4 text-[#A855F7]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">{stats.desvio_padrao.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-1">Volatilidade das notas</p>
        </CardContent>
      </Card>

      {disciplina === 'Todas' ? (
        <Card
          className="hover:shadow-md transition-shadow animate-fade-in-up border-orange-200"
          style={{ animationDelay: '150ms' }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Pior Desempenho</CardTitle>
            <BookOpen className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div
              className="text-lg font-bold text-orange-700 truncate"
              title={lowestDiscipline.name}
            >
              {lowestDiscipline.name}
            </div>
            <p className="text-xs text-orange-600/80 mt-1">
              Média: {lowestDiscipline.mean.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card
          className="hover:shadow-md transition-shadow border-amber-200 animate-fade-in-up"
          style={{ animationDelay: '150ms' }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-700">Alertas Ativos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-[#FBBF24]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">
              {stats.num_alertas - stats.num_outliers}
            </div>
            <p className="text-xs text-amber-600/80 mt-1">Atenção ou Risco Moderado</p>
          </CardContent>
        </Card>
      )}

      <Card
        className="hover:shadow-md transition-shadow border-red-200 animate-fade-in-up"
        style={{ animationDelay: '200ms' }}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-700">Apoio Prioritário</CardTitle>
          <TrendingDown className="h-4 w-4 text-[#EF4444]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-700">{stats.num_outliers}</div>
          <p className="text-xs text-red-600/80 mt-1">Outliers negativos extremos</p>
        </CardContent>
      </Card>
    </div>
  )
}
