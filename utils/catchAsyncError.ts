import { NextFunction, Request, RequestHandler, Response } from 'express';

const CatchAsyncError = (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default CatchAsyncError;
