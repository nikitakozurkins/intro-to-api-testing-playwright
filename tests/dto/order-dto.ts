export class OrderDto {
  status: string
  courierId: number
  customerName: string
  customerPhone: string
  comment: string
  id: number | null

  private constructor(
    status: string,
    courierId: number,
    customerName: string,
    customerPhone: string,
    comment: string,
    id: number | null,
  ) {
    this.status = status
    this.courierId = courierId
    this.customerName = customerName
    this.customerPhone = customerPhone
    this.comment = comment
    this.id = id
  }

  static createNewRandomOrderObject(): OrderDto {
    return new OrderDto(
      'OPEN',
      Math.floor(Math.random() * 100),
      'string',
      'string',
      'string',
      Math.floor(Math.random() * 100),
    )
  }

  static createOrderWithoutId(): OrderDto {
    return new OrderDto(
      'OPEN',
      Math.floor(Math.random() * 100),
      'John Doe',
      '+123456789',
      'Urgent order',
      null,
    )
  }
}
