import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Users, FilterX } from 'lucide-react'
import { cn } from '@/lib/utils'
import useDashboardStore from '@/stores/useDashboardStore'
import { Button } from '@/components/ui/button'

export function StudentRiskCards({ alunos, isLoading }: { alunos: any[]; isLoading: boolean }) {
  const { selectedInstructor, setFilter } = useDashboardStore()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  const filteredAlunos = selectedInstructor
    ? alunos?.filter(
        (a) => a.uete === selectedInstructor.uete && a.disciplina === selectedInstructor.disciplina,
      )
    : alunos

  if (!filteredAlunos || filteredAlunos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-slate-50 rounded-xl border border-dashed relative">
        {selectedInstructor && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 text-xs"
            onClick={() => setFilter('selectedInstructor', null)}
          >
            <FilterX className="h-4 w-4 mr-1" />
            Limpar Filtro
          </Button>
        )}
        <Users className="h-8 w-8 mb-2 opacity-20" />
        <p className="text-sm text-center">Nenhum aluno em risco encontrado.</p>
      </div>
    )
  }

  const getColor = (classif: string) => {
    switch (classif) {
      case 'Atenção':
        return 'bg-[#FACC15] text-yellow-950 border-[#FACC15]'
      case 'Risco':
        return 'bg-[#FB923C] text-white border-[#FB923C]'
      case 'Outlier':
        return 'bg-[#EF4444] text-white border-[#EF4444]'
      case 'Prioridade alta':
        return 'bg-[#A855F7] text-white border-[#A855F7]'
      default:
        return 'bg-slate-200 text-slate-800 border-slate-200'
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2 pb-2 relative">
      {selectedInstructor && (
        <div className="col-span-full flex justify-between items-center bg-primary/10 text-primary px-3 py-2 rounded-md mb-2">
          <span className="text-sm font-medium">
            Filtrando por Instrutor ({selectedInstructor.disciplina} - {selectedInstructor.uete})
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 hover:bg-primary/20"
            onClick={() => setFilter('selectedInstructor', null)}
          >
            <FilterX className="h-3 w-3 mr-1" />
            Limpar
          </Button>
        </div>
      )}
      {filteredAlunos.map((aluno, idx) => {
        const colorClasses = getColor(aluno.classificacao)
        const borderClass = colorClasses.split(' ').find((c) => c.startsWith('border-'))

        return (
          <Card
            key={`${aluno.id}-${aluno.disciplina}-${aluno.uete}-${idx}`}
            className={cn('animate-fade-in-up overflow-hidden border-l-4', borderClass)}
            style={{ animationDelay: `${(idx % 10) * 50}ms` }}
          >
            <CardContent className="p-4 flex flex-col justify-between h-full gap-2">
              <div>
                <div className="font-semibold text-sm truncate" title={aluno.nome_guerra}>
                  {aluno.numero} - {aluno.nome_guerra}
                </div>
                <div className="text-xs text-muted-foreground truncate mt-0.5 flex flex-col gap-0.5">
                  <span title={aluno.disciplina}>{aluno.disciplina}</span>
                  <span className="font-medium text-slate-500" title={aluno.uete}>
                    {aluno.uete}
                  </span>
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
