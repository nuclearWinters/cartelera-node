import { Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { UserFromInput, UserFromDB } from "./types"
import { RequestDB } from "../../app.d"

const collectionA = "administradores"

const decodeJWT = (req: RequestDB, res: Response, next: NextFunction) => {
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

const checkIfUserExist = (req: RequestDB, res: Response, next: NextFunction) => {
    const userInput: UserFromInput = req.body.userInput
    const db = req.app.locals.db
    db.collection(collectionA).find({Usuario: userInput.Usuario}).toArray((err: any, documents: any) => {
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

const validateJWT = (req: RequestDB, res: Response, next: NextFunction) => {
    const { token, user }: { token: string, user: UserFromDB } = req.body
    jwt.verify(token, user.Contraseña, (err: any, decoded: any) => {
        if (err) next(err)
        else next()
    });
}

const compareHashedPassword = async (req: RequestDB, res: Response, next: NextFunction) => {
    const { user, userInput }: {user: UserFromDB, userInput: UserFromInput} = req.body
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