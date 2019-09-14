import express, { Application, Request, Response, NextFunction } from "express"
import db from "../../db"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const collection = "administradores"

const app: Application = module.exports = express()

const checkIfUserExist = (req: Request, res: Response, next: NextFunction) => {
    const { Usuario } = req.body
    db.getDB().collection(collection).find({Usuario}).toArray((err: any, documents: any) => {
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

const compareHashedPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { user, Contraseña } = req.body
    const match = await bcrypt.compare(Contraseña, user.Contraseña)
    if (match) next()
    else res.send("Error")
}

const createToken = (req: Request, res: Response, next: NextFunction) => {
    const { Usuario, user } = req.body
    req.body.token = jwt.sign({
        Usuario,
    }, user.Contraseña);
    res.send(req.body.token)
}

app.post('/sing-in', checkIfUserExist, compareHashedPassword, createToken);


export = app