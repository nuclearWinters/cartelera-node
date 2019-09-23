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
const router = express_1.default.Router();
const collection = "peliculas";
router.get('/get-movie', (req, res, next) => {
    const db = req.app.locals.db;
    db.collection(collection).find({}).toArray((err, documents) => {
        if (err) {
            next(err);
        }
        else {
            res.json(documents);
        }
    });
});
router.post('/post-movie', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const db = req.app.locals.db;
    const { Titulo, Director, Duración, Inicio_exhibición, Fin_exhibición } = req.body;
    let lastRecord = yield db.collection(collection).find().sort({ Creado: -1 }).limit(1).toArray();
    const dateNow = new Date().getTime();
    const dateLastRecord = new Date(lastRecord[0].Creado).getTime();
    const diffTime = Math.abs(dateNow - dateLastRecord);
    const diffSeconds = Math.floor(diffTime / (1000));
    if (diffSeconds >= 300) {
        db.collection(collection).insertOne({
            Titulo,
            Director,
            Duración,
            "Inicio exhibición": new Date(Inicio_exhibición),
            "Fin exhibición": new Date(Fin_exhibición),
            Creado: new Date(),
            Modificado: new Date()
        }).then(result => res.json(result)).catch(next);
    }
    else {
        res.status(429).json({ falta: 300 - diffSeconds });
    }
}));
exports.default = router;
