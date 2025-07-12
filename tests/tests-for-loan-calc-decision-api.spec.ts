import { expect, test } from '@playwright/test'

import { StatusCodes } from 'http-status-codes'

import { LoanForRiskScoringDto } from './dto/loan-for-risk-scoring-dto'

import { OrderDto } from './dto/order-dto'

test('Successful request should receive 200 with high risk level', async ({ request }) => {
  const requestBody = new LoanForRiskScoringDto(1000, 0, 18, true, 100, 3)
  const response = await request.post(
    'https://backend.tallinn-learning.ee/api/loan-calc/decision',
    {
      data: requestBody,
    },
  )
  const responseBody = await response.json()
  expect.soft(response.status()).toBe(StatusCodes.OK)
  expect.soft(responseBody.riskLevel).toBe('High Risk')
})

test('Successful request should receive 200 with medium risk level', async ({ request }) => {
  const requestBody = new LoanForRiskScoringDto(20000, 0, 30, true, 500, 6)
  const response = await request.post(
    'https://backend.tallinn-learning.ee/api/loan-calc/decision',
    {
      data: requestBody,
    },
  )
  const responseBody = await response.json()
  expect.soft(response.status()).toBe(StatusCodes.OK)
  expect.soft(responseBody.riskLevel).toBe('Medium Risk')
})

test('Successful request should receive 200 with low risk level', async ({ request }) => {
  const requestBody = new LoanForRiskScoringDto(100000, 0, 30, true, 500, 12)
  const response = await request.post(
    'https://backend.tallinn-learning.ee/api/loan-calc/decision',
    {
      data: requestBody,
    },
  )
  const responseBody = await response.json()
  expect.soft(response.status()).toBe(StatusCodes.OK)
  expect.soft(responseBody.riskLevel).toBe('Low Risk')
})

test('Invalid request with invalid DTO should receive 400', async ({ request }) => {
  const requestBody = OrderDto.createNewRandomOrderObject()
  const response = await request.post(
    'https://backend.tallinn-learning.ee/api/loan-calc/decision',
    {
      data: requestBody,
    },
  )
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
})

test('Invalid request with valid DTO but zero income should receive 400', async ({ request }) => {
  const requestBody = new LoanForRiskScoringDto(0, 0, 30, true, 500, 12)
  const response = await request.post(
    'https://backend.tallinn-learning.ee/api/loan-calc/decision',
    {
      data: requestBody,
    },
  )
  expect(response.status()).toBe(StatusCodes.BAD_REQUEST)
})
