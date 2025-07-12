import { expect, test } from '@playwright/test'

import { StatusCodes } from 'http-status-codes'

import { OrderDto } from './dto/order-dto'

test('get order with correct id should receive code 200', async ({ request }) => {
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/1')
  expect(response.status()).toBe(200)
})

test('post order with correct data should receive code 201', async ({ request }) => {
  const requestBody = OrderDto.createNewRandomOrderObject()
  const response = await request.post('https://backend.tallinn-learning.ee/test-orders', {
    data: requestBody,
  })
  expect(response.status()).toBe(StatusCodes.OK)
})

test('get order with orderId 0 data should receive code 400', async ({ request }) => {
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/0', {})
  const responseBody = await response.json()
  expect.soft(response.status()).toBe(StatusCodes.BAD_REQUEST)
  expect.soft(responseBody.message).toBe('getById.id: must be greater than or equal to 1')
})

test('get order with orderId 11 data should receive code 400', async ({ request }) => {
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/11', {})
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
})

test('get order with empty orderId data should receive code 400', async ({ request }) => {
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/', {})
  expect(response.status()).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
})

test('get order with string orderId data should receive code 400', async ({ request }) => {
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders/test', {})
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
})

test('post order with incorrect data type should receive code 415', async ({ request }) => {
  const response = await request.post('https://backend.tallinn-learning.ee/test-orders', {
    data: 'string',
  })
  expect(response.status()).toBe(StatusCodes.UNSUPPORTED_MEDIA_TYPE)
})
