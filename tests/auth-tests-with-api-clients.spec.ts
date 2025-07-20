import { expect, test } from '@playwright/test'
import { ApiClient } from './api-client'
import { StatusCodes } from 'http-status-codes'

test('login and create order with api client', async ({ request }) => {
  const apiClient = await ApiClient.getInstance(request)
  const orderId = await apiClient.createOrderAndReturnOrderId()
  console.log('orderId:', orderId)
})

test('login, create order and delete existing order with api client', async ({ request }) => {
  const apiClient = await ApiClient.getInstance(request)
  const orderId = await apiClient.createOrderAndReturnOrderId()
  const response = await apiClient.delectOrder(orderId)
  console.log('Deleting orderId:', orderId)
  expect.soft(response.status()).toBe(StatusCodes.OK)
  expect.soft(response.body).toBeTruthy()
})

test('login and delete order by invalid data type with api client', async ({ request }) => {
  const apiClient = await ApiClient.getInstance(request)
  const orderId = 'a'
  const response = await apiClient.delectOrder(orderId)
  console.log('Deleting orderId:', orderId)
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
})
