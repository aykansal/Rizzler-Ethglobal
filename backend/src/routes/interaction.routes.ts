import { Router, Request, Response } from 'express';
import { InteractionService } from '../services/interaction.service';
import { authenticateToken } from '../middleware/auth';
import { interactionSchema } from '../types';

const router = Router();
const interactionService = new InteractionService();

// POST /api/interaction - Create like/dislike interaction
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const validation = interactionSchema.safeParse(req.body);
    
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: validation.error.errors,
      });
    }

    const result = await interactionService.createInteraction(req.user.id, validation.data);
    const statusCode = result.success ? 200 : 400;
    
    res.status(statusCode).json(result);
  } catch (error) {
    console.error('Create interaction route error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// GET /api/interaction/matches - Get user's matches
router.get('/matches', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    const matches = await interactionService.getMatches(req.user.id);
    
    res.json({
      success: true,
      matches,
    });
  } catch (error) {
    console.error('Get matches route error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

export default router;
