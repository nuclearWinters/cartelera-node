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

router.post('/post-movie', async (req: RequestDB, res: Response, next: NextFunction) => {
    const db = req.app.locals.db
    const {
        Titulo,
        Director,
        Duración,
        Inicio_exhibición,
        Fin_exhibición
    }: Pelicula = req.body
    let lastRecord = await db.collection(collection).find().sort({Creado: -1}).limit(1).toArray()
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
        }).then(result => res.json(result)).catch(next)
    }
    else {
        res.status(429).json({falta: 300-diffSeconds})
    }
});

export default router