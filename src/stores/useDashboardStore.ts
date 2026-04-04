import { useState, useEffect } from 'react'

export type StoreState = {
  turma: string
  disciplina: string
  selectedStudentId: string | null
}

let state: StoreState = {
  turma: 'Todas',
  disciplina: 'Todas',
  selectedStudentId: null,
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

  const setFilter = (key: keyof StoreState, value: string | null) => {
    state = { ...state, [key]: value }
    listeners.forEach((listener) => listener(state))
  }

  return {
    ...localState,
    setFilter,
  }
}
