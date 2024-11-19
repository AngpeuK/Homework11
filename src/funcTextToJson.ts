export function decodeJWT(jwt: string): { [key: string]: any } {
  try {
    const [header, payload, signature] = jwt.split('.')

    if (!header || !payload || !signature) {
      throw new Error('invalid JWT')
    }

    const base64Payload = payload.replace(/-/g, '+').replace(/_/g, '/')

    const decodedPayload = Buffer.from(base64Payload, 'base64').toString('utf-8')

    const parsedPayload = JSON.parse(decodedPayload)

    return {
      ...parsedPayload,
      apiKey: jwt,
    }
  } catch (error) {
    throw new Error(`JWT Decoding Error: ${error instanceof Error ? error.message : String(error)}`)
  }
}
