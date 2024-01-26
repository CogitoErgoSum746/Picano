import { Request, Response, NextFunction } from 'express';

// 404 Not Found Error Handler
export const handle404 = (req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
  return;
};

// 500 Internal Server Error Handler
export const handle500 = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
  return;
};
