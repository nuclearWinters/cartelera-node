import express, { Response, NextFunction, Router } from "express"
import jwt from "jsonwebtoken"
import { checkIfUserExist, compareHashedPassword } from "../middlewares"
import { RequestDB } from "../../app.d"
import { UserFromDB } from "../middlewares/types";

const router: Router = express.Router();

router.post('/sing-in', checkIfUserExist, compareHashedPassword, (req: RequestDB, res: Response, next: NextFunction) => {
    const userFromDB: UserFromDB = req.body.userFromDB
    req.body.token = jwt.sign({
        Nombre: userFromDB.Nombre,
        Usuario: userFromDB.Usuario,
    }, userFromDB.Contraseña);
    res.send(req.body.token)
});

export default router