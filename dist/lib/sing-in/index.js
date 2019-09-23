"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
router.post('/sing-in', middlewares_1.checkIfUserExist, middlewares_1.compareHashedPassword, (req, res, next) => {
    const userFromDB = req.body.userFromDB;
    req.body.token = jsonwebtoken_1.default.sign({
        Nombre: userFromDB.Nombre,
        Usuario: userFromDB.Usuario
    }, userFromDB.Contraseña, { expiresIn: '1h' });
    res.send(req.body.token);
});
exports.default = router;
