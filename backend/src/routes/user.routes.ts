import { Router, Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { authenticateToken } from '../middleware/auth';
import { userQuerySchema } from '../types';

const router = Router();
const userService = new UserService();

// GET /api/user - Get user by nfcId (from query/body)
router.get('/', async (req: Request, res: Response) => {
  try {
    // Check both query params and body for nfcId
    const nfcId = req.query.nfcId as string || req.body.nfcId;
    
    if (!nfcId) {
      return res.status(400).json({
        success: false,
        message: 'nfcId is required',
      });
    }

    const validation = userQuerySchema.safeParse({ nfcId });
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validation.error.errors,
      });
    }

    const user = await userService.getUserByNfcId(validation.data.nfcId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Get user route error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// GET /api/user/feed - Get user feed (opposite gender, not disliked)
router.get('/feed', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const result = await userService.getFeedForUser(req.user.id);
    const statusCode = result.success ? 200 : 400;
    
    res.status(statusCode).json(result);
  } catch (error) {
    console.error('Get feed route error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export default router;
