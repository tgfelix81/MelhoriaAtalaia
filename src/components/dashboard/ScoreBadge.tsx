export function ScoreBadge({ score }: { score: number }) {
  let colorClass = 'bg-[#3B82F6]/10 text-[#3B82F6]' // Blue
  if (score < 5)
    colorClass = 'bg-[#EF4444]/10 text-[#EF4444]' // Red
  else if (score < 7) colorClass = 'bg-[#FBBF24]/10 text-[#FBBF24]' // Yellow

  return (
    <span className={`px-2 py-1 rounded-md text-xs font-semibold ${colorClass}`}>
      {score.toFixed(1)}
    </span>
  )
}
