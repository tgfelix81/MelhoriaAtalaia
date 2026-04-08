import { ENRICHED_NOTAS, DISCIPLINAS_FISICAS } from './mock-data'
import { calculateMean, calculateStandardDeviation, calculateQuartiles } from './statistics'

const TFM_NAME = 'Treinamento Físico Militar (TFM)'

export function processDashboardData(ueteFilter: string, disciplinaFilter: string) {
  const consolidated = new Map<
    string,
    { aluno: any; disciplina: string; notas: number[]; uete: string }
  >()

  ENRICHED_NOTAS.forEach((nota) => {
    const isTFM = DISCIPLINAS_FISICAS.includes(nota.disciplina.nome_disciplina)
    const subjectName = isTFM ? TFM_NAME : nota.disciplina.nome_disciplina

    const key = `${nota.aluno_id}-${subjectName}`
    if (!consolidated.has(key)) {
      consolidated.set(key, {
        aluno: nota.aluno,
        disciplina: subjectName,
        notas: [],
        uete: nota.aluno.uete,
      })
    }
    consolidated.get(key)!.notas.push(nota.valor)
  })

  const finalGrades = Array.from(consolidated.values()).map((item) => ({
    aluno: item.aluno,
    disciplina: item.disciplina,
    uete: item.uete,
    valor: calculateMean(item.notas),
  }))

  const ueteFiltered =
    ueteFilter === 'Todas' ? finalGrades : finalGrades.filter((g) => g.uete === ueteFilter)
  const filtered =
    disciplinaFilter === 'Todas'
      ? ueteFiltered
      : ueteFiltered.filter((g) => g.disciplina === disciplinaFilter)

  const allValues = filtered.map((g) => g.valor)
  const globalMean = calculateMean(allValues)
  const globalSd = calculateStandardDeviation(allValues, globalMean)

  const subjectStats = new Map<string, { mean: number; sd: number; q1: number; iqr: number }>()

  const gradesBySubject = new Map<string, number[]>()
  filtered.forEach((g) => {
    if (!gradesBySubject.has(g.disciplina)) gradesBySubject.set(g.disciplina, [])
    gradesBySubject.get(g.disciplina)!.push(g.valor)
  })

  gradesBySubject.forEach((vals, subj) => {
    const mean = calculateMean(vals)
    const sd = calculateStandardDeviation(vals, mean)
    const { q1, iqr } = calculateQuartiles(vals)
    subjectStats.set(subj, { mean, sd, q1, iqr })
  })

  let numAlertas = 0
  let numOutliers = 0
  const alunosRisco: any[] = []
  const riskByDisciplineMap = new Map<string, number>()
  const instructorsMap = new Map<string, { subject: string; count: number; uete: string }>()

  const studentRisksMap = new Map<
    string,
    {
      aluno: any
      uete: string
      risks: Array<{ disciplina: string; nota: number; classificacao: string }>
    }
  >()

  filtered.forEach((g) => {
    const stats = subjectStats.get(g.disciplina)!

    // Custom Alert Level based on Acceptance Criteria
    let alertLevel = 'Dentro do padrão'
    if (g.valor < stats.mean - 2 * stats.sd) {
      alertLevel = 'Prioridade alta'
    } else if (g.valor < stats.q1 - 1.5 * stats.iqr) {
      alertLevel = 'Outlier'
    } else if (g.valor < stats.mean - stats.sd) {
      alertLevel = 'Risco'
    } else if (g.valor < stats.mean) {
      alertLevel = 'Atenção'
    }

    if (alertLevel !== 'Dentro do padrão') {
      numAlertas++
      if (alertLevel === 'Outlier' || alertLevel === 'Prioridade alta') {
        numOutliers++
      }

      alunosRisco.push({
        id: g.aluno.id,
        numero: g.aluno.numero,
        nome_guerra: g.aluno.nome_guerra,
        uete: g.uete,
        disciplina: g.disciplina,
        nota: g.valor,
        classificacao: alertLevel,
      })

      riskByDisciplineMap.set(g.disciplina, (riskByDisciplineMap.get(g.disciplina) || 0) + 1)

      const studentKey = g.aluno.id
      if (!studentRisksMap.has(studentKey)) {
        studentRisksMap.set(studentKey, { aluno: g.aluno, uete: g.uete, risks: [] })
      }
      studentRisksMap.get(studentKey)!.risks.push({
        disciplina: g.disciplina,
        nota: g.valor,
        classificacao: alertLevel,
      })

      // Severity Filtering for Instructors: Only Prioridade Alta, Outlier, and Risco
      // Excludes "Atenção"
      if (alertLevel === 'Risco' || alertLevel === 'Outlier' || alertLevel === 'Prioridade alta') {
        const instrKey = `Instrutor(a) de ${g.disciplina} - ${g.uete}`
        if (!instructorsMap.has(instrKey)) {
          instructorsMap.set(instrKey, { uete: g.uete, subject: g.disciplina, count: 0 })
        }
        instructorsMap.get(instrKey)!.count += 1
      }
    }
  })

  const multipleRisks = Array.from(studentRisksMap.values())
    .filter((s) => s.risks.length >= 2)
    .map((s) => ({
      id: s.aluno.id,
      numero: s.aluno.numero,
      nome_guerra: s.aluno.nome_guerra,
      uete: s.uete,
      risks: s.risks.sort((a, b) => a.nota - b.nota),
      totalRisks: s.risks.length,
      hasHighRisk: s.risks.some(
        (r) => r.classificacao === 'Prioridade alta' || r.classificacao === 'Outlier',
      ),
    }))
    .sort((a, b) => b.totalRisks - a.totalRisks)

  const riskByDiscipline = Array.from(riskByDisciplineMap.entries())
    .map(([disciplina, count]) => ({
      disciplina,
      alunosEmRisco: count,
    }))
    .sort((a, b) => a.alunosEmRisco - b.alunosEmRisco)

  const instrutores_atencao = Array.from(instructorsMap.entries()).map(([name, data]) => ({
    nome_instrutor: `Instrutor(a) de ${data.subject}`,
    uete: data.uete,
    disciplina: data.subject,
    num_alunos_risco: data.count,
    acao_recomendada: data.count > 10 ? 'Revisão Metodológica' : 'Acompanhamento Tutorial',
  }))

  let performanceOverview = []
  if (ueteFilter === 'Todas') {
    const byUete = new Map<string, number[]>()
    filtered.forEach((g) => {
      if (!byUete.has(g.uete)) byUete.set(g.uete, [])
      byUete.get(g.uete)!.push(g.valor)
    })
    performanceOverview = Array.from(byUete.entries()).map(([uete, vals]) => ({
      name: uete,
      media: Number(calculateMean(vals).toFixed(2)),
    }))
  } else {
    performanceOverview = Array.from(gradesBySubject.entries()).map(([subj, vals]) => ({
      name: subj,
      media: Number(calculateMean(vals).toFixed(2)),
    }))
  }

  performanceOverview.sort((a, b) => a.media - b.media)

  return {
    estatisticas_gerais: {
      media: globalMean,
      desvio_padrao: globalSd,
      num_alertas: numAlertas,
      num_outliers: numOutliers,
    },
    riskByDiscipline,
    multipleRisks,
    alunos_risco: alunosRisco.sort((a, b) => a.nota - b.nota),
    instrutores_atencao,
    performanceOverview,
    allGrades: allValues,
  }
}
