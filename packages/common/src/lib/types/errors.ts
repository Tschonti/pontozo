export type PontozoError = {
  statusCode: number
  message: string
}

export class PontozoException extends Error {
  private msg: string
  public status: number

  constructor(msg: string, status: number) {
    super(msg)
    this.msg = msg
    this.status = status
    Object.setPrototypeOf(this, PontozoException.prototype)
  }

  public getError(): PontozoError {
    return {
      statusCode: this.status,
      message: this.msg,
    }
  }
}
