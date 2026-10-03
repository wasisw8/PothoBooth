import { create } from 'zustand'

interface BoothState {
  selectedTemplate: string | null
  selectedFilter: string | null
  capturedPhotos: string[]
  mode: 'single' | 'strip'
  transactionId: string | null
  sessionExpiresAt: Date | null
  setTemplate: (id: string | null) => void
  setFilter: (filter: string | null) => void
  addPhoto: (photo: string) => void
  removePhoto: (index: number) => void
  clearPhotos: () => void
  setMode: (mode: 'single' | 'strip') => void
  setTransaction: (id: string, expiresAt: Date) => void
  reset: () => void
}

export const useBoothStore = create<BoothState>((set) => ({
  selectedTemplate: null,
  selectedFilter: null,
  capturedPhotos: [],
  mode: 'single',
  transactionId: null,
  sessionExpiresAt: null,
  setTemplate: (id) => set({ selectedTemplate: id }),
  setFilter: (filter) => set({ selectedFilter: filter }),
  addPhoto: (photo) => set((state) => ({ capturedPhotos: [...state.capturedPhotos, photo] })),
  removePhoto: (index) => set((state) => ({ capturedPhotos: state.capturedPhotos.filter((_, i) => i !== index) })),
  clearPhotos: () => set({ capturedPhotos: [] }),
  setMode: (mode) => set({ mode }),
  setTransaction: (id, expiresAt) => set({ transactionId: id, sessionExpiresAt: expiresAt }),
  reset: () => set({
    selectedTemplate: null,
    selectedFilter: null,
    capturedPhotos: [],
    mode: 'single',
    transactionId: null,
    sessionExpiresAt: null,
  }),
}))
