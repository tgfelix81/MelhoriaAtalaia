import {
  AlertLevel,
  calculateMean,
  calculateQuartiles,
  calculateStandardDeviation,
  getAlertLevel,
} from './statistics'

export type Subject = 'Matemática' | 'Português' | 'Ciências' | 'História' | 'Geografia'
export type ClassName = 'Turma A' | 'Turma B' | 'Turma C'

export interface Grade {
  subject: Subject
  value: number
  history: number[]
}

export interface Student {
  id: string
  name: string
  className: ClassName
  grades: Grade[]
}

export interface AlertDetail {
  studentId: string
  studentName: string
  className: ClassName
  subject: Subject
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
const SUBJECTS: Subject[] = ['Matemática', 'Português', 'Ciências', 'História', 'Geografia']
const CLASSES: ClassName[] = ['Turma A', 'Turma B', 'Turma C']

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

function generateHistory(currentGrade: number): number[] {
  return [
    Math.max(0, Math.min(10, currentGrade + (Math.random() * 2 - 1))),
    Math.max(0, Math.min(10, currentGrade + (Math.random() * 2 - 1))),
    Math.max(0, Math.min(10, currentGrade + (Math.random() * 2 - 1))),
    currentGrade,
  ]
}

export const MOCK_STUDENTS: Student[] = Array.from({ length: 50 }).map((_, i) => {
  const isStruggling = Math.random() < 0.15
  const baseMean = isStruggling ? 4.5 : 7.5

  return {
    id: `STU-${(i + 1).toString().padStart(3, '0')}`,
    name: `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`,
    className: CLASSES[Math.floor(Math.random() * CLASSES.length)],
    grades: SUBJECTS.map((subject) => {
      const subjectModifier = subject === 'Matemática' ? -0.5 : 0
      const value = Number(
        randomNormal(baseMean + subjectModifier, isStruggling ? 2 : 1.2).toFixed(1),
      )
      return {
        subject,
        value,
        history: generateHistory(value).map((v) => Number(v.toFixed(1))),
      }
    }),
  }
})
