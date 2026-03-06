"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteService = exports.createService = exports.getServices = void 0;
const Service_1 = __importDefault(require("../models/Service"));
const getServices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const services = yield Service_1.default.find({}).sort({ category: 1 });
        res.json(services);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getServices = getServices;
const createService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const service = yield Service_1.default.create(req.body);
        res.status(201).json(service);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.createService = createService;
const deleteService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Service_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: 'Service removed' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteService = deleteService;
