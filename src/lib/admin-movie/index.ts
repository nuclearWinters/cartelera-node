import express, { Request, Response, NextFunction, Router } from "express"
import { ObjectID, Db } from "mongodb"
import { PeliculaConID } from "./types"
import { decodeJWT, checkIfUserExist, validateJWT } from "../middlewares"

const router: Router = express.Router();
const collectionP = "peliculas"

router.put('/admin-put-movie', decodeJWT, checkIfUserExist, validateJWT, (req: Request, res: Response, next: NextFunction) => {
    const db: Db = req.app.locals.db
    const { _id, Titulo, Director, Duración, Inicio_exhibición, Fin_exhibición }: PeliculaConID = req.body.pelicula
    db.collection(collectionP).findOneAndUpdate({_id: new ObjectID(_id)}, {$set: {
        Titulo,
        Director,
        Duración,
        "Inicio exhibición": new Date(Inicio_exhibición),
        "Fin exhibición": new Date(Fin_exhibición)
    }}, {returnOriginal: false}, (err: any, results: any) => {
        if (err) {
            next(err)
        }
        else res.json(results)
    })
});

router.delete('/admin-delete-movie', decodeJWT, checkIfUserExist, validateJWT, (req: Request, res: Response, next: NextFunction) => {
    const db: Db = req.app.locals.db
    const _id: string = req.body.pelicula._id
    db.collection(collectionP).findOneAndDelete({_id: new ObjectID(_id)}, (err: any, results: any) => {
        if (err) {
            next(err)
        }
        else res.json(results)
    })
});

export default router