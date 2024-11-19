export function decodeJWT(jwt: string): { [key: string]: any } {
  try {
    // Split JWT into 3 pieces
    const [header, payload, signature] = jwt.split('.')

    // Verify that all 3 pieces exist
    if (!header || !payload || !signature) {
      throw new Error('invalid JWT')
    }

    // Transform Base64URL to Base64 (replace symbols)
    const base64Payload = payload.replace(/-/g, '+').replace(/_/g, '/')

    // Decode payload from Base64 to string UTF-8
    const decodedPayload = Buffer.from(base64Payload, 'base64').toString('utf-8')

    // Transform string to JSON (now it will be as an object)
    const parsedPayload = JSON.parse(decodedPayload)

    return {
      ...parsedPayload,
      apiKey: jwt, // add jwt value into field
    }
  } catch (error) {
    throw new Error(`JWT Decoding Error: ${error instanceof Error ? error.message : String(error)}`)
  }
}
