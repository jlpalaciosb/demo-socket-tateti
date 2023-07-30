const {MongoClient} = require('mongodb');

const dburi = "mongodb://127.0.0.1:27017/";
const client = new MongoClient(dburi);
const database = client.db('tatetidb');

module.exports = database