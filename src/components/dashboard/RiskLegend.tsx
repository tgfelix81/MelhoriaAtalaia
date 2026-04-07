import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AlertTriangle, AlertCircle, ShieldAlert, AlertOctagon } from 'lucide-react'

export function RiskLegend() {
  const levels = [
    {
      title: 'Atenção (Amarelo)',
      desc: 'Alunos com notas abaixo de 1 Desvio Padrão em relação à média da turma.',
      color: 'bg-[#FACC15]',
      icon: <AlertCircle className="w-5 h-5 text-yellow-950" />,
      textColor: 'text-yellow-950',
    },
    {
      title: 'Risco (Laranja)',
      desc: 'Alunos abaixo do 1º quartil com tendência de queda no desempenho.',
      color: 'bg-[#FB923C]',
      icon: <AlertTriangle className="w-5 h-5 text-white" />,
      textColor: 'text-white',
    },
    {
      title: 'Outlier (Vermelho)',
      desc: 'Desempenho significativamente fora da curva normal.',
      color: 'bg-[#EF4444]',
      icon: <AlertOctagon className="w-5 h-5 text-white" />,
      textColor: 'text-white',
    },
    {
      title: 'Prioridade Alta (Roxo)',
      desc: 'Casos críticos onde o aluno é Outlier e está abaixo de 2 Desvios Padrão.',
      color: 'bg-[#A855F7]',
      icon: <ShieldAlert className="w-5 h-5 text-white" />,
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
