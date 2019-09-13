import express, { Application, Request, Response } from "express"
import db from "../../db"

const collection = "peliculas"

const app: Application = module.exports = express()

app.get('/get-movie', (req: Request, res: Response) => {
    db.getDB().collection(collection).find({}).toArray((err: any, documents: any) => {
        if (err) {
            console.log(err)
        } else {
            console.log(documents)
            res.json(documents);
        }
    })
});

app.post('/post-movie', (req: Request, res: Response) => {
    res.send('Hello World!!!');
});

export = app