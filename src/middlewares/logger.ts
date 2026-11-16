import { type Request, type Response, type NextFunction } from 'express';

const logger = function (req: Request, res: Response, next: NextFunction) {

  res.on('finish', () => {
    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode}`,
    );
  });

  next();
};

export default logger;