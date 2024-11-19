import { expect, test } from '@playwright/test'
import { LoginDto } from './dto/LoginDto'
import { StatusCodes } from 'http-status-codes'
import { JWTchecker } from '../src/JWTchecker'
import { decodeJWT } from '../src/funcTextToJson'

const serviceURL = 'https://backend.tallinn-learning.ee/'
const loginPath = 'login/student'
let jwtchecker: JWTchecker

test.beforeEach(() => {
  jwtchecker = new JWTchecker()
})

test.describe('Tests for POST login/student', () => {
  test.describe('Tests from lesson 11', () => {
    test('login with correct data', async ({ request }) => {
      const requestBody = LoginDto.createLoginWithCorrectData()
      const response = await request.post(`${serviceURL}${loginPath}`, {
        data: requestBody,
      })
      const responseBody = await response.text()

      const jwt = responseBody

      expect.soft(jwt).toBeDefined()

      const decodedJWT = decodeJWT(jwt)

      expect.soft(decodedJWT.apiKey).toBe(jwt)

      const exp = decodedJWT.exp

      const expDate = new Date(exp * 1000) 

      expect(expDate.getTime()).toBeGreaterThan(new Date().getTime()) 
      expect.soft(decodedJWT.sub).toBeDefined()
      expect.soft(decodedJWT.exp).toBeDefined()
      expect.soft(decodedJWT.iat).toBeDefined()
      expect.soft(decodedJWT.apiKey).toBeDefined()
      expect(response.status()).toBe(StatusCodes.OK)
    })

    test('login with incorrect data', async ({ request }) => {
      const requestBody = LoginDto.createLoginWithIncorrectData()
      const response = await request.post(`${serviceURL}${loginPath}`, {
        data: requestBody,
      })
      const responseBody = await response.text()
      expect(jwtchecker.isValidJWT(responseBody)).toBe(false)
      expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
    })

    test.describe('Tests from Homework 11', () => {
      test('login with valid data should return valid JWT in response', async ({ request }) => {
        const requestBody = LoginDto.createLoginWithCorrectData()
        const response = await request.post(`${serviceURL}${loginPath}`, {
          data: requestBody,
        })
        expect(response.status()).toBe(StatusCodes.OK)
        const responseBody = await response.text()
        expect(jwtchecker.isValidJWT(responseBody)).toBe(true)
      })

      test('should return no JWT in response if unauthorized', async ({ request }) => {
        const requestBody = LoginDto.createLoginWithIncorrectData()
        const response = await request.post(`${serviceURL}${loginPath}`, {
          data: requestBody,
        })
        expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
        const responseBody = await response.text()
        expect(jwtchecker.isValidJWT(responseBody)).toBe(false)
      })

      test('invalid http request method, should return status code 405', async ({ request }) => {
        const requestBody = LoginDto.createLoginWithCorrectData()
        const response = await request.put(`${serviceURL}${loginPath}`, {
          data: requestBody,
        })
        expect(response.status()).toBe(StatusCodes.METHOD_NOT_ALLOWED)
        const responseBody = await response.text()
        expect(jwtchecker.isValidJWT(responseBody)).toBe(false)
      })
    })
  })
})
