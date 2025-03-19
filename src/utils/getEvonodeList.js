export default async function getEvonodeList (network) {
  const baseUrl = {
    testnet: 'https://trpc.digitalcash.dev',
    mainnet: 'https://rpc.digitalcash.dev',
  }[network]

  //let basicAuth = btoa(`user:pass`);
  let payload = JSON.stringify({
    'method': 'masternodelist',
    'params': [
      'evo'
    ]
  })

  let resp = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      // "Authorization": `Basic ${basicAuth}`,
      'Content-Type': 'application/json',
    },
    body: payload,
  })

  let data = await resp.json()

  if (data.error) {
    let err = new Error(data.error.message)
    Object.assign(err, data.error)
    throw err
  }

  return data.result

}

