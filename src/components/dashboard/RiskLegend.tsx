import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AlertTriangle, AlertCircle, ShieldAlert, AlertOctagon } from 'lucide-react'

export function RiskLegend() {
  const levels = [
    {
      title: 'Prioridade Alta (Vermelho)',
      desc: 'Notas abaixo de -2 Desvios Padrão. Casos críticos que exigem intervenção imediata.',
      color: 'bg-red-500',
      icon: <ShieldAlert className="w-5 h-5 text-white" />,
      textColor: 'text-white',
    },
    {
      title: 'Outlier (Laranja)',
      desc: 'Anomalias estatísticas em avaliações específicas (abaixo do limite inferior).',
      color: 'bg-orange-500',
      icon: <AlertOctagon className="w-5 h-5 text-white" />,
      textColor: 'text-white',
    },
    {
      title: 'Risco (Amarelo)',
      desc: 'Alunos com notas entre -1 e -2 Desvios Padrão da média da turma.',
      color: 'bg-yellow-500',
      icon: <AlertTriangle className="w-5 h-5 text-white" />,
      textColor: 'text-white',
    },
    {
      title: 'Atenção (Azul)',
      desc: 'Alunos com notas abaixo da média, mas dentro de -1 Desvio Padrão.',
      color: 'bg-blue-500',
      icon: <AlertCircle className="w-5 h-5 text-white" />,
      textColor: 'text-white',
    },
  ]

  return (
    <Card className="animate-fade-in-up">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Critérios Estatísticos e Alertas</CardTitle>
        <CardDescription>
          Entenda os níveis de risco baseados em Desvio Padrão (DP) e Quartis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {levels.map((level, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border bg-slate-50/50">
              <div className={`p-2 rounded-md ${level.color} shadow-sm shrink-0`}>{level.icon}</div>
              <div>
                <h4 className="font-semibold text-sm text-slate-900">{level.title}</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{level.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
