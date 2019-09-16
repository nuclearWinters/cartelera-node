import express, { Request, Response, NextFunction, Router } from "express"
import jwt from "jsonwebtoken"
import { checkIfUserExist, compareHashedPassword } from "../middlewares"
import { UserFromDB } from "../middlewares/types"

const router: Router = express.Router();

router.post('/sing-in', checkIfUserExist, compareHashedPassword, (req: Request, res: Response, next: NextFunction) => {
    const userFromDB: UserFromDB = req.body.userFromDB
    req.body.token = jwt.sign({
        Nombre: userFromDB.Nombre,
        Usuario: userFromDB.Usuario,
    }, userFromDB.Contraseña);
    res.send(req.body.token)
});

export default router