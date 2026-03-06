"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const serviceController_1 = require("../controllers/serviceController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.get('/', serviceController_1.getServices);
router.post('/', authMiddleware_1.protect, authMiddleware_1.admin, serviceController_1.createService);
router.delete('/:id', authMiddleware_1.protect, authMiddleware_1.admin, serviceController_1.deleteService);
exports.default = router;
