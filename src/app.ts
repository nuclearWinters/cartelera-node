import express, { Application } from 'express'
import cors from "cors"
import bodyParser from "body-parser"
import add_movie from "./lib/add-movie"
import sing_in from "./lib/sing-in"
import admin_movie from "./lib/admin-movie"
import db from "./db"

const app: Application = express();

app.use(cors())
app.use(bodyParser.json())

app.use(add_movie)
app.use(sing_in)
app.use(admin_movie)

db.connect((err: any) => {
    if (err) {
        console.log("unable to connect to database")
        process.exit(1)
    } else {
        app.listen(3000, () => {
            console.log('Example app listening on port 3000!');
        });
    }
})


