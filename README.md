# Country Explorer — PC02

Aplicación **Vue 3 (Composition API, `<script setup>`) + Quasar** que consume la API pública **RestCountries** para explorar países: listado con búsqueda y filtro, vista de detalle y panel de tipo de cambio.

## Cómo ejecutarlo

1. Registra tu API key gratuita en https://restcountries.com/sign-up
2. Copia `.env.example` como `.env` y pega tu key:
   ```
   QCLI_RESTCOUNTRIES_KEY=rc_live_tu_key
   ```
   > Quasar solo expone al navegador las variables que empiezan con `QCLI_`. Sin key se usa la demo `rc_live_demo` (datos de ejemplo).
3. Instala y levanta:
   ```bash
   npm install
   npx quasar dev
   ```

## Endpoints usados

| Uso | Endpoint |
|---|---|
| Listado inicial | `GET /countries/v5` |
| Búsqueda por capital | `GET /countries/v5/capitals?q={texto}` |
| Filtro por continente | `GET /countries/v5/region/{continente}` |
| Detalle de un país | `GET /countries/v5/codes.alpha_2/{codigo}` |
| Tasa de cambio | `GET /currencies/v1/rates/{codigoMoneda}` |
| Conversión | `GET /currencies/v1/convert?from={origen}&to=USD&amount={monto}` |

Autenticación: header `Authorization: Bearer <api_key>` (configurado en `src/boot/axios.js`).
Banderas: `https://flagcdn.com/{w80|w320|w640}/{alpha2}.png`.

## Estructura

```
src/
├─ boot/axios.js                 # instancias axios (countries / currencies) + manejo de errores
├─ utils/country.js              # continentes, URL de bandera, formatos
├─ stores/
│  ├─ countries-store.js         # listado, búsqueda, filtro, detalle, fronterizos
│  └─ currency-store.js          # tasa frente al USD y conversión
├─ components/
│  ├─ common/                    # LoadingState, ErrorState (reutilizables)
│  ├─ countries/                 # CountryFilter, CountryCard, CountryList, InfoItem, BorderList
│  └─ currency/                  # CurrencyChip, CurrencyDialog
└─ pages/
   ├─ index.vue                  # Pantalla 1: listado
   └─ pais/[code].vue            # Pantalla 2: detalle (reemplaza el listado)
```

## Estados de carga y error

- Spinner mientras carga el listado, el detalle, la tasa y la conversión.
- Banner de error con botón **Reintentar** (401 key inválida, 429 límite de requests, sin conexión).
- Búsqueda sin coincidencias (404 de la API) se muestra como lista vacía.
