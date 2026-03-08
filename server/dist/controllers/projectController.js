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
exports.updateProjectSlot = exports.getProjects = void 0;
const Project_1 = __importDefault(require("../models/Project"));
const notificationHelper_1 = require("../utils/notificationHelper");
const getProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projects = yield Project_1.default.find().sort({ position: 1 });
        res.json(projects);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getProjects = getProjects;
const updateProjectSlot = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { position, title, category } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }
        let project = yield Project_1.default.findOne({ position: Number(position) });
        let isNew = false;
        if (project) {
            project.image = req.file.path;
            if (title)
                project.title = title;
            if (category)
                project.category = category;
            yield project.save();
        }
        else {
            isNew = true;
            project = yield Project_1.default.create({
                position: Number(position),
                image: req.file.path,
                title: title || `Project ${position}`,
                category: category || 'Branding'
            });
        }
        // 🔔 NOTIFICATION
        yield (0, notificationHelper_1.triggerNotification)('business', isNew ? 'New Project Added' : 'Project Slot Updated', isNew
            ? `"${project.title}" has been added to Bento Slot #${position}.`
            : `Bento Slot #${position} — "${project.title}" has been updated.`, '/admin/projects');
        res.status(200).json(project);
    }
    catch (error) {
        console.error('Project Upload Error:', error);
        res.status(500).json({ message: error.message });
    }
});
exports.updateProjectSlot = updateProjectSlot;
