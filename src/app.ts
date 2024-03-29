import express, { Application, Response, NextFunction } from 'express'
import cors from "cors"
import bodyParser from "body-parser"
import add_movie from "./lib/add-movie"
import sing_in from "./lib/sing-in"
import admin_movie from "./lib/admin-movie"
import { MongoClient } from "mongodb"
import config from "./config"

import { ApplicationDB, RequestDB } from "./app.d"

const menuOptions = { useNewUrlParser: true, useUnifiedTopology: true }

const app: ApplicationDB = express();

app.use(cors())
app.use(bodyParser.json())

app.use(add_movie);
app.use(sing_in)
app.use(admin_movie)

app.use((err: any, req: RequestDB, res: Response, next: NextFunction) => {
    console.log("error in middleware")
    console.error(err.stack)
    res.send("Error Interno")
})

MongoClient.connect(config.database.url, menuOptions, (err, client) => {
    // unable to get database connection pass error to CB
    if(err) {
        console.error(err.stack)
        process.exit(1)
    }
    // Successfully got our database connection
    // Set database connection and call CB
    else {
        app.locals.db = client.db("Cartelera")
        app.listen(process.env.PORT || 3001, () => {
            console.log('Example app listening on port 3000!');
        });
    }
});