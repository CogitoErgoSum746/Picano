import express, { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { login } from '../controllers/authController'

const router: Router = express.Router();

// Validation middleware for checking if errors occurred during validation
const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post('/login', [
    body('username', "Username cannot be blank").exists(),
    body('password', "Password cannot be blank").exists(),
], validate, login);

export default router;