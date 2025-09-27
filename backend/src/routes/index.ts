import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import interactionRoutes from './interaction.routes';

const router = Router();

// Mount all routes
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/interaction', interactionRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
  });
});

export default router;
