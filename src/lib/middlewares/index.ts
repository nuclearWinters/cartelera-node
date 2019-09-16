import { Request, Response, NextFunction } from "express"
import { Db } from "mongodb"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { UserFromInput, UserFromDB } from "./types"

const collectionA = "administradores"

const decodeJWT = (req: Request, res: Response, next: NextFunction) => {
    const token: string = req.body.token
    if (token) {
        req.body.userFromInput = jwt.decode(req.body.token)
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
    const userFromInput: UserFromInput = req.body.userFromInput
    const db: Db = req.app.locals.db
    db.collection(collectionA).find({Usuario: userFromInput.Usuario}).toArray((err: any, documents: any) => {
        if (err) next(err)
        else {
            if (documents.length !== 0) {
                req.body.userFromDB = documents[0]
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
    const { token, userFromDB }: { token: string, userFromDB: UserFromDB } = req.body
    jwt.verify(token, userFromDB.Contraseña, (err: any, decoded: any) => {
        if (err) next(err)
        else next()
    });
}

const compareHashedPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { userFromDB, userFromInput }: {userFromDB: UserFromDB, userFromInput: UserFromInput} = req.body
    bcrypt.compare(userFromInput.Contraseña, userFromDB.Contraseña)
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