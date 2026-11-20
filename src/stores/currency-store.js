import { defineStore } from 'pinia'
import { currenciesApi, getObjects, getErrorMessage } from '@/boot/axios'

export const useCurrencyStore = defineStore('currency', {
  state: () => ({
    currency: null, // { code, name, symbol }
    rateToUsd: null,
    asOf: null,
    rateLoading: false,
    rateErrorMessage: '',

    conversion: null,
    convertLoading: false,
    convertErrorMessage: '',
  }),
  getters: {
    usdToCurrency: (state) => (state.rateToUsd ? 1 / state.rateToUsd : null),
  },
  actions: {
    async open(currency) {
      this.currency = currency
      this.conversion = null
      this.convertErrorMessage = ''
      await this.fetchRate()
    },

    // GET /currencies/v1/rates/{codigoMoneda} -> rates.USD = USD por 1 unidad de la moneda
    async fetchRate() {
      if (!this.currency?.code) return

      this.rateLoading = true
      this.rateErrorMessage = ''
      this.rateToUsd = null

      try {
        if (this.currency.code === 'USD') {
          this.rateToUsd = 1
          this.asOf = null
          return
        }
        const response = await currenciesApi.get(`/rates/${encodeURIComponent(this.currency.code)}`)
        const [table] = getObjects(response)
        const rate = Number(table?.rates?.USD)
        if (!Number.isFinite(rate)) throw new Error('La API no devolvió la tasa frente al USD.')
        this.rateToUsd = rate
        this.asOf = table.as_of ?? null
      } catch (error) {
        this.rateErrorMessage = getErrorMessage(error, 'No se pudo obtener la tasa de cambio.')
      } finally {
        this.rateLoading = false
      }
    },

    // GET /currencies/v1/convert?from={origen}&to=USD&amount={monto}
    async convertToUsd(amount) {
      this.convertLoading = true
      this.convertErrorMessage = ''
      this.conversion = null

      try {
        const response = await currenciesApi.get('/convert', {
          params: { from: this.currency.code, to: 'USD', amount },
        })
        const [conversion] = getObjects(response)
        if (!conversion) throw new Error('La API no devolvió la conversión.')
        this.conversion = conversion
      } catch (error) {
        this.convertErrorMessage = getErrorMessage(error, 'No se pudo convertir el monto.')
      } finally {
        this.convertLoading = false
      }
    },
  },
})
