import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useDashboardStore from '@/stores/useDashboardStore'
import { UETES, DISCIPLINAS_NOMES, TIPOS_PROVA } from '@/lib/mock-data'

export function FilterBar() {
  const { uete, disciplina, tipoProva, setFilter } = useDashboardStore()

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
      <Select value={uete} onValueChange={(val) => setFilter('uete', val)}>
        <SelectTrigger className="w-full sm:w-[180px] bg-background">
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
        <SelectTrigger className="w-full sm:w-[220px] bg-background">
          <SelectValue placeholder="Disciplina" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Todas">Todas Disciplinas</SelectItem>
          {DISCIPLINAS_NOMES.map((d) => (
            <SelectItem key={d} value={d}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={tipoProva} onValueChange={(val) => setFilter('tipoProva', val)}>
        <SelectTrigger className="w-full sm:w-[150px] bg-background">
          <SelectValue placeholder="Tipo de Prova" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Todas">Todos Tipos</SelectItem>
          {TIPOS_PROVA.map((t) => (
            <SelectItem key={t} value={t}>
              {t}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
