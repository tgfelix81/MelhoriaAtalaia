import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import useDashboardStore from '@/stores/useDashboardStore'
import { analisarRiscoUete } from '@/lib/edge-function'
import { Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function InstructorsTable() {
  const { uete, disciplina } = useDashboardStore()

  const instructors = useMemo(() => {
    const analysis = analisarRiscoUete(uete, disciplina)
    return analysis.instrutores_atencao
  }, [uete, disciplina])

  return (
    <Card className="animate-fade-in-up h-full flex flex-col" style={{ animationDelay: '600ms' }}>
      <CardHeader>
        <CardTitle className="text-base">Apoio Pedagógico a Instrutores</CardTitle>
        <CardDescription>Corpo docente com alta concentração de alunos em risco</CardDescription>
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
                  <TableHead>Instrutor</TableHead>
                  <TableHead className="text-center">Alunos (Risco)</TableHead>
                  <TableHead>Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {instructors.map((inst, idx) => (
                  <TableRow key={idx} className="hover:bg-slate-50 transition-colors">
                    <TableCell>
                      <div className="font-medium whitespace-nowrap text-sm">
                        {inst.nome_instrutor}
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
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
