class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number, name: string = "Error") {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = true;
    this.name = name;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
