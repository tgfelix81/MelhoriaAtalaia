import { useMemo } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import useDashboardStore from '@/stores/useDashboardStore'
import { MOCK_STUDENTS } from '@/lib/mock-data'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { calculateMean } from '@/lib/statistics'
import { ScoreBadge } from './ScoreBadge'
import { GraduationCap, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function StudentSheet() {
  const { selectedStudentId, setFilter } = useDashboardStore()

  const student = useMemo(() => {
    if (!selectedStudentId) return null
    return MOCK_STUDENTS.find((s) => s.id === selectedStudentId) || null
  }, [selectedStudentId])

  const chartData = useMemo(() => {
    if (!student) return []
    // Combine histories for a generic view or pick specific. We'll show the average evolution across terms
    const terms = ['1º Bim', '2º Bim', '3º Bim', 'Atual']
    return terms.map((term, idx) => {
      const point: any = { name: term }
      student.grades.forEach((g) => {
        point[g.subject] = g.history[idx]
      })
      return point
    })
  }, [student])

  if (!student) return null

  const generalMean = calculateMean(student.grades.map((g) => g.value))

  return (
    <Sheet
      open={!!selectedStudentId}
      onOpenChange={(open) => !open && setFilter('selectedStudentId', null)}
    >
      <SheetContent className="w-full sm:max-w-md overflow-y-auto" side="right">
        <SheetHeader className="pb-6 border-b">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <SheetTitle className="text-xl">{student.name}</SheetTitle>
              <SheetDescription className="text-sm mt-1">
                {student.className} • ID: {student.id}
              </SheetDescription>
            </div>
          </div>
          <div className="flex gap-2 mt-4 pt-2">
            <Button variant="outline" size="sm" className="flex-1 gap-2">
              <Mail className="h-3.5 w-3.5" /> E-mail Responsável
            </Button>
            <Button variant="outline" size="sm" className="flex-1 gap-2">
              <Phone className="h-3.5 w-3.5" /> Contato
            </Button>
          </div>
        </SheetHeader>

        <div className="py-6 space-y-8">
          <div>
            <h4 className="text-sm font-semibold mb-4 text-slate-800">Resumo de Desempenho</h4>
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border">
              <span className="text-sm font-medium">Média Geral (Atual)</span>
              <ScoreBadge score={generalMean} />
            </div>

            <div className="mt-3 space-y-2">
              {student.grades.map((g) => (
                <div
                  key={g.subject}
                  className="flex items-center justify-between text-sm py-1.5 border-b last:border-0"
                >
                  <span className="text-slate-600">{g.subject}</span>
                  <span className="font-mono">{g.value.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-slate-800">Evolução Histórica</h4>
            <div className="h-[250px] w-full border rounded-lg p-4 bg-white">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis
                    domain={[0, 10]}
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  {student.grades.map((g, i) => (
                    <Line
                      key={g.subject}
                      type="monotone"
                      dataKey={g.subject}
                      stroke={`hsl(var(--chart-${(i % 5) + 1}))`}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
