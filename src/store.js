import { create } from 'zustand'

const initialTheme = () => {
  try { return localStorage.getItem('portfolio-theme') || 'system' } catch { return 'system' }
}
const initialResume = () => {
  try { return localStorage.getItem('portfolio-resume') || 'ai-fullstack' } catch { return 'ai-fullstack' }
}
const defaultBounds = (id) => {
  const w = Math.min(window.innerWidth - 32, id === 'resume' ? 1050 : id === 'finder' ? 920 : 840)
  const h = Math.min(window.innerHeight - 110, id === 'resume' ? 690 : 620)
  return { x: Math.max(16, (window.innerWidth - w) / 2), y: Math.max(50, (window.innerHeight - h) / 2 - 20), width: w, height: h }
}
const topVisible = (windows) => Object.values(windows).filter(w => !w.minimized).sort((a, b) => b.z - a.z)[0]?.id || null

export const useDesktop = create((set, get) => ({
  theme: initialTheme(),
  selectedResume: initialResume(),
  windows: {},
  activeId: null,
  nextZ: 10,
  mobileApp: null,
  finderPath: 'home',
  open(id) {
    if (window.innerWidth < 768) { set({ mobileApp: id }); return }
    set(state => {
      const z = state.nextZ + 1
      const previous = state.windows[id]
      return { nextZ: z, activeId: id, windows: { ...state.windows, [id]: previous ? { ...previous, minimized: false, z } : { id, z, minimized: false, maximized: false, bounds: defaultBounds(id), restoreBounds: null } } }
    })
  },
  close(id) { set(state => { const windows = { ...state.windows }; delete windows[id]; return { windows, activeId: topVisible(windows) } }) },
  focus(id) { set(state => { const w = state.windows[id]; if (!w || w.minimized) return state; const z = state.nextZ + 1; return { nextZ: z, activeId: id, windows: { ...state.windows, [id]: { ...w, z } } } }) },
  minimize(id) { set(state => { const windows = { ...state.windows, [id]: { ...state.windows[id], minimized: true } }; return { windows, activeId: topVisible(windows) } }) },
  maximize(id) { set(state => { const w = state.windows[id]; if (!w) return state; const maximized = !w.maximized; return { windows: { ...state.windows, [id]: { ...w, maximized, restoreBounds: maximized ? w.bounds : null, bounds: maximized ? { x: 16, y: 50, width: window.innerWidth - 32, height: window.innerHeight - 138 } : w.restoreBounds || defaultBounds(id) } } } }) },
  bounds(id, bounds) { set(state => { const w = state.windows[id]; if (!w) return state; return { windows: { ...state.windows, [id]: { ...w, bounds } } } }) },
  clampWindows() { set(state => ({ windows: Object.fromEntries(Object.entries(state.windows).map(([id, w]) => [id, { ...w, bounds: w.maximized ? { x: 16, y: 50, width: window.innerWidth - 32, height: window.innerHeight - 138 } : { ...w.bounds, width: Math.min(w.bounds.width, window.innerWidth - 32), height: Math.min(w.bounds.height, window.innerHeight - 110), x: Math.max(16, Math.min(w.bounds.x, window.innerWidth - Math.min(w.bounds.width, window.innerWidth - 32) - 16)), y: Math.max(50, Math.min(w.bounds.y, window.innerHeight - Math.min(w.bounds.height, window.innerHeight - 110) - 68)) } }])) })) },
  setTheme(theme) { try { localStorage.setItem('portfolio-theme', theme) } catch {} set({ theme }) },
  selectResume(id) { try { localStorage.setItem('portfolio-resume', id) } catch {} set({ selectedResume: id }) },
  setFinderPath(finderPath) { set({ finderPath }) },
  closeMobile() { set({ mobileApp: null }) }
}))
