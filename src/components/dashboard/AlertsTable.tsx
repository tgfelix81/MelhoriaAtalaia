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
import { MOCK_STUDENTS, AlertDetail } from '@/lib/mock-data'
import useDashboardStore from '@/stores/useDashboardStore'
import {
  calculateMean,
  calculateQuartiles,
  calculateStandardDeviation,
  getAlertLevel,
} from '@/lib/statistics'
import { AlertBadge, ScoreBadge } from './ScoreBadge'
import { Search } from 'lucide-react'

export function AlertsTable() {
  const { turma, disciplina, setFilter } = useDashboardStore()

  const alerts = useMemo(() => {
    // 1. Calculate context statistics per subject/class combinations to be accurate
    // Simplification for the dashboard: we use global stats for the current filter

    const validGrades: {
      studentId: string
      studentName: string
      className: any
      subject: any
      grade: number
    }[] = []

    MOCK_STUDENTS.forEach((student) => {
      if (turma !== 'Todas' && student.className !== turma) return
      student.grades.forEach((g) => {
        if (disciplina !== 'Todas' && g.subject !== disciplina) return
        validGrades.push({
          studentId: student.id,
          studentName: student.name,
          className: student.className,
          subject: g.subject,
          grade: g.value,
        })
      })
    })

    const gradesOnly = validGrades.map((g) => g.grade)
    const mean = calculateMean(gradesOnly)
    const sd = calculateStandardDeviation(gradesOnly, mean)
    const { q1, iqr } = calculateQuartiles(gradesOnly)

    const result: AlertDetail[] = []

    validGrades.forEach((g) => {
      const level = getAlertLevel(g.grade, mean, sd, q1, iqr)
      if (level !== 'Dentro do padrão') {
        result.push({
          ...g,
          mean,
          sd,
          priority: level,
          reason:
            level === 'Outlier negativo'
              ? 'Estatísticamente isolado (q1 - 1.5*iqr)'
              : 'Baixo rendimento comparativo',
        })
      }
    })

    // Sort by severity
    const severity: Record<string, number> = {
      'Prioridade alta': 4,
      'Outlier negativo': 3,
      'Risco pedagógico': 2,
      Atenção: 1,
    }
    return result.sort((a, b) => severity[b.priority] - severity[a.priority])
  }, [turma, disciplina])

  return (
    <Card
      className="animate-fade-in-up flex flex-col min-h-[400px]"
      style={{ animationDelay: '500ms' }}
    >
      <CardHeader>
        <CardTitle className="text-base">Mapeamento de Alertas</CardTitle>
        <CardDescription>Estudantes fora do desvio padrão esperado</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-0 px-6 pb-6">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Search className="h-8 w-8 mb-2 opacity-20" />
            <p>Nenhum alerta para o filtro selecionado.</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Estudante</TableHead>
                  <TableHead>Turma</TableHead>
                  <TableHead>Disciplina</TableHead>
                  <TableHead className="text-right">Nota</TableHead>
                  <TableHead>Classificação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alerts.map((alert, idx) => (
                  <TableRow
                    key={`${alert.studentId}-${alert.subject}-${idx}`}
                    className="cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => setFilter('selectedStudentId', alert.studentId)}
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {alert.studentId}
                    </TableCell>
                    <TableCell className="font-medium">{alert.studentName}</TableCell>
                    <TableCell className="text-muted-foreground">{alert.className}</TableCell>
                    <TableCell>{alert.subject}</TableCell>
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
