import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MOCK_STUDENTS } from '@/lib/mock-data'
import useDashboardStore from '@/stores/useDashboardStore'
import { calculateMean } from '@/lib/statistics'
import { ScoreBadge } from './ScoreBadge'
import { HeartHandshake } from 'lucide-react'

export function RankingList() {
  const { turma, setFilter } = useDashboardStore()

  const ranking = useMemo(() => {
    const students = MOCK_STUDENTS.filter((s) => turma === 'Todas' || s.className === turma).map(
      (s) => {
        const mean = calculateMean(s.grades.map((g) => g.value))
        return { ...s, mean }
      },
    )

    return students.sort((a, b) => a.mean - b.mean).slice(0, 10)
  }, [turma])

  return (
    <Card className="animate-fade-in-up" style={{ animationDelay: '400ms' }}>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <HeartHandshake className="h-5 w-5 text-amber-500" />
          Foco de Apoio Pedagógico
        </CardTitle>
        <CardDescription>Estudantes com as menores médias gerais na seleção atual</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {ranking.map((student, i) => (
            <div
              key={student.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group"
              onClick={() => setFilter('selectedStudentId', student.id)}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-xs font-medium text-slate-500 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">{student.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{student.className}</p>
                </div>
              </div>
              <ScoreBadge score={student.mean} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
