import { expect, test } from '@playwright/test'
import { LoginDto } from './dto/LoginDto'
import { StatusCodes } from 'http-status-codes'

const serviceURL = 'https://backend.tallinn-learning.ee/'
const loginPath = 'login/student'

test.describe('Tests for POST login/student', () => {
  test.describe('Tests from lesson 11', () => {
    test('login with correct data', async ({ request }) => {
      const requestBody = LoginDto.createLoginWithCorrectData()
      const response = await request.post(`${serviceURL}${loginPath}`, {
        data: requestBody,
      })
      const responseBody = await response.text()
      console.log('Response body: ', response.status())
      console.log('Response body: ', responseBody)
      expect(response.status()).toBe(StatusCodes.OK)
    })

    test('login with incorrect data', async ({ request }) => {
      const requestBody = LoginDto.createLoginWithIncorrectData()
      const response = await request.post(`${serviceURL}${loginPath}`, {
        data: requestBody,
      })
      const responseBody = await response.text()
      console.log('Response body: ', responseBody)
      expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
    })
  })
})
