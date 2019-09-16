import { Application, Request } from "express"
import { Db } from "mongodb";

export interface ApplicationDB extends Application {
    locals: {
        db: Db
    }
}

export interface RequestDB extends Request {
    app: ApplicationDB
}