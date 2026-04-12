export const DEFAULT_PROCESS_OPTIONS = [
  { value: 'washed', label: 'Lavado' },
  { value: 'natural', label: 'Natural' },
  { value: 'honey', label: 'Honey' },
  { value: 'anaerobic', label: 'Anaeróbico' },
  { value: 'carbonic', label: 'Maceración Carbónica' },
  { value: 'experimental', label: 'Experimental' },
  { value: 'other', label: 'Otro' },
]

export const DEFAULT_BREW_METHOD_OPTIONS = [
  { value: 'v60', label: 'V60' },
  { value: 'kalita', label: 'Kalita' },
  { value: 'chemex', label: 'Chemex' },
  { value: 'aeropress', label: 'AeroPress' },
  { value: 'french_press', label: 'Prensa Francesa' },
  { value: 'origami', label: 'Origami' },
  { value: 'suiren', label: 'Suiren' },
  { value: 'espresso', label: 'Espresso' },
  { value: 'moka_pot', label: 'Moka' },
  { value: 'phin', label: 'Phin (Vietnamita)' },
  { value: 'cold_brew', label: 'Cold Brew' },
  { value: 'other', label: 'Otro' },
]

export const DEFAULT_VARIETIES = [
  'Caturra', 'Castillo', 'Colombia', 'Typica', 'Bourbon', 'Gesha', 'Pacamara',
  'Java', 'Tabí', 'Cenicafé 1', 'Pink Bourbon', 'Wush Wush', 'Sidra',
  'Sudan Rume', 'Eugenioides', 'SL28', 'SL34', 'Maragogipe', 'Laurina',
]

// Kept for backwards compatibility (used only where catalog isn't available)
export const PROCESS_OPTIONS = [
  { value: 'washed', label: 'Lavado' },
  { value: 'natural', label: 'Natural' },
  { value: 'honey', label: 'Honey' },
  { value: 'anaerobic', label: 'Anaeróbico' },
  { value: 'carbonic', label: 'Maceración Carbónica' },
  { value: 'experimental', label: 'Experimental' },
  { value: 'other', label: 'Otro' },
]

export const ROAST_LEVEL_OPTIONS = [
  { value: 'light', label: 'Claro' },
  { value: 'medium_light', label: 'Medio-Claro' },
  { value: 'medium', label: 'Medio' },
  { value: 'medium_dark', label: 'Medio-Oscuro' },
  { value: 'dark', label: 'Oscuro' },
]

export const BREW_METHOD_OPTIONS = [
  { value: 'v60', label: 'V60' },
  { value: 'kalita', label: 'Kalita' },
  { value: 'chemex', label: 'Chemex' },
  { value: 'aeropress', label: 'AeroPress' },
  { value: 'french_press', label: 'Prensa Francesa' },
  { value: 'origami', label: 'Origami' },
  { value: 'suiren', label: 'Suiren' },
  { value: 'espresso', label: 'Espresso' },
  { value: 'moka_pot', label: 'Moka' },
  { value: 'phin', label: 'Phin (Vietnamita)' },
  { value: 'cold_brew', label: 'Cold Brew' },
  { value: 'other', label: 'Otro' },
]

export const COLOMBIAN_REGIONS = [
  'Huila',
  'Nariño',
  'Antioquia',
  'Tolima',
  'Cundinamarca',
  'Cauca',
  'Santander',
  'Sierra Nevada',
  'Quindío',
  'Risaralda',
  'Caldas',
  'Valle del Cauca',
  'Putumayo',
  'Casanare',
]

export const COMMON_VARIETIES = [
  'Caturra',
  'Castillo',
  'Colombia',
  'Typica',
  'Bourbon',
  'Gesha',
  'Pacamara',
  'Java',
  'Tabí',
  'Cenicafé 1',
  'Pink Bourbon',
  'Wush Wush',
  'Sidra',
  'Sudan Rume',
  'Eugenioides',
  'SL28',
  'SL34',
  'Maragogipe',
  'Laurina',
]

export const RARITY_OPTIONS = [
  { value: 'common', label: 'Común', color: 'gray' },
  { value: 'uncommon', label: 'Poco común', color: 'green' },
  { value: 'rare', label: 'Raro', color: 'blue' },
  { value: 'very_rare', label: 'Muy raro', color: 'purple' },
]

export const PRIORITY_OPTIONS = [
  { value: 1, label: 'Baja' },
  { value: 2, label: 'Normal' },
  { value: 3, label: 'Media' },
  { value: 4, label: 'Alta' },
  { value: 5, label: 'Urgente' },
]

export const WISHLIST_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendiente', color: 'yellow' },
  { value: 'purchased', label: 'Comprado', color: 'green' },
  { value: 'unavailable', label: 'No disponible', color: 'gray' },
]
