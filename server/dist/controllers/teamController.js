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
exports.deleteMember = exports.updateMember = exports.createMember = exports.getTeam = void 0;
const Team_1 = __importDefault(require("../models/Team"));
const getTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const team = yield Team_1.default.find({}).sort({ createdAt: -1 });
        const stats = {
            total: team.length,
            developers: team.filter(m => m.role.toLowerCase().includes('developer')).length,
            designers: team.filter(m => m.role.toLowerCase().includes('designer')).length,
            marketers: team.filter(m => m.role.toLowerCase().includes('marketing') || m.role.toLowerCase().includes('strategist')).length,
        };
        res.json({ team, stats });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getTeam = getTeam;
const createMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const member = yield Team_1.default.create(req.body);
        res.status(201).json(member);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.createMember = createMember;
const updateMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const member = yield Team_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(member);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.updateMember = updateMember;
const deleteMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Team_1.default.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Member deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.deleteMember = deleteMember;
