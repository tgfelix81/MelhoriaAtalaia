import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, AlertTriangle, Target, TrendingDown } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export function KPICards({ data, isLoading }: { data: any; isLoading: boolean }) {
  if (isLoading || !data) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="hover:shadow-md transition-shadow animate-fade-in-up">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Média</CardTitle>
          <Target className="h-4 w-4 text-[#3B82F6]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">{data.media.toFixed(2)}</div>
        </CardContent>
      </Card>

      <Card
        className="hover:shadow-md transition-shadow animate-fade-in-up"
        style={{ animationDelay: '75ms' }}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">Desvio Padrão</CardTitle>
          <Activity className="h-4 w-4 text-[#A855F7]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-slate-900">{data.desvio_padrao.toFixed(2)}</div>
        </CardContent>
      </Card>

      <Card
        className="hover:shadow-md transition-shadow animate-fade-in-up border-amber-200"
        style={{ animationDelay: '150ms' }}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-amber-700">Número de Alertas</CardTitle>
          <AlertTriangle className="h-4 w-4 text-[#FBBF24]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-700">{data.num_alertas}</div>
        </CardContent>
      </Card>

      <Card
        className="hover:shadow-md transition-shadow animate-fade-in-up border-red-200"
        style={{ animationDelay: '200ms' }}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-700">Número de Outliers</CardTitle>
          <TrendingDown className="h-4 w-4 text-[#EF4444]" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-700">{data.num_outliers}</div>
        </CardContent>
      </Card>
    </div>
  )
}
