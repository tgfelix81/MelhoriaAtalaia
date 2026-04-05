import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, AlertTriangle, Target, TrendingDown } from 'lucide-react'
import { ENRICHED_NOTAS } from '@/lib/mock-data'
import useDashboardStore from '@/stores/useDashboardStore'
import {
  calculateMean,
  calculateQuartiles,
  calculateStandardDeviation,
  getAlertLevel,
} from '@/lib/statistics'

export function KPICards() {
  const { uete, disciplina, tipoProva } = useDashboardStore()

  const stats = useMemo(() => {
    let alerts = 0
    let outliers = 0

    const validGrades = ENRICHED_NOTAS.filter((n) => {
      if (uete !== 'Todas' && n.aluno.uete !== uete) return false
      if (disciplina !== 'Todas' && n.disciplina.nome_disciplina !== disciplina) return false
      if (tipoProva !== 'Todas' && n.disciplina.tipo_prova !== tipoProva) return false
      return true
    })

    const gradesOnly = validGrades.map((g) => g.valor)
    const mean = calculateMean(gradesOnly)
    const sd = calculateStandardDeviation(gradesOnly, mean)
    const { q1, iqr } = calculateQuartiles(gradesOnly)

    validGrades.forEach((g) => {
      const level = getAlertLevel(g.valor, mean, sd, q1, iqr)
      if (level !== 'Dentro do padrão') alerts++
      if (level === 'Outlier negativo' || level === 'Prioridade alta') outliers++
    })

    return { mean, sd, alerts, outliers }
  }, [uete, disciplina, tipoProva])

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
          <div className="text-2xl font-bold text-slate-900">{stats.mean.toFixed(2)}</div>
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
          <div className="text-2xl font-bold text-slate-900">{stats.sd.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-1">Volatilidade das notas</p>
        </CardContent>
      </Card>

      <Card
        className="hover:shadow-md transition-shadow border-amber-200 animate-fade-in-up"
        style={{ animationDelay: '150ms' }}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-amber-700">Alertas Ativos</CardTitle>
          <AlertTriangle className="h-4 w-4 text-[#FBBF24]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-700">{stats.alerts}</div>
          <p className="text-xs text-amber-600/80 mt-1">Atenção ou Risco Moderado</p>
        </CardContent>
      </Card>

      <Card
        className="hover:shadow-md transition-shadow border-red-200 animate-fade-in-up"
        style={{ animationDelay: '200ms' }}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-700">Apoio Prioritário</CardTitle>
          <TrendingDown className="h-4 w-4 text-[#EF4444]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-700">{stats.outliers}</div>
          <p className="text-xs text-red-600/80 mt-1">Outliers negativos extremos</p>
        </CardContent>
      </Card>
    </div>
  )
}
