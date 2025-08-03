import { APIRequestContext, APIResponse } from 'playwright'
import { LoginDto } from './dto/login-dto'
import { StatusCodes } from 'http-status-codes'
import { OrderDto } from './dto/order-dto'

const serviceURL = 'https://backend.tallinn-learning.ee/'
const loginPath = 'login/student'
const orderPath = 'orders'
const deletePath = 'orders/'
const searchPath = 'orders/'

export class ApiClient {
  static instance: ApiClient
  private request: APIRequestContext
  private jwt: string = ''

  private constructor(request: APIRequestContext) {
    this.request = request
  }

  public static async getInstance(request: APIRequestContext): Promise<ApiClient> {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient(request)
      await this.instance.requestJwt()
    }
    return ApiClient.instance
  }

  private async requestJwt(): Promise<void> {
    console.log('Requesting JWT...')
    const authResponse = await this.request.post(`${serviceURL}${loginPath}`, {
      data: LoginDto.createCorrectLoginData(),
    })
    // Check response status for negative cases
    if (authResponse.status() !== StatusCodes.OK) {
      console.log('Authorization failed')
      throw new Error(`Request failed with status ${authResponse.status()}`)
    }

    // Save the JWT token as a client property
    this.jwt = await authResponse.text()
    console.log('jwt received:')
    console.log(this.jwt)
    console.log('')
  }

  async createOrder(): Promise<APIResponse> {
    console.log('Creating order...')
    const response = await this.request.post(`${serviceURL}${orderPath}`, {
      data: OrderDto.createNewRandomOrderObject(),
      headers: {
        Authorization: `Bearer ${this.jwt}`,
      },
    })
    console.log('Creating finished')
    console.log('')
    return response
  }

  async delectOrder(orderId: number | string): Promise<APIResponse> {
    console.log('Deleting order...')
    const response = await this.request.delete(`${serviceURL}${deletePath}${orderId}`, {
      headers: {
        Authorization: `Bearer ${this.jwt}`,
      },
    })
    console.log('Deleting finished')
    console.log('')
    return response
  }

  async searchOrder(orderId: number): Promise<APIResponse> {
    console.log('Searching order...')
    const response = await this.request.get(`${serviceURL}${searchPath}${orderId}`, {
      headers: {
        Authorization: `Bearer ${this.jwt}`,
      },
    })
    console.log('Searching finished')
    console.log('')
    return response
  }
}
