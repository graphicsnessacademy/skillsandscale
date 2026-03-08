"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sslController_1 = require("../controllers/sslController");
const router = express_1.default.Router();
router.post('/init', sslController_1.initPayment);
router.post('/success/:tranId', sslController_1.paymentSuccess);
router.post('/fail/:tranId', sslController_1.paymentFail);
router.post('/cancel/:tranId', sslController_1.paymentCancel);
exports.default = router;
