import express, { Response, NextFunction, Router } from "express"
import jwt from "jsonwebtoken"
import { checkIfUserExist, compareHashedPassword } from "../middlewares"
import { RequestDB } from "../../app.d"

const router: Router = express.Router();

router.post('/sing-in', checkIfUserExist, compareHashedPassword, (req: RequestDB, res: Response, next: NextFunction) => {
    const { user } = req.body
    req.body.token = jwt.sign({
        Nombre: user.Nombre,
        Usuario: user.Usuario,
    }, user.Contraseña);
    res.send(req.body.token)
});

export default router