import { ENRICHED_NOTAS } from './mock-data'
import {
  calculateMean,
  calculateStandardDeviation,
  calculateQuartiles,
  getAlertLevel,
} from './statistics'

// Simulated Server-side Edge Function for analyzing UETE risk
export function analisarRiscoUete(uete: string, disciplinaIdOrName: string) {
  let validGrades = ENRICHED_NOTAS
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
    const classif = getAlertLevel(g.valor, media, desvio_padrao, q1, iqr)
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
      if (classif === 'Outlier negativo' || classif === 'Prioridade alta') {
        num_outliers++
        disciplinaCount[g.disciplina.nome_disciplina] =
          (disciplinaCount[g.disciplina.nome_disciplina] || 0) + 1
      }
    }
  })

  const instrutores_atencao = Object.entries(disciplinaCount)
    .filter(([_, count]) => count >= 2)
    .map(([disciplina, count]) => ({
      nome_instrutor: `Instrutor(a) - ${disciplina}`,
      disciplina,
      num_alunos_risco: count,
      acao_recomendada: count >= 5 ? 'Revisão metodológica urgente' : 'Acompanhamento pedagógico',
    }))
    .sort((a, b) => b.num_alunos_risco - a.num_alunos_risco)

  return {
    estatisticas_gerais: { media, desvio_padrao, num_alertas, num_outliers },
    alunos_risco: alunos_risco.sort((a, b) => {
      const severity: Record<string, number> = {
        'Prioridade alta': 4,
        'Outlier negativo': 3,
        'Risco pedagógico': 2,
        Atenção: 1,
      }
      return severity[b.classificacao] - severity[a.classificacao]
    }),
    instrutores_atencao,
  }
}
