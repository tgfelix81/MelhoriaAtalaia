import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertTriangle, Users } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'

export function MultipleRiskStudents({ data, isLoading }: { data: any[]; isLoading: boolean }) {
  const [minRisks, setMinRisks] = useState('2')

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-64 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  const filteredData = (data || []).filter((student) => student.totalRisks >= parseInt(minRisks))

  const getUrgencyColors = (count: number) => {
    if (count >= 4) return 'border-red-500 bg-red-50/50'
    if (count === 3) return 'border-orange-500 bg-orange-50/50'
    return 'border-yellow-500 bg-yellow-50/50'
  }

  const getBadgeColor = (count: number) => {
    if (count >= 4) return 'bg-red-500 hover:bg-red-600 text-white'
    if (count === 3) return 'bg-orange-500 hover:bg-orange-600 text-white'
    return 'bg-yellow-500 hover:bg-yellow-600 text-white'
  }

  const getRiskClassifColor = (classif: string) => {
    switch (classif) {
      case 'Atenção':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'Risco':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'Outlier':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'Prioridade alta':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          Mostrando alunos com{' '}
          <span className="font-semibold text-foreground">{minRisks} ou mais</span> disciplinas em
          risco.
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium whitespace-nowrap">Filtrar por Volume:</span>
          <Select value={minRisks} onValueChange={setMinRisks}>
            <SelectTrigger className="w-[120px] h-8 text-sm">
              <SelectValue placeholder="Intensidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2+ Riscos</SelectItem>
              <SelectItem value="3">3+ Riscos</SelectItem>
              <SelectItem value="4">4+ Riscos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-slate-50 rounded-xl border border-dashed">
          <Users className="h-8 w-8 mb-2 opacity-20" />
          <p className="text-sm text-center">Nenhum aluno encontrado com este critério.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-2 pb-2">
          {filteredData.map((student, idx) => {
            const urgencyColors = getUrgencyColors(student.totalRisks)

            return (
              <Card
                key={`${student.id}-${idx}`}
                className={cn(
                  'animate-fade-in-up overflow-hidden border-t-4 flex flex-col',
                  urgencyColors.split(' ')[0],
                  urgencyColors.split(' ')[1],
                )}
                style={{ animationDelay: `${(idx % 10) * 50}ms` }}
              >
                <CardContent className="p-4 flex flex-col h-full gap-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                      <div className="font-bold text-sm truncate" title={student.nome_guerra}>
                        {student.numero} - {student.nome_guerra}
                      </div>
                      <Badge
                        variant="secondary"
                        className="mt-1 font-medium text-[10px] h-4 px-1.5 rounded-sm"
                      >
                        {student.uete}
                      </Badge>
                    </div>
                    <Badge
                      className={cn(
                        'text-[10px] shrink-0 border-transparent',
                        getBadgeColor(student.totalRisks),
                      )}
                    >
                      {student.totalRisks} Riscos
                    </Badge>
                  </div>

                  <div className="flex-1 bg-white rounded-md border p-2 flex flex-col gap-2">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      Disciplinas Críticas
                    </span>
                    <ScrollArea className="h-[100px] pr-3">
                      <div className="space-y-2">
                        {student.risks.map((risk: any, rIdx: number) => (
                          <div
                            key={rIdx}
                            className="flex justify-between items-center text-sm border-b border-slate-100 pb-1.5 last:border-0 last:pb-0"
                          >
                            <span
                              className="truncate mr-2 flex-1 text-[11px] font-medium text-slate-700"
                              title={risk.disciplina}
                            >
                              {risk.disciplina}
                            </span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="font-mono text-[10px] font-bold text-slate-600">
                                {risk.nota.toFixed(1)}
                              </span>
                              <Badge
                                variant="outline"
                                className={cn(
                                  'text-[9px] h-4 px-1 rounded-[3px] border',
                                  getRiskClassifColor(risk.classificacao),
                                )}
                              >
                                {risk.classificacao}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  {(student.hasHighRisk || student.totalRisks >= 3) && (
                    <div className="bg-red-100 text-red-800 border border-red-200 rounded-md p-2 text-xs font-bold flex items-center gap-1.5 mt-auto">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
                      Intervenção pedagógica urgente
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
