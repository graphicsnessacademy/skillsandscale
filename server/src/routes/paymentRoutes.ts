import express from 'express';
import { initPayment, paymentSuccess, paymentFail, paymentCancel } from '../controllers/sslController';

const router = express.Router();

router.post('/init',            initPayment);
router.post('/success/:tranId', paymentSuccess);
router.post('/fail/:tranId',    paymentFail);
router.post('/cancel/:tranId',  paymentCancel);

export default router;