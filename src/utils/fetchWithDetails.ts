/**
 * Collects human-readable details from a fetch error and its nested causes.
 * Node.js (undici) throws a generic `TypeError: fetch failed` and puts the real
 * reason (ECONNREFUSED, ENOTFOUND, certificate errors, timeouts...) in `error.cause`,
 * which may itself be nested or an AggregateError
 *
 * @param error {unknown}
 * @return {string[]}
 */
export function decodeFetchErrorDetails (error: unknown): string[] {
  const details: string[] = []
  const seen = new Set<unknown>()

  const visit = (err: unknown): void => {
    if (err == null || seen.has(err)) {
      return
    }

    seen.add(err)

    if (typeof err !== 'object') {
      details.push(String(err))

      return
    }

    const { code, message, cause, errors } = err as { code?: unknown, message?: unknown, cause?: unknown, errors?: unknown }

    const detail = [code, message]
      .filter(e => e != null && e !== '')
      .map(String)
      .filter((e, i, arr) => arr.indexOf(e) === i)
      .join(': ')

    if (detail !== '' && !details.includes(detail)) {
      details.push(detail)
    }

    if (Array.isArray(errors)) {
      errors.forEach(visit)
    }

    visit(cause)
  }

  visit(error)

  return details
}

/**
 * Wraps an error thrown by fetch into a new Error that includes the
 * request url and all nested causes in its message, keeping the original as `cause`
 *
 * @param error {unknown}
 * @param url {string}
 * @return {Error}
 */
export function decodeFetchError (error: unknown, url: string): Error {
  const [message, ...causes] = decodeFetchErrorDetails(error)

  const decoded = new Error(`${message ?? 'fetch failed'} (${url})${causes.length > 0 ? `: ${causes.join(' <- ')}` : ''}`, { cause: error })

  if (error instanceof Error) {
    decoded.name = error.name
  }

  return decoded
}

/**
 * Drop-in replacement for global fetch that rethrows network errors
 * with decoded details instead of opaque `fetch failed`
 */
export const fetchWithDetails: typeof globalThis.fetch = async (input, init) => {
  try {
    return await globalThis.fetch(input, init)
  } catch (e) {
    // keep abort errors untouched so callers can detect cancellation
    if (e instanceof Error && e.name === 'AbortError') {
      throw e
    }

    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url

    throw decodeFetchError(e, url)
  }
}
