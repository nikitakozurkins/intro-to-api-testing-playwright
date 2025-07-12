export class LoginDto {
  username: string
  password: string

  private constructor(username: string, password: string) {
    this.username = username
    this.password = password
  }

  static createCorrectLoginData(): LoginDto {
    return new LoginDto(process.env.USER || '', process.env.PASSWORD || '')
  }

  static createIncorrectLoginData(): LoginDto {
    return new LoginDto('incorrect-username', 'incorrect-password')
  }
}
