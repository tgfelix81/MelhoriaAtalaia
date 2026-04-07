import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Users } from 'lucide-react'
import { cn } from '@/lib/utils'

export function StudentRiskCards({ alunos, isLoading }: { alunos: any[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (!alunos || alunos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-slate-50 rounded-xl border border-dashed">
        <Users className="h-8 w-8 mb-2 opacity-20" />
        <p className="text-sm text-center">Nenhum aluno em risco encontrado.</p>
      </div>
    )
  }

  const getColor = (classif: string) => {
    switch (classif) {
      case 'Atenção':
        return 'bg-yellow-400 text-yellow-950 border-yellow-400'
      case 'Risco':
        return 'bg-orange-500 text-white border-orange-500'
      case 'Outlier':
        return 'bg-red-600 text-white border-red-600'
      case 'Prioridade alta':
        return 'bg-purple-600 text-white border-purple-600'
      default:
        return 'bg-slate-200 text-slate-800 border-slate-200'
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2 pb-2">
      {alunos.map((aluno, idx) => {
        const colorClasses = getColor(aluno.classificacao)
        const borderClass = colorClasses.split(' ').find((c) => c.startsWith('border-'))

        return (
          <Card
            key={`${aluno.id}-${aluno.disciplina}-${idx}`}
            className={cn('animate-fade-in-up overflow-hidden border-l-4', borderClass)}
            style={{ animationDelay: `${(idx % 10) * 50}ms` }}
          >
            <CardContent className="p-4 flex flex-col justify-between h-full gap-2">
              <div>
                <div className="font-semibold text-sm truncate" title={aluno.nome_guerra}>
                  {aluno.numero} - {aluno.nome_guerra}
                </div>
                <div className="text-xs text-muted-foreground truncate" title={aluno.disciplina}>
                  {aluno.disciplina}
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-lg font-bold">{aluno.nota.toFixed(1)}</span>
                <Badge className={colorClasses} variant="outline">
                  {aluno.classificacao}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
