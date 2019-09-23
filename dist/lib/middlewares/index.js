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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const collectionA = "administradores";
const decodeJWT = (req, res, next) => {
    const token = req.body.token;
    if (token) {
        req.body.userFromInput = jsonwebtoken_1.default.decode(req.body.token);
        next();
    }
    else {
        try {
            throw new Error('No hay token');
        }
        catch (err) {
            next(err);
        }
    }
};
exports.decodeJWT = decodeJWT;
const checkIfUserExist = (req, res, next) => {
    const userInput = req.body.userInput;
    const db = req.app.locals.db;
    db.collection(collectionA).find({ Usuario: userInput.Usuario }).toArray((err, documents) => {
        if (err)
            next(err);
        else {
            if (documents.length !== 0) {
                req.body.userFromDB = documents[0];
                next();
            }
            else {
                try {
                    throw new Error('No hay registros de ese usuario');
                }
                catch (err) {
                    next(err);
                }
            }
        }
    });
};
exports.checkIfUserExist = checkIfUserExist;
const validateJWT = (req, res, next) => {
    const { token, userFromDB } = req.body;
    jsonwebtoken_1.default.verify(token, userFromDB.Contraseña, (err, decoded) => {
        if (err)
            next(err);
        else
            next();
    });
};
exports.validateJWT = validateJWT;
const compareHashedPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userFromDB, userInput } = req.body;
    bcryptjs_1.default.compare(userInput.Contraseña, userFromDB.Contraseña)
        .then(match => {
        if (match)
            next();
        else {
            try {
                throw new Error('La contraseña no coincide');
            }
            catch (err) {
                next(err);
            }
        }
    })
        .catch(next);
});
exports.compareHashedPassword = compareHashedPassword;
