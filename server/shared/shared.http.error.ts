
export class HttpError extends Error {
  public status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = new.target.name
    this.status = status

    
    if (typeof (Error as any).captureStackTrace === 'function') {
      (Error as any).captureStackTrace(this, new.target)
    }
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401)
  }
}
