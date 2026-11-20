// Continentes: etiqueta en español -> valor "region" de la API
export const CONTINENTS = [
  { label: 'África', value: 'Africa' },
  { label: 'América', value: 'Americas' },
  { label: 'Asia', value: 'Asia' },
  { label: 'Europa', value: 'Europe' },
  { label: 'Oceanía', value: 'Oceania' },
  { label: 'Antártida', value: 'Antarctic' },
]

export function continentLabel(region) {
  return CONTINENTS.find((continent) => continent.value === region)?.label || region || '—'
}

// Banderas desde flagcdn.com (alpha-2 en minúsculas). Tamaños: w80, w160, w320
export function flagUrl(alpha2, size = 'w320') {
  return alpha2 ? `https://flagcdn.com/${size}/${alpha2.toLowerCase()}.png` : ''
}

export function countryName(country) {
  return country?.names?.common || 'Sin nombre'
}

export function primaryCapital(country) {
  const capitals = country?.capitals || []
  const capital = capitals.find((item) => item.attributes?.primary) || capitals[0]
  return capital?.name || 'Sin capital'
}

export function formatNumber(value) {
  return Number.isFinite(Number(value)) ? new Intl.NumberFormat('es-PE').format(value) : '—'
}

export function joinOrDash(values) {
  return Array.isArray(values) && values.length ? values.join(', ') : '—'
}

export function drivingSide(side) {
  if (side === 'left') return 'Izquierda'
  if (side === 'right') return 'Derecha'
  return '—'
}
