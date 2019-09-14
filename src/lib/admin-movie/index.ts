import express, { Application, Request, Response, NextFunction } from "express"
import { ObjectID } from "mongodb"
import db from "../../db"
import jwt from "jsonwebtoken"

const app: Application = module.exports = express()

//validar jwt y realizar crud

const decodeJWT = (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.body
    if (token) {
        req.body.user = jwt.decode(req.body.token)
        next()
    } else {
        res.send("Error")
    }
}

const checkIfUserExist = (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.body
    db.getDB().collection("administradores").find({Usuario: user.Usuario}).toArray((err: any, documents: any) => {
        if (err) {
            res.send("Error")
        } else {
            if (documents.length !== 0) {
                req.body.user = documents[0]
                next()
            }
            else {
                res.send("Error")
            }
        }
    })
}

const validateJWT = (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.body
    const { user } = req.body
    jwt.verify(token, user.Contraseña, (err: any, decoded: any) => {
        if (err) res.send("Error")
        else next()
    });
}

app.put('/admin-put-movie', decodeJWT, checkIfUserExist, validateJWT, (req: Request, res: Response, next: NextFunction) => {
    const { _id, Titulo, Director, Duración, Inicio_exhibición, Fin_exhibición }: {
        _id: string,
        Titulo: string,
        Director: string,
        Duración: number,
        Inicio_exhibición: string,
        Fin_exhibición: string
    } = req.body.pelicula
    db.getDB().collection("peliculas").findOneAndUpdate({_id: new ObjectID(_id)}, {$set: {
        Titulo,
        Director,
        Duración,
        "Inicio exhibición": new Date(Inicio_exhibición),
        "Fin exhibición": new Date(Fin_exhibición)
    }}, {returnOriginal: false}, (err: any, results: any) => {
        if (err) {
            res.send("Error")
        }
        else res.json(results)
    })
});

app.delete('/admin-delete-movie', decodeJWT, checkIfUserExist, validateJWT, (req: Request, res: Response) => {
    const { _id }: {
        _id: string,
    } = req.body.pelicula
    db.getDB().collection("peliculas").findOneAndDelete({_id: new ObjectID(_id)}, (err: any, results: any) => {
        if (err) {
            res.send("Error")
        }
        else res.json(results)
    })
});

export = app