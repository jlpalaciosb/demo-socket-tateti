const {MongoClient} = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);
const database = client.db(process.env.MONGODB_NAME);

module.exports = database