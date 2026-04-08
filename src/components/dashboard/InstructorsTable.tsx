import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Users, ArrowUpDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import useDashboardStore from '@/stores/useDashboardStore'
import { cn } from '@/lib/utils'

export function InstructorsTable({ data, isLoading }: { data: any[]; isLoading: boolean }) {
  const [sortDesc, setSortDesc] = useState(true)
  const { selectedInstructor, setFilter } = useDashboardStore()

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full rounded-xl" />
  }

  const instructors = [...(data || [])].sort((a, b) => {
    return sortDesc
      ? b.num_alunos_risco - a.num_alunos_risco
      : a.num_alunos_risco - b.num_alunos_risco
  })

  const handleRowClick = (inst: any) => {
    if (
      selectedInstructor?.uete === inst.uete &&
      selectedInstructor?.disciplina === inst.disciplina
    ) {
      setFilter('selectedInstructor', null)
    } else {
      setFilter('selectedInstructor', { uete: inst.uete, disciplina: inst.disciplina })
    }
  }

  return (
    <Card className="animate-fade-in-up h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-base">Apoio Pedagógico a Instrutores</CardTitle>
        <CardDescription>
          Corpo docente com alunos em risco (Prioridade Alta, Outlier ou Risco)
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 overflow-auto p-0 px-6 pb-6">
        {instructors.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Users className="h-8 w-8 mb-2 opacity-20" />
            <p className="text-sm text-center">
              Nenhum instrutor requer
              <br />
              intervenção prioritária.
            </p>
          </div>
        ) : (
          <div className="rounded-md border max-h-[500px] overflow-auto relative">
            <Table>
              <TableHeader className="sticky top-0 bg-slate-50 shadow-sm z-10">
                <TableRow className="hover:bg-slate-50">
                  <TableHead>Nome do Instrutor e UETE</TableHead>
                  <TableHead>Disciplina</TableHead>
                  <TableHead className="text-center">
                    <Button
                      variant="ghost"
                      onClick={() => setSortDesc(!sortDesc)}
                      className="h-8 px-2 text-xs font-semibold hover:bg-slate-200"
                    >
                      Alunos em Risco
                      <ArrowUpDown className="ml-2 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>Ação Recomendada</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {instructors.map((inst, idx) => {
                  const isSelected =
                    selectedInstructor?.uete === inst.uete &&
                    selectedInstructor?.disciplina === inst.disciplina

                  return (
                    <TableRow
                      key={idx}
                      onClick={() => handleRowClick(inst)}
                      className={cn(
                        'transition-colors cursor-pointer',
                        isSelected ? 'bg-primary/10 hover:bg-primary/20' : 'hover:bg-slate-50',
                      )}
                    >
                      <TableCell>
                        <div className="font-medium whitespace-nowrap text-sm flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <span>{inst.nome_instrutor}</span>
                          <Badge
                            variant="outline"
                            className="text-[10px] font-normal px-1.5 h-4 bg-slate-50 text-slate-500 border-slate-200 w-fit"
                          >
                            {inst.uete}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className="text-xs text-muted-foreground truncate max-w-[100px]"
                          title={inst.disciplina}
                        >
                          {inst.disciplina}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="destructive" className="font-mono">
                          {inst.num_alunos_risco}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-muted-foreground leading-tight block min-w-[120px]">
                          {inst.acao_recomendada}
                        </span>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
