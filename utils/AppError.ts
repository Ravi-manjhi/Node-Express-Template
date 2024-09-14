class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  constructor(message: string, statusCode: number, name?: string) {
    super(message);

    this.message = message;
    this.isOperational = true;
    this.statusCode = statusCode;
    this.name = name || 'Error';
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
