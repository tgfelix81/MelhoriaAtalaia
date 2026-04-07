import { useState, useEffect } from 'react'

export type StoreState = {
  uete: string
  disciplina: string
  selectedStudentId: string | null
  selectedInstructor: { uete: string; disciplina: string } | null
}

let state: StoreState = {
  uete: 'Todas',
  disciplina: 'Todas',
  selectedStudentId: null,
  selectedInstructor: null,
}

const listeners = new Set<React.Dispatch<React.SetStateAction<StoreState>>>()

export default function useDashboardStore() {
  const [localState, setLocalState] = useState<StoreState>(state)

  useEffect(() => {
    listeners.add(setLocalState)
    return () => {
      listeners.delete(setLocalState)
    }
  }, [])

  const setFilter = (key: keyof StoreState, value: any) => {
    state = { ...state, [key]: value }
    listeners.forEach((listener) => listener(state))
  }

  return {
    ...localState,
    setFilter,
  }
}
