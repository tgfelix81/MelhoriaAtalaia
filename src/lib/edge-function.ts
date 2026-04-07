import { ENRICHED_NOTAS } from './mock-data'
import {
  calculateMean,
  calculateStandardDeviation,
  calculateQuartiles,
  getAlertLevel,
} from './statistics'

const TFM_SUBJECTS = ['Flexão de Braço', 'Abdominal', 'Flexão na Barra', 'Corrida']
const TFM_NAME = 'Treinamento Físico Militar (TFM)'

// Simulated Server-side Edge Function for analyzing UETE risk
export async function analisarRiscoUete(uete: string, disciplinaIdOrName: string) {
  // Simulate network delay and Supabase Edge Function processing time
  await new Promise((resolve) => setTimeout(resolve, 800))

  let processedNotas = [...ENRICHED_NOTAS]

  // Inject mock TFM data if missing to ensure feature is demonstrable
  const hasTFM = processedNotas.some((n) => TFM_SUBJECTS.includes(n.disciplina.nome_disciplina))
  if (!hasTFM && processedNotas.length > 0) {
    const sampleStudents = Array.from(new Set(processedNotas.slice(0, 20).map((n) => n.aluno.id)))
      .map((id) => processedNotas.find((n) => n.aluno.id === id)?.aluno)
      .filter(Boolean)

    sampleStudents.forEach((aluno) => {
      TFM_SUBJECTS.forEach((subj, idx) => {
        processedNotas.push({
          id: `mock-tfm-${aluno!.id}-${idx}`,
          valor: 4 + Math.random() * 6, // Random grade between 4 and 10
          aluno: aluno!,
          disciplina: { nome_disciplina: subj, tipo_prova: 'Prática' },
        } as any)
      })
    })
  }

  // TFM Consolidation Logic
  const studentTFMGrades: Record<string, { sum: number; count: number; aluno: any }> = {}
  const nonTFMNotas: any[] = []

  processedNotas.forEach((g) => {
    if (TFM_SUBJECTS.includes(g.disciplina.nome_disciplina)) {
      if (!studentTFMGrades[g.aluno.id]) {
        studentTFMGrades[g.aluno.id] = { sum: 0, count: 0, aluno: g.aluno }
      }
      studentTFMGrades[g.aluno.id].sum += g.valor
      studentTFMGrades[g.aluno.id].count += 1
    } else {
      nonTFMNotas.push(g)
    }
  })

  const tfmNotas = Object.values(studentTFMGrades).map((st) => ({
    id: `tfm-${st.aluno.id}`,
    valor: st.sum / st.count,
    aluno: st.aluno,
    disciplina: { nome_disciplina: TFM_NAME, tipo_prova: 'Prática' },
  }))

  let validGrades = [...nonTFMNotas, ...tfmNotas]

  if (uete !== 'Todas') {
    validGrades = validGrades.filter((g) => g.aluno.uete === uete)
  }
  if (disciplinaIdOrName !== 'Todas') {
    validGrades = validGrades.filter((g) => g.disciplina.nome_disciplina === disciplinaIdOrName)
  }

  const gradesOnly = validGrades.map((g) => g.valor)
  const media = calculateMean(gradesOnly)
  const desvio_padrao = calculateStandardDeviation(gradesOnly, media)
  const { q1, iqr } = calculateQuartiles(gradesOnly)

  let num_alertas = 0
  let num_outliers = 0

  const alunos_risco: any[] = []
  const disciplinaCount: Record<string, number> = {}

  validGrades.forEach((g) => {
    const classifRaw = getAlertLevel(g.valor, media, desvio_padrao, q1, iqr)

    // Map internal alert levels to the UI required ones
    let classif = classifRaw
    if (classifRaw === 'Risco pedagógico') classif = 'Risco'
    if (classifRaw === 'Outlier negativo') classif = 'Outlier'

    if (classif !== 'Dentro do padrão') {
      num_alertas++
      alunos_risco.push({
        id: g.aluno.id,
        numero: g.aluno.numero,
        nome_guerra: g.aluno.nome_guerra,
        nota: g.valor,
        classificacao: classif,
        disciplina: g.disciplina.nome_disciplina,
        uete: g.aluno.uete,
        tipo_prova: g.disciplina.tipo_prova,
      })
      if (classif === 'Outlier' || classif === 'Prioridade alta') {
        num_outliers++
      }
      disciplinaCount[g.disciplina.nome_disciplina] =
        (disciplinaCount[g.disciplina.nome_disciplina] || 0) + 1
    }
  })

  const instrutores_atencao = Object.entries(disciplinaCount)
    .map(([disciplina, count]) => ({
      nome_instrutor: `Instrutor(a) - ${disciplina.length > 15 ? disciplina.substring(0, 15) + '...' : disciplina}`,
      disciplina,
      num_alunos_risco: count,
      acao_recomendada: count >= 5 ? 'Revisão metodológica urgente' : 'Acompanhamento pedagógico',
    }))
    .sort((a, b) => b.num_alunos_risco - a.num_alunos_risco)

  const riskByDiscipline = Object.entries(disciplinaCount)
    .map(([disciplina, count]) => ({
      disciplina,
      alunosEmRisco: count,
    }))
    .sort((a, b) => b.alunosEmRisco - a.alunosEmRisco)
    .slice(0, 10)

  return {
    estatisticas_gerais: { media, desvio_padrao, num_alertas, num_outliers },
    alunos_risco: alunos_risco.sort((a, b) => {
      const severity: Record<string, number> = {
        'Prioridade alta': 4,
        Outlier: 3,
        Risco: 2,
        Atenção: 1,
      }
      return severity[b.classificacao] - severity[a.classificacao]
    }),
    instrutores_atencao,
    riskByDiscipline,
  }
}
