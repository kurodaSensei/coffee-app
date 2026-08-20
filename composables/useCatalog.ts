import {
  DEFAULT_PROCESS_OPTIONS,
  DEFAULT_BREW_METHOD_OPTIONS,
  DEFAULT_VARIETIES,
  DEFAULT_FLAVOR_NOTES,
} from '~/utils/constants'

export const useCatalog = () => {
  const settings = useSettingsStore()

  // Asegura que settings.prefs esté hidratado en cliente. Sin esto, si un
  // wizard se abre en frío (hard refresh a /app/coffees/new, deep link, etc.)
  // sin haber pasado antes por una página que llame settings.load(), los
  // customs (variedades, procesos, métodos, notas) no aparecen — solo los
  // defaults. Idempotente: si ya está cargado o cargando, no hace nada.
  if (import.meta.client && !settings.prefs && !settings.loading) {
    settings.load().catch(() => {})
  }

  const varieties = computed<string[]>(() => {
    const disabled = settings.prefs?.disabledVarieties ?? []
    const custom = settings.prefs?.customVarieties ?? []
    const defaults = DEFAULT_VARIETIES.filter(v => !disabled.includes(v))
    return [...defaults, ...custom].sort()
  })

  const processOptions = computed(() => {
    const disabled = settings.prefs?.disabledProcesses ?? []
    const custom = settings.prefs?.customProcesses ?? []
    const defaults = DEFAULT_PROCESS_OPTIONS.filter(p => !disabled.includes(p.value))
    return [...defaults, ...custom]
  })

  const brewMethodOptions = computed(() => {
    const disabled = settings.prefs?.disabledBrewMethods ?? []
    const custom = settings.prefs?.customBrewMethods ?? []
    const defaults = DEFAULT_BREW_METHOD_OPTIONS.filter(m => !disabled.includes(m.value))
    return [...defaults, ...custom]
  })

  const flavorNoteOptions = computed<string[]>(() => {
    const disabled = settings.prefs?.disabledFlavorNotes ?? []
    const custom = settings.prefs?.customFlavorNotes ?? []
    const defaults = DEFAULT_FLAVOR_NOTES.filter(n => !disabled.includes(n))
    return [...defaults, ...custom]
  })

  function getProcessLabel(value: string): string {
    const opt = processOptions.value.find(p => p.value === value)
    if (opt) return opt.label
    const defaultOpt = DEFAULT_PROCESS_OPTIONS.find(p => p.value === value)
    return defaultOpt?.label || value
  }

  function getBrewMethodLabel(value: string): string {
    const opt = brewMethodOptions.value.find(m => m.value === value)
    if (opt) return opt.label
    const defaultOpt = DEFAULT_BREW_METHOD_OPTIONS.find(m => m.value === value)
    return defaultOpt?.label || value
  }

  return {
    varieties,
    processOptions,
    brewMethodOptions,
    flavorNoteOptions,
    getProcessLabel,
    getBrewMethodLabel,
  }
}
