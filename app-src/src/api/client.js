import { API_BASE } from './endpoints'
import { session } from '@/stores/session'
import { t } from '@/i18n'

// Stringa Authorization usata prima del login (identica alla v2 funzionante).
const DEFAULT_AUTH = '%4sa123fsd9&0=££'

export class ApiError extends Error {
  constructor(message, status = 0, raw = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.raw = raw
  }
}

/**
 * POST verso l'API v3. Replica gli header che il backend si aspetta.
 * Restituisce il payload JSON {hasError, data, keys, ...} oppure lancia ApiError.
 *
 * @param {string} endpoint  es. 'login'
 * @param {object} data      body JSON
 * @param {object} opts      { absorb?: boolean } se true assorbe data.keys nello store
 */
export async function api(endpoint, data = {}, opts = {}) {
  const token = session.token
  const headers = {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : DEFAULT_AUTH,
    authtoken: 'CRPXPR',
    datatype: 'JSON',
  }

  let res
  try {
    res = await fetch(API_BASE + endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(data || {}),
    })
  } catch (e) {
    throw new ApiError(t('common.cannotContact'), 0)
  }

  let json
  try {
    json = await res.json()
  } catch (e) {
    throw new ApiError(t('common.genericError'), res.status)
  }

  if (!res.ok && json == null) {
    throw new ApiError(t('common.genericError'), res.status)
  }

  if (json && json.hasError) {
    const msg = json.statusMessage || json.messaggio || t('common.genericError')
    throw new ApiError(msg, res.status, json)
  }

  if (opts.absorb !== false) {
    session.absorb(json)
  }

  return json
}
