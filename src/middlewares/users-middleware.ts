import { type Request, type Response, type NextFunction } from 'express';

const usersMiddleware = function (req: Request, res: Response, next: NextFunction) {
  console.log(`Users route: ${req.method} ${req.originalUrl}`);
  next();
};

export default usersMiddleware;