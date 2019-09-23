"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const add_movie_1 = __importDefault(require("./lib/add-movie"));
const sing_in_1 = __importDefault(require("./lib/sing-in"));
const admin_movie_1 = __importDefault(require("./lib/admin-movie"));
const mongodb_1 = require("mongodb");
const config_1 = __importDefault(require("./config"));
const menuOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const app = express_1.default();
app.use(cors_1.default());
app.use(body_parser_1.default.json());
app.use(add_movie_1.default);
app.use(sing_in_1.default);
app.use(admin_movie_1.default);
app.use((err, req, res, next) => {
    console.log("error in middleware");
    console.error(err.stack);
    res.send("Error Interno");
});
mongodb_1.MongoClient.connect(config_1.default.database.url, menuOptions, (err, client) => {
    // unable to get database connection pass error to CB
    if (err) {
        console.error(err.stack);
        process.exit(1);
    }
    // Successfully got our database connection
    // Set database connection and call CB
    else {
        app.locals.db = client.db("Cartelera");
        app.listen(3001, () => {
            console.log('Example app listening on port 3000!');
        });
    }
});
