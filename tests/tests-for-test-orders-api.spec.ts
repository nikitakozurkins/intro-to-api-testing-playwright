import { expect, test } from '@playwright/test'

import { StatusCodes } from 'http-status-codes'

import { OrderDto } from './dto/order-dto'

test('successful get request with valid credentials should receive 200', async ({ request }) => {
  const response = await request.get(
    'https://backend.tallinn-learning.ee/test-orders?username=test&password=test',
    {},
  )
  expect(response.status()).toBe(StatusCodes.OK)
})

test('invalid get request when username and password are empty should receive 500', async ({
  request,
}) => {
  const response = await request.get(
    'https://backend.tallinn-learning.ee/test-orders?username=&password=',
    {},
  )
  expect(response.status()).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
})

test('invalid get request when request header is missing should receive 500', async ({
  request,
}) => {
  const response = await request.get('https://backend.tallinn-learning.ee/test-orders', {})
  expect(response.status()).toBe(StatusCodes.INTERNAL_SERVER_ERROR)
})

test('successful delete request should receive 204', async ({ request }) => {
  const requestHeader = {
    api_key: '1234567890123456',
  }
  const response = await request.delete('https://backend.tallinn-learning.ee/test-orders/1', {
    headers: requestHeader,
  })
  expect(response.status()).toBe(StatusCodes.NO_CONTENT)
})

test('invalid delete request with invalid api_key should receive 401', async ({ request }) => {
  const requestHeader = {
    api_key: '123456789012345x',
  }
  const response = await request.delete('https://backend.tallinn-learning.ee/test-orders/1', {
    headers: requestHeader,
  })
  expect(response.status()).toBe(StatusCodes.UNAUTHORIZED)
})

test('invalid delete request without api_key should receive 400', async ({ request }) => {
  const response = await request.delete('https://backend.tallinn-learning.ee/test-orders/1', {})
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
})

test('successful put request with valid data should receive 200', async ({ request }) => {
  const requestBody = OrderDto.createNewRandomOrderObject()
  const requestHeader = {
    api_key: '1234567890123456',
  }
  const response = await request.put('https://backend.tallinn-learning.ee/test-orders/1', {
    data: requestBody,
    headers: requestHeader,
  })
  expect(response.status()).toBe(StatusCodes.OK)
})

test('invalid put request without data should receive 400', async ({ request }) => {
  const requestHeader = {
    api_key: '1234567890123456',
  }
  const response = await request.put('https://backend.tallinn-learning.ee/test-orders/1', {
    headers: requestHeader,
  })
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
})

test('invalid put request without api_key in header should receive 400', async ({ request }) => {
  const requestBody = OrderDto.createNewRandomOrderObject()
  const response = await request.put('https://backend.tallinn-learning.ee/test-orders/1', {
    data: requestBody,
  })
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
})
