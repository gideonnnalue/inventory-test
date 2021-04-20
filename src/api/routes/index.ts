import { Router } from 'express';
import itemRoute from './item';

const router = Router();

// router.use('/item', itemRoute);
router.use('/', itemRoute);

export default router;
