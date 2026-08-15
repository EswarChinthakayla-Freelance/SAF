import { create } from 'zustand'

interface UIState {
  isSearchOpen: boolean
  isMobileMenuOpen: boolean
  activeRoomFilter: string
  openSearch: () => void
  closeSearch: () => void
  toggleMobileMenu: () => void
  closeMobileMenu: () => void
  setActiveRoomFilter: (filter: string) => void
}

export const useUIStore = create<UIState>((set) => ({
  isSearchOpen: false,
  isMobileMenuOpen: false,
  activeRoomFilter: 'All',
  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  setActiveRoomFilter: (filter) => set({ activeRoomFilter: filter }),
}))
