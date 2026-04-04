import { useMemo } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { calculateQuartiles } from '@/lib/statistics'

export function BoxPlotChart({ grades }: { grades: number[] }) {
  const stats = useMemo(() => calculateQuartiles(grades), [grades])
  const outliers = useMemo(() => {
    const lowerBound = stats.q1 - 1.5 * stats.iqr
    const upperBound = stats.q3 + 1.5 * stats.iqr
    return grades.filter((g) => g < lowerBound || g > upperBound)
  }, [grades, stats])

  if (grades.length === 0)
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">Sem dados</div>
    )

  const scale = (val: number) => `${Math.max(0, Math.min(100, (val / 10) * 100))}%`

  return (
    <div className="relative w-full h-40 mt-4">
      {/* Axis line */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-200 -translate-y-1/2" />

      {/* Whiskers */}
      <div
        className="absolute top-[40%] bottom-[40%] border-l-2 border-r-2 border-slate-500"
        style={{ left: scale(stats.min), right: scale(10 - stats.max) }}
      >
        <div className="absolute top-1/2 left-0 right-0 h-px bg-slate-500 -translate-y-1/2" />
      </div>

      {/* Box (Q1 to Q3) */}
      <div
        className="absolute top-1/4 bottom-1/4 bg-blue-100/80 border border-blue-400 rounded-sm shadow-sm transition-all duration-500 group"
        style={{ left: scale(stats.q1), width: `${((stats.q3 - stats.q1) / 10) * 100}%` }}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full h-full cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-xs">
                <p>Q3 (75%): {stats.q3.toFixed(1)}</p>
                <p>Mediana (50%): {stats.median.toFixed(1)}</p>
                <p>Q1 (25%): {stats.q1.toFixed(1)}</p>
                <p>IQR: {stats.iqr.toFixed(1)}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Median Line */}
      <div
        className="absolute top-1/4 bottom-1/4 w-0.5 bg-blue-700 transition-all duration-500"
        style={{ left: scale(stats.median) }}
      />

      {/* Outliers */}
      <TooltipProvider>
        {outliers.map((val, i) => (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              <div
                className="absolute top-1/2 w-3 h-3 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-red-500 bg-white shadow-sm cursor-help hover:bg-red-50 transition-colors"
                style={{ left: scale(val) }}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs text-red-600 font-medium">Outlier: {val.toFixed(1)}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>

      {/* X-Axis Labels */}
      <div className="absolute -bottom-6 left-0 right-0 flex justify-between text-xs text-slate-400 px-1">
        {[0, 2, 4, 6, 8, 10].map((n) => (
          <span key={n} className="absolute -translate-x-1/2" style={{ left: scale(n) }}>
            {n}
          </span>
        ))}
      </div>
    </div>
  )
}
