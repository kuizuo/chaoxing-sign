export class ResOp<T = any> {
  readonly data!: T
  readonly code!: number
  readonly message!: string

  constructor(code: number, data: T, message = 'success') {
    this.code = code
    this.data = data
    this.message = message
  }

  static success<T>(data: T, message = 'success') {
    return new ResOp<T>(200, data, message)
  }

  static error(code: number, message: string) {
    return new ResOp(code, null, message)
  }
}
