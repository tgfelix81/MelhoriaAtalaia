import { SidebarTrigger } from '@/components/ui/sidebar'
import { FilterBar } from '@/components/dashboard/FilterBar'

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center gap-4 border-b bg-background/95 backdrop-blur px-4 md:px-6 shadow-sm">
      <SidebarTrigger className="shrink-0" />
      <div className="flex flex-1 items-center justify-between">
        <h1 className="text-lg font-semibold tracking-tight hidden sm:block">
          Análise de Desempenho
        </h1>
        <div className="ml-auto flex items-center space-x-4 w-full sm:w-auto justify-end">
          <FilterBar />
        </div>
      </div>
    </header>
  )
}
