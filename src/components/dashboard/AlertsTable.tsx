import { useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ENRICHED_NOTAS, AlertDetail } from '@/lib/mock-data'
import useDashboardStore from '@/stores/useDashboardStore'
import {
  calculateMean,
  calculateQuartiles,
  calculateStandardDeviation,
  getAlertLevel,
} from '@/lib/statistics'
import { Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

function ScoreBadge({ score }: { score: number }) {
  let colorClass = 'bg-[#3B82F6]/10 text-[#3B82F6]' // Blue
  if (score < 5)
    colorClass = 'bg-[#EF4444]/10 text-[#EF4444]' // Red
  else if (score < 7) colorClass = 'bg-[#FBBF24]/10 text-[#FBBF24]' // Yellow

  return (
    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${colorClass}`}>
      {score.toFixed(1)}
    </span>
  )
}

function AlertBadge({ level }: { level: string }) {
  let badgeColor = 'bg-slate-100 text-slate-700 hover:bg-slate-200'

  if (level === 'Prioridade alta') badgeColor = 'bg-[#EF4444] text-white hover:bg-[#EF4444]/90'
  else if (level === 'Outlier negativo')
    badgeColor = 'bg-[#EF4444]/80 text-white hover:bg-[#EF4444]/70'
  else if (level === 'Risco pedagógico')
    badgeColor = 'bg-[#F97316] text-white hover:bg-[#F97316]/90'
  else if (level === 'Atenção') badgeColor = 'bg-[#FBBF24] text-amber-900 hover:bg-[#FBBF24]/90'

  return (
    <Badge className={badgeColor} variant="secondary">
      {level}
    </Badge>
  )
}

export function AlertsTable() {
  const { uete, disciplina, tipoProva, setFilter } = useDashboardStore()

  const alerts = useMemo(() => {
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

    const result: AlertDetail[] = []

    validGrades.forEach((g) => {
      const level = getAlertLevel(g.valor, mean, sd, q1, iqr)
      if (level !== 'Dentro do padrão') {
        result.push({
          studentId: g.aluno.id,
          studentName: g.aluno.nome_guerra,
          uete: g.aluno.uete,
          subject: g.disciplina.nome_disciplina,
          examType: g.disciplina.tipo_prova,
          grade: g.valor,
          mean,
          sd,
          priority: level,
          reason:
            level === 'Outlier negativo' || level === 'Prioridade alta'
              ? 'Estatísticamente isolado (Extremo)'
              : 'Baixo rendimento comparativo',
        })
      }
    })

    const severity: Record<string, number> = {
      'Prioridade alta': 4,
      'Outlier negativo': 3,
      'Risco pedagógico': 2,
      Atenção: 1,
    }
    return result.sort((a, b) => severity[b.priority] - severity[a.priority]).slice(0, 100)
  }, [uete, disciplina, tipoProva])

  return (
    <Card
      className="animate-fade-in-up flex flex-col min-h-[400px]"
      style={{ animationDelay: '500ms' }}
    >
      <CardHeader>
        <CardTitle className="text-base">Mapeamento de Alertas e Intervenções</CardTitle>
        <CardDescription>
          Estudantes prioritários que requerem intervenção acadêmica com base no filtro atual
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-0 px-6 pb-6">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Search className="h-8 w-8 mb-2 opacity-20" />
            <p>Nenhum alerta crítico para o filtro selecionado.</p>
          </div>
        ) : (
          <div className="rounded-md border max-h-[500px] overflow-auto relative">
            <Table>
              <TableHeader className="sticky top-0 bg-slate-50 shadow-sm z-10">
                <TableRow className="hover:bg-slate-50">
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Estudante</TableHead>
                  <TableHead>UETE</TableHead>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Prova</TableHead>
                  <TableHead className="text-right">Nota</TableHead>
                  <TableHead>Classificação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert, idx) => (
                  <TableRow
                    key={`${alert.studentId}-${alert.subject}-${alert.examType}-${idx}`}
                    className="cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => setFilter('selectedStudentId', alert.studentId)}
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {alert.studentId}
                    </TableCell>
                    <TableCell className="font-medium whitespace-nowrap">
                      {alert.studentName}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                      {alert.uete}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{alert.subject}</TableCell>
                    <TableCell className="text-xs">{alert.examType}</TableCell>
                    <TableCell className="text-right">
                      <ScoreBadge score={alert.grade} />
                    </TableCell>
                    <TableCell>
                      <AlertBadge level={alert.priority} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
