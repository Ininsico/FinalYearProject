/**
 * Binance READ-ONLY client (ported from the NasCom reference implementation).
 *
 * Every call here is a signed read against a read endpoint (balances, deposit
 * history, deposit address). There is deliberately no generic request helper,
 * so nothing in this module can reach an order, transfer or withdrawal route.
 */
import { createHmac } from 'node:crypto'
import { env } from '../config/env.js'

const config = env.binance

function sign(query) {
  return createHmac('sha256', config.apiSecret).update(query).digest('hex')
}

async function signedGet(path, params = {}) {
  if (!config.configured) {
    throw new Error('Binance is not configured')
  }

  const query = new URLSearchParams({
    ...params,
    recvWindow: '5000',
    timestamp: String(Date.now()),
  }).toString()

  const url = `${config.baseUrl}${path}?${query}&signature=${sign(query)}`

  let response

  try {
    response = await fetch(url, {
      method: 'GET',
      headers: { 'X-MBX-APIKEY': config.apiKey },
    })
  } catch {
    throw new Error('Binance is unreachable from this server')
  }

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const error = new Error(payload?.msg ?? `Binance replied with status ${response.status}`)
    error.binanceCode = payload?.code ?? null
    error.status = response.status === 429 ? 429 : 502
    throw error
  }

  return payload
}

/** Read-only: server time — connectivity and clock sanity check. */
export async function serverTime() {
  const response = await fetch(`${config.baseUrl}/api/v3/time`)
  if (!response.ok) throw new Error(`Binance time check failed with ${response.status}`)
  return response.json()
}

/** Read-only: spot wallet balances. */
export function accountBalances() {
  return signedGet('/api/v3/account')
}

/** Read-only: deposit history for one coin. */
export function depositHistory({ coin, startTime, limit = 100 } = {}) {
  const params = { limit: String(limit) }

  if (coin) params.coin = coin
  if (startTime) params.startTime = String(Math.max(0, startTime - 60000))

  return signedGet('/sapi/v1/capital/deposit/hisrec', params)
}

/** Read-only: the deposit address for a coin/network pair. */
export function depositAddress({ coin, network }) {
  return signedGet('/sapi/v1/capital/deposit/address', { coin, network })
}

/** Read-only public price feed. */
export async function tickerPrices() {
  const response = await fetch(`${config.baseUrl}/api/v3/ticker/price`)

  if (!response.ok) {
    throw new Error(`Binance price feed replied with status ${response.status}`)
  }

  return response.json()
}
