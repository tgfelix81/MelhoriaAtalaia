import { KPICards } from '@/components/dashboard/KPICards'
import { MainCharts } from '@/components/dashboard/MainCharts'
import { RankingList } from '@/components/dashboard/RankingList'
import { AlertsTable } from '@/components/dashboard/AlertsTable'

export default function Index() {
  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Visão Geral Pedagógica</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Acompanhe indicadores de desempenho e identifique estudantes que necessitam de
          intervenção.
        </p>
      </div>

      <KPICards />
      <MainCharts />

      <div className="grid gap-6 md:grid-cols-3 mt-6">
        <div className="md:col-span-1">
          <RankingList />
        </div>
        <div className="md:col-span-2">
          <AlertsTable />
        </div>
      </div>
    </div>
  )
}
