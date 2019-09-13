import Mongo, {  } from "mongodb"

const MongoClient = Mongo.MongoClient
const ObjectID = Mongo.ObjectID
const dbname = "Cartelera"
const url = "mongodb://localhost:27017"
const menuOptions = { useNewUrlParser: true, useUnifiedTopology: true  }

const state: { db: any } = {
    db: null
}

const connect = (cb: any) => {
    if (state.db) {
        cb()
    } else {
        MongoClient.connect(url, menuOptions, (err, client) => {
            if (err) {
                cb(err)
            } else {
                state.db = client.db(dbname)
                cb()
            }
        })
        
    }
}

const getPrimaryKey = (_id: any) => {
    return new ObjectID(_id)
}

const getDB = () => {
    return state.db
}

export = module.exports = { getDB, connect, getPrimaryKey }

