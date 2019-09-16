import express, { Router, Response, NextFunction } from 'express';
import { Pelicula } from "./types"
import { RequestDB } from "../../app.d"

const router: Router = express.Router();
const collection: string = "peliculas"

router.get('/get-movie', (req: RequestDB, res: Response, next: NextFunction) => {
    const db = req.app.locals.db;
    db.collection(collection).find({}).toArray((err: any, documents: any) => {
        if (err) {
            next(err)
        } else {
            res.json(documents);
        }
    })
});

router.post('/post-movie', (req: RequestDB, res: Response, next: NextFunction) => {
    const db = req.app.locals.db
    const {
        Titulo,
        Director,
        Duración,
        Inicio_exhibición,
        Fin_exhibición
    }: Pelicula = req.body
    db.collection(collection).insertOne({
        Titulo,
        Director,
        Duración,
        "Inicio exhibición": new Date(Inicio_exhibición),
        "Fin exhibición": new Date(Fin_exhibición)
    }).then(result => res.json(result)).catch(next)
});

export default router