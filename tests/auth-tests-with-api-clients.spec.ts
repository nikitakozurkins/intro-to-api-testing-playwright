import { expect, test } from '@playwright/test'
import { ApiClient } from './api-client'
import { StatusCodes } from 'http-status-codes'

test.describe('Authentication and order flow tests using api client', () => {
  test('login and create order with api client', async ({ request }) => {
    const apiClient = await ApiClient.getInstance(request)
    const orderResponse = await apiClient.createOrder()
    const orderResponseBodyText = await orderResponse.text()
    expect.soft(orderResponse.status()).toBe(StatusCodes.OK)
    expect.soft(orderResponseBodyText).not.toBe('')
  })

  test('login, create order and delete existing order with api client', async ({ request }) => {
    const apiClient = await ApiClient.getInstance(request)
    const orderResponse = await apiClient.createOrder()
    const orderResponseBody = await orderResponse.json()
    const deleteResponse = await apiClient.delectOrder(orderResponseBody.id)
    expect.soft(deleteResponse.status()).toBe(StatusCodes.OK)
    expect.soft(deleteResponse.body).toBeTruthy()
  })

  test('login and delete order by invalid data type with api client', async ({ request }) => {
    const apiClient = await ApiClient.getInstance(request)
    const orderId = 'a'
    const deleteResponse = await apiClient.delectOrder(orderId)
    expect(deleteResponse.status()).toBe(StatusCodes.BAD_REQUEST)
  })

  test('login, create order, search created order by id, compare sent and received', async ({
    request,
  }) => {
    const apiClient = await ApiClient.getInstance(request)
    const orderResponse = await apiClient.createOrder()
    const orderResponseBody = await orderResponse.json()
    const searchResponse = await apiClient.searchOrder(orderResponseBody.id)
    const searchResponseBody = await searchResponse.json()
    expect.soft(orderResponse.status()).toBe(StatusCodes.OK)
    expect.soft(searchResponse.status()).toBe(StatusCodes.OK)
    expect.soft(orderResponseBody.id).toBe(searchResponseBody.id)
    expect.soft(orderResponseBody.status).toBe(searchResponseBody.status)
    expect.soft(orderResponseBody.comment).toBe(searchResponseBody.comment)
    expect.soft(orderResponseBody.courierId).toBe(searchResponseBody.courierId)
    expect.soft(orderResponseBody.customerName).toBe(searchResponseBody.customerName)
    expect.soft(orderResponseBody.customerPhone).toBe(searchResponseBody.customerPhone)
  })

  test('login, create order, delete created order by id, search deleted order to verify deletion', async ({
    request,
  }) => {
    const apiClient = await ApiClient.getInstance(request)
    const orderResponse = await apiClient.createOrder()
    const orderResponseBody = await orderResponse.json()
    const deleteResponse = await apiClient.delectOrder(orderResponseBody.id)
    const searchResponse = await apiClient.searchOrder(orderResponseBody.id)
    const searchResponseBodyText = await searchResponse.text()
    expect.soft(orderResponse.status()).toBe(StatusCodes.OK)
    expect.soft(deleteResponse.status()).toBe(StatusCodes.OK)
    expect.soft(deleteResponse.body).toBeTruthy()
    expect.soft(searchResponse.status()).toBe(StatusCodes.OK)
    expect.soft(searchResponseBodyText).toBe('')
  })
})
