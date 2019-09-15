import { Request, Response, NextFunction } from "express"
import { Db } from "mongodb"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { UserInput, User } from "./types"

const collectionA = "administradores"

const decodeJWT = (req: Request, res: Response, next: NextFunction) => {
    const token: string = req.body.token
    if (token) {
        req.body.userInput = jwt.decode(req.body.token)
        next()
    } else {
        try {
            throw new Error('No hay token')
        }
        catch (err) {
            next(err)
        }
    }
}

const checkIfUserExist = (req: Request, res: Response, next: NextFunction) => {
    const userInput: UserInput = req.body.userInput
    const db: Db = req.app.locals.db
    db.collection(collectionA).find({Usuario: userInput.Usuario}).toArray((err: any, documents: any) => {
        if (err) next(err)
        else {
            if (documents.length !== 0) {
                req.body.user = documents[0]
                next()
            }
            else {
                try {
                    throw new Error('No hay registros de ese usuario')
                }
                catch(err) {
                    next(err)
                }
            }
        }
    })
}

const validateJWT = (req: Request, res: Response, next: NextFunction) => {
    const { token, user }: { token: string, user: User } = req.body
    jwt.verify(token, user.Contraseña, (err: any, decoded: any) => {
        if (err) next(err)
        else next()
    });
}

const compareHashedPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { user, userInput }: {user: User, userInput: UserInput} = req.body
    bcrypt.compare(userInput.Contraseña, user.Contraseña)
    .then(match => {
        if (match) next()
        else {
            try {
                throw new Error('La contraseña no coincide')
            } catch(err) {
                next(err)
            }
        }
    })
    .catch(next)
}

export { validateJWT, decodeJWT, checkIfUserExist, compareHashedPassword }