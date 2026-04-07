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
import useDashboardStore from '@/stores/useDashboardStore'
import { Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { analisarRiscoUete } from '@/lib/edge-function'
import { ScoreBadge } from './ScoreBadge'

export function AlertBadge({ level }: { level: string }) {
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
  const { uete, disciplina, setFilter } = useDashboardStore()

  const alerts = useMemo(() => {
    const analysis = analisarRiscoUete(uete, disciplina)
    return analysis.alunos_risco.slice(0, 100) // Limit for UI performance
  }, [uete, disciplina])

  return (
    <Card className="animate-fade-in-up flex flex-col h-full" style={{ animationDelay: '500ms' }}>
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
                {alerts.map((alert: any, idx: number) => (
                  <TableRow
                    key={`${alert.id}-${alert.disciplina}-${alert.tipo_prova}-${idx}`}
                    className="cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => setFilter('selectedStudentId', alert.id)}
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {alert.numero}
                    </TableCell>
                    <TableCell className="font-medium whitespace-nowrap">
                      {alert.nome_guerra}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                      {alert.uete}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{alert.disciplina}</TableCell>
                    <TableCell className="text-xs">{alert.tipo_prova}</TableCell>
                    <TableCell className="text-right">
                      <ScoreBadge score={alert.nota} />
                    </TableCell>
                    <TableCell>
                      <AlertBadge level={alert.classificacao} />
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
