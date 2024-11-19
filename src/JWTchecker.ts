export class JWTchecker {
  isValidJWT(jwt: string): boolean {
    const jwtRegex = /^eyJhb[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/

    return jwtRegex.test(jwt)
  }
}
