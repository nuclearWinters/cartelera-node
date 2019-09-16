import express, { Response, NextFunction, Router } from "express"
import { ObjectID } from "mongodb"
import { PeliculaConID } from "./types"
import { decodeJWT, checkIfUserExist, validateJWT } from "../middlewares"
import { RequestDB } from "../../app.d"

const router: Router = express.Router();
const collectionP = "peliculas"

router.put('/admin-put-movie', decodeJWT, checkIfUserExist, validateJWT, (req: RequestDB, res: Response, next: NextFunction) => {
    const db = req.app.locals.db
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

router.delete('/admin-delete-movie', decodeJWT, checkIfUserExist, validateJWT, (req: RequestDB, res: Response, next: NextFunction) => {
    const db = req.app.locals.db
    const _id: string = req.body.pelicula._id
    db.collection(collectionP).findOneAndDelete({_id: new ObjectID(_id)}, (err: any, results: any) => {
        if (err) {
            next(err)
        }
        else res.json(results)
    })
});

export default router