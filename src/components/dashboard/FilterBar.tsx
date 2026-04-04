import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useDashboardStore from '@/stores/useDashboardStore'

export function FilterBar() {
  const { turma, disciplina, setFilter } = useDashboardStore()

  return (
    <div className="flex items-center gap-2 w-full sm:w-auto">
      <Select value={turma} onValueChange={(val) => setFilter('turma', val)}>
        <SelectTrigger className="w-[130px] sm:w-[150px] bg-background">
          <SelectValue placeholder="Turma" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Todas">Todas as Turmas</SelectItem>
          <SelectItem value="Turma A">Turma A</SelectItem>
          <SelectItem value="Turma B">Turma B</SelectItem>
          <SelectItem value="Turma C">Turma C</SelectItem>
        </SelectContent>
      </Select>

      <Select value={disciplina} onValueChange={(val) => setFilter('disciplina', val)}>
        <SelectTrigger className="w-[140px] sm:w-[160px] bg-background">
          <SelectValue placeholder="Disciplina" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Todas">Todas Disciplinas</SelectItem>
          <SelectItem value="Matemática">Matemática</SelectItem>
          <SelectItem value="Português">Português</SelectItem>
          <SelectItem value="Ciências">Ciências</SelectItem>
          <SelectItem value="História">História</SelectItem>
          <SelectItem value="Geografia">Geografia</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
