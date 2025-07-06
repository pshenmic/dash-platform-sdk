const cache: {
    [key: string]: string
} = {}

export async function getQuorumPublicKey(quorumType: number, quorumHash: string) {
    const cached = cache[`${quorumType}_${quorumHash}`]

    if (cached != null) {
        return cached
    }

    // typically http://localhost:19998/
    const baseUrl = 'https://trpc.digitalcash.dev/'
    const basicAuth = btoa('user:pass')
    const payload = JSON.stringify({
        method: 'quorum', params: ['info', quorumType, quorumHash]
    })
    const resp = await fetch(baseUrl, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${basicAuth}`, 'Content-Type': 'application/json'
        },
        body: payload
    })

    if (resp.status === 420) {
        throw new Error('Rate limit on Core RPC')
    }

    const data = await resp.json()

    if (data.error) {
        const err = new Error(data.error.message)
        Object.assign(err, data.error)
        throw err
    }

    const {quorumPublicKey} = data.result

    cache[`${quorumType}_${quorumHash}`] = quorumPublicKey

    return quorumPublicKey
}
