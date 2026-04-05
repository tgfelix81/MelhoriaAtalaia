import {
  AlertLevel,
  calculateMean,
  calculateQuartiles,
  calculateStandardDeviation,
  getAlertLevel,
} from './statistics'

export interface Aluno {
  id: string
  numero: string
  nome_guerra: string
  segmento: string
  uete: string
}

export interface Disciplina {
  id: string
  nome_disciplina: string
  tipo_prova: string
}

export interface Nota {
  id: string
  aluno_id: string
  disciplina_id: string
  valor: number
  data_avaliacao: string
}

export interface AlertDetail {
  studentId: string
  studentName: string
  uete: string
  subject: string
  examType: string
  grade: number
  mean: number
  sd: number
  reason: string
  priority: AlertLevel
}

const FIRST_NAMES = [
  'Ana',
  'Bruno',
  'Carlos',
  'Daniela',
  'Eduardo',
  'Fernanda',
  'Gabriel',
  'Helena',
  'Igor',
  'Julia',
  'Lucas',
  'Mariana',
  'Nicolas',
  'Olivia',
  'Pedro',
]
const LAST_NAMES = [
  'Silva',
  'Santos',
  'Oliveira',
  'Souza',
  'Rodrigues',
  'Ferreira',
  'Alves',
  'Pereira',
  'Lima',
  'Gomes',
  'Costa',
  'Ribeiro',
  'Martins',
  'Carvalho',
  'Almeida',
]

export const UETES = [
  '1º GAAAe',
  '16º BI Mtz',
  '6º RCB',
  '12º GAAAe',
  '23º BI',
  '23º BC',
  '20º RCB',
  '13º RC Mec',
  '14º GAC',
  '4º BE Cmb',
  '41º BI Mec',
  '10º BIL Mth',
  '4º GAC L Mth',
]

export const DISCIPLINAS_ACADEMICAS = [
  'Armamento',
  'Liderança',
  'Ética',
  'Técnica Militar 1',
  'Técnica Militar 2',
  'Técnica Militar 3',
  'História Militar Brasileira',
  'Inglês 1',
]

export const DISCIPLINAS_FISICAS = ['Flexão na Barra', 'Corrida', 'Flexão de Braço', 'Abdominal']

export const DISCIPLINAS_NOMES = [...DISCIPLINAS_ACADEMICAS, ...DISCIPLINAS_FISICAS]
export const TIPOS_PROVA = ['AF', 'AA', 'AC']

function randomNormal(mean: number, stdDev: number): number {
  let u = 0,
    v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
  num = num / 10.0 + 0.5
  if (num > 1 || num < 0) return randomNormal(mean, stdDev)
  let res = num * stdDev * 2 + mean - stdDev
  return Math.max(0, Math.min(10, res))
}

export const ALUNOS: Aluno[] = []
export const MOCK_STUDENTS = ALUNOS
export const DISCIPLINAS: Disciplina[] = []
export const NOTAS: Nota[] = []

// Populate Mock Database Schema
let dId = 1
DISCIPLINAS_NOMES.forEach((nome) => {
  TIPOS_PROVA.forEach((tipo) => {
    DISCIPLINAS.push({
      id: `D${dId++}`,
      nome_disciplina: nome,
      tipo_prova: tipo,
    })
  })
})

let nId = 1
for (let i = 1; i <= 1000; i++) {
  const isOutlier = Math.random() < 0.05
  const uete = UETES[Math.floor(Math.random() * UETES.length)]
  const aluno_id = `A${i}`

  ALUNOS.push({
    id: aluno_id,
    numero: i.toString().padStart(4, '0'),
    nome_guerra: `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`,
    segmento: 'Oficial',
    uete,
  })

  // Assign random grades simulating exams
  const studentDisciplinas = [...DISCIPLINAS].sort(() => 0.5 - Math.random()).slice(0, 10)

  studentDisciplinas.forEach((d) => {
    let mean = 7.0
    let sd = 1.2

    // Explicit outliers logic
    if (isOutlier && Math.random() < 0.3) {
      mean = 3.0
      sd = 0.8
    }

    let val = randomNormal(mean, sd)
    NOTAS.push({
      id: `N${nId++}`,
      aluno_id,
      disciplina_id: d.id,
      valor: Number(val.toFixed(1)),
      data_avaliacao: '2023-10-01',
    })
  })
}

// Derived helper collection for fast UI filtering
export interface EnrichedNota extends Nota {
  aluno: Aluno
  disciplina: Disciplina
}

export const ENRICHED_NOTAS: EnrichedNota[] = NOTAS.map((n) => ({
  ...n,
  aluno: ALUNOS.find((a) => a.id === n.aluno_id)!,
  disciplina: DISCIPLINAS.find((d) => d.id === n.disciplina_id)!,
}))
