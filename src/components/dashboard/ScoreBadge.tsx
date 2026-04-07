import { Badge } from '@/components/ui/badge'

export function ScoreBadge({ score }: { score: number }) {
  let color = 'bg-green-100 text-green-700'
  if (score < 5) color = 'bg-red-100 text-red-700'
  else if (score < 7) color = 'bg-yellow-100 text-yellow-700'

  return (
    <Badge variant="outline" className={`${color} font-mono border-transparent`}>
      {score.toFixed(1)}
    </Badge>
  )
}
