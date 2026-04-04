import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { AlertLevel } from '@/lib/statistics'

export function ScoreBadge({ score }: { score: number }) {
  const getBadgeVariant = (score: number) => {
    if (score >= 7) return 'bg-teal-100 text-teal-800 border-teal-200'
    if (score >= 5) return 'bg-amber-100 text-amber-800 border-amber-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  return (
    <Badge variant="outline" className={cn('font-mono tabular-nums', getBadgeVariant(score))}>
      {score.toFixed(1)}
    </Badge>
  )
}

export function AlertBadge({ level }: { level: AlertLevel }) {
  const styles: Record<AlertLevel, string> = {
    'Dentro do padrão': 'bg-slate-100 text-slate-700 border-slate-200',
    Atenção: 'bg-blue-100 text-blue-800 border-blue-200',
    'Risco pedagógico': 'bg-amber-100 text-amber-800 border-amber-200',
    'Outlier negativo': 'bg-orange-100 text-orange-800 border-orange-200',
    'Prioridade alta': 'bg-red-100 text-red-800 border-red-200 font-semibold',
  }

  return (
    <Badge variant="outline" className={cn('whitespace-nowrap', styles[level])}>
      {level}
    </Badge>
  )
}
