import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useDashboardStore from '@/stores/useDashboardStore'
import { UETES, DISCIPLINAS_NOMES } from '@/lib/mock-data'

export function FilterBar() {
  const { uete, disciplina, setFilter } = useDashboardStore()

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
      <Select value={uete} onValueChange={(val) => setFilter('uete', val)}>
        <SelectTrigger className="w-full sm:w-[200px] bg-background">
          <SelectValue placeholder="UETE" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Todas">Todas as UETEs</SelectItem>
          {UETES.map((u) => (
            <SelectItem key={u} value={u}>
              {u}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={disciplina} onValueChange={(val) => setFilter('disciplina', val)}>
        <SelectTrigger className="w-full sm:w-[250px] bg-background">
          <SelectValue placeholder="Disciplina" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Todas">Todas as Disciplinas</SelectItem>
          {DISCIPLINAS_NOMES.map((d) => (
            <SelectItem key={d} value={d}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
