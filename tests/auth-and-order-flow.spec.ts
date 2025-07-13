import { expect, test } from '@playwright/test'
import { StatusCodes } from 'http-status-codes'
import { LoginDto } from './dto/login-dto'
import { OrderDto } from './dto/order-dto'

const serviceURL = 'https://backend.tallinn-learning.ee/'
const loginPath = 'login/student'
const orderPath = 'orders'

const jwtPattern = /^eyJhb[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/

test.describe('Tallinn delivery API tests', () => {
  test('login with correct data and verify auth token', async ({ request }) => {
    const requestBody = LoginDto.createCorrectLoginData()
    const response = await request.post(`${serviceURL}${loginPath}`, {
      data: requestBody,
    })
    const jwtToken = await response.text()
    expect(response.status()).toBe(StatusCodes.OK)
    expect(jwtPattern.test(jwtToken)).toBeTruthy()
  })

  test('login with incorrect data and verify response code 401', async ({ request }) => {
    const requestBody = LoginDto.createIncorrectLoginData()
    const response = await request.post(`${serviceURL}${loginPath}`, {
      data: requestBody,
    })
    const responseBody = await response.text()
    expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
    expect(responseBody).toBe('')
  })

  test('login and create order', async ({ request }) => {
    const requestBody = LoginDto.createCorrectLoginData()
    const response = await request.post(`${serviceURL}${loginPath}`, {
      data: requestBody,
    })
    const jwt = await response.text()
    const orderResponse = await request.post(`${serviceURL}${orderPath}`, {
      data: OrderDto.createOrderWithoutId(),
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    const orderResponseBody = await orderResponse.json()
    expect.soft(orderResponse.status()).toBe(StatusCodes.OK)
    expect.soft(orderResponseBody.status).toBe('OPEN')
    expect.soft(orderResponseBody.id).toBeDefined()
  })

  test('login with incorrect http method should receive 405', async ({ request }) => {
    const requestBody = LoginDto.createCorrectLoginData()
    const response = await request.put(`${serviceURL}${loginPath}`, {
      data: requestBody,
    })
    expect(response.status()).toBe(StatusCodes.METHOD_NOT_ALLOWED)
  })

  test('login with incorrect body structure should receive 405', async ({ request }) => {
    const requestBody = { username: 'test', password: 'test', invalidField: 'invalidField' }
    const response = await request.put(`${serviceURL}${loginPath}`, {
      data: requestBody,
    })
    expect(response.status()).toBe(StatusCodes.METHOD_NOT_ALLOWED)
  })
})
