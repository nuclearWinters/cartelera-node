"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongodb_1 = require("mongodb");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
const collectionP = "peliculas";
router.put('/admin-put-movie', middlewares_1.decodeJWT, middlewares_1.checkIfUserExist, middlewares_1.validateJWT, (req, res, next) => {
    const db = req.app.locals.db;
    const { _id, Titulo, Director, Duración, Inicio_exhibición, Fin_exhibición } = req.body.pelicula;
    db.collection(collectionP).findOneAndUpdate({ _id: new mongodb_1.ObjectID(_id) }, { $set: {
            Titulo,
            Director,
            Duración,
            "Inicio exhibición": new Date(Inicio_exhibición),
            "Fin exhibición": new Date(Fin_exhibición)
        } }, { returnOriginal: false }, (err, results) => {
        if (err) {
            next(err);
        }
        else
            res.json(results);
    });
});
router.delete('/admin-delete-movie', middlewares_1.decodeJWT, middlewares_1.checkIfUserExist, middlewares_1.validateJWT, (req, res, next) => {
    const db = req.app.locals.db;
    const _id = req.body.pelicula._id;
    db.collection(collectionP).findOneAndDelete({ _id: new mongodb_1.ObjectID(_id) }, (err, results) => {
        if (err) {
            next(err);
        }
        else
            res.json(results);
    });
});
exports.default = router;
