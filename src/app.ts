import express, { Application, Response, Request } from 'express'
import add_movie from "./lib/add-movie"
import db from "./db"

const app: Application = express();
app.use(add_movie)

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


