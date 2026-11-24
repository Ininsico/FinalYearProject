import { env } from '../config/env.js'
import { reconcilePayments } from './payments.js'
import { activateSubscription } from './subscriptions.js'

let timer = null
let running = false

async function tick() {
  if (running) return
  running = true

  try {
    const { changed, intents } = await reconcilePayments()

    for (const id of changed) {
      const intent = intents.find((row) => row.id === id)
      if (!intent) continue
      if (intent.status !== 'confirmed' && intent.status !== 'overpaid') continue

      await activateSubscription({
        accountType: intent.accountType,
        id: String(intent.accountId).split(':')[1],
        planId: intent.planId,
        provider: 'crypto',
        reference: intent.consumedTxIds?.[0] ?? intent.reference,
      })
    }

    if (changed.length > 0) {
      console.log(`[payments] settled ${changed.length} payment intent(s)`)
    }
  } catch (error) {
    console.error(`[payments] reconcile failed: ${error.message}`)
  } finally {
    running = false
  }
}

/**
 * Background listener: polls Binance's deposit history and settles any intent
 * whose deposit has arrived. Read-only — it never moves funds.
 */
export function startPaymentWatcher() {
  if (timer) return

  if (!env.binance.configured) {
    console.log('[payments] watcher disabled: Binance is not configured')
    return
  }

  const everyMs = Math.max(10, env.payments.pollSeconds) * 1000
  timer = setInterval(tick, everyMs)

  if (typeof timer.unref === 'function') timer.unref()

  console.log(
    `[payments] watching ${env.binance.coin} deposits on ${env.binance.network} every ${everyMs / 1000}s`
  )

  void tick()
}

export function stopPaymentWatcher() {
  if (timer) clearInterval(timer)
  timer = null
}

export { tick as reconcileOnce }
