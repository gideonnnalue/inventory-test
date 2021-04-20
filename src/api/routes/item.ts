import { Router } from 'express';
import itemController from '../controllers/item';

const router = Router();

router.post('/:item/add', itemController.addItem);
router.post('/:item/sell', itemController.sellItem);
router.get('/:item/quantity', itemController.getItem);

export default router;
