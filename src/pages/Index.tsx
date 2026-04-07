import { KPICards } from '@/components/dashboard/KPICards'
import { MainCharts } from '@/components/dashboard/MainCharts'
import { AlertsTable } from '@/components/dashboard/AlertsTable'
import { InstructorsTable } from '@/components/dashboard/InstructorsTable'
import { FilterBar } from '@/components/dashboard/FilterBar'

export default function Index() {
  return (
    <div className="space-y-6 pb-12 pt-6 px-4 md:px-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Dashboard Analítico Pedagógico
          </h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Monitoramento de desempenho, alertas e intervenções por UETE e disciplina.
          </p>
        </div>
        <FilterBar />
      </div>

      <KPICards />
      <MainCharts />

      <div className="mt-6 w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AlertsTable />
        </div>
        <div className="lg:col-span-1">
          <InstructorsTable />
        </div>
      </div>
    </div>
  )
}
