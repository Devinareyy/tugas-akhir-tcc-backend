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
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const prisma = new client_1.PrismaClient();
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
app.get('/notes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allNotes = yield prisma.note.findMany({
        orderBy: {
            created_at: 'desc',
        },
    });
    res.json({
        status: "SUCCESS",
        notes: allNotes,
    });
}));
app.get('/notes/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const noteId = Number(id);
    if (isNaN(noteId)) {
        return res.status(500).json({
            status: "ERROR"
        });
    }
    const note = yield prisma.note.findFirst({
        where: {
            id: noteId
        }
    });
    if (!note) {
        return res.status(404).json({
            status: "ERROR",
            note: null,
        });
    }
    res.json({
        status: "SUCCESS",
        note: note,
    });
}));
app.delete('/notes/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const noteId = Number(id);
    if (isNaN(noteId)) {
        return res.status(500).json({
            status: "ERROR"
        });
    }
    const note = yield prisma.note.findFirst({
        where: {
            id: noteId
        }
    });
    if (!note) {
        return res.status(404).json({
            status: "ERROR",
        });
    }
    yield prisma.note.delete({
        where: {
            id: noteId,
        }
    });
    res.json({
        status: "SUCCESS",
    });
}));
app.put('/notes/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content } = req.body;
    const { id } = req.params;
    const noteId = Number(id);
    if (isNaN(noteId)) {
        return res.status(500).json({
            status: "ERROR"
        });
    }
    if (!title || !content) {
        return res.status(500).json({
            status: "ERROR"
        });
    }
    const note = yield prisma.note.findFirst({
        where: {
            id: noteId
        }
    });
    if (!note) {
        return res.status(404).json({
            status: "ERROR",
        });
    }
    const newNote = yield prisma.note.update({
        data: {
            title: title,
            content: content,
        },
        where: {
            id: noteId,
        }
    });
    return res.json({
        status: "SUCCESS",
        newNote,
    });
}));
app.post('/notes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(500).json({
            status: "ERROR"
        });
    }
    const note = yield prisma.note.create({
        data: {
            title: title,
            content: content,
        }
    });
    return res.json({
        status: "SUCCESS",
        note,
    });
}));
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
