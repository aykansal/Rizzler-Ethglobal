import { Router, Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { loginSchema, signupSchema } from '../types';

const router = Router();
const authService = new AuthService();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const validation = loginSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validation.error.errors,
      });
    }

    const result = await authService.login(validation.data);
    const statusCode = result.success ? 200 : 400;
    
    res.status(statusCode).json(result);
  } catch (error) {
    console.error('Login route error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// POST /api/auth/signup
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const validation = signupSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validation.error.errors,
      });
    }

    const result = await authService.signup(validation.data);
    const statusCode = result.success ? 201 : 400;
    
    res.status(statusCode).json(result);
  } catch (error) {
    console.error('Signup route error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export default router;
