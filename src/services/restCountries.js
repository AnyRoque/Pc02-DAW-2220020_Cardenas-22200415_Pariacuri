async function getObject(path, signal) {
  const key = import.meta.env.VITE_RESTCOUNTRIES_API_KEY?.trim()
  if (!key) throw new Error('Configura VITE_RESTCOUNTRIES_API_KEY en .env.local y reinicia el proyecto.')
  const response = await fetch('https://api.restcountries.com' + path, {
    headers: { Authorization: 'Bearer ' + key },
    signal,
  })
  if (!response.ok) throw new Error('La consulta falló (HTTP ' + response.status + ').')
  const body = await response.json()
  const object = body.data?.objects?.[0]
  if (!object) throw new Error('No se encontraron datos para esta consulta.')
  return object
}

export function getCountry(code, signal) {
  if (!/^[a-z]{2}$/i.test(code)) throw new Error('El código de país debe tener dos letras.')
  return getObject('/countries/v5/codes.alpha_2/' + code.toUpperCase(), signal)
}

export async function getUsdRate(code, signal) {
  const data = await getObject('/currencies/v1/rates/' + encodeURIComponent(code), signal)
  if (!Number.isFinite(data.rates?.USD)) throw new Error('La tasa en USD no está disponible.')
  return data.rates.USD
}

export async function convertToUsd(code, amount, signal) {
  const query = new URLSearchParams({ from: code, to: 'USD', amount })
  const data = await getObject('/currencies/v1/convert?' + query, signal)
  if (!Number.isFinite(data.result)) throw new Error('La conversión no está disponible.')
  return data.result
}
