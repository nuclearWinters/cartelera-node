import express, { Application, Request, Response } from "express"
import db from "../../db"

const collection = "peliculas"

const app: Application = module.exports = express()

app.get('/get-movie', (req: Request, res: Response) => {
    db.getDB().collection(collection).find({}).toArray((err: any, documents: any) => {
        if (err) {
            res.send("Error");
        } else {
            res.json(documents);
        }
    })
});

app.post('/post-movie', (req: Request, res: Response) => {
    const {
        Titulo,
        Director,
        Duración,
        Inicio_exhibición,
        Fin_exhibición
    }: {
        Titulo: string,
        Director: string,
        Duración: number,
        Inicio_exhibición: string,
        Fin_exhibición: string
    } = req.body
    db.getDB().collection(collection).insertOne({
        Titulo,
        Director,
        Duración,
        "Inicio exhibición": new Date(Inicio_exhibición),
        "Fin exhibición": new Date(Fin_exhibición)
    })
    res.send('Hello World!!!');
});

export = app