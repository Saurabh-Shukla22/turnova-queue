import { Router } from 'express';
import { getFavorites, toggleFavorite } from '../controllers/favorite.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticate, getFavorites);
router.post('/:businessId', authenticate, toggleFavorite);

export default router;
