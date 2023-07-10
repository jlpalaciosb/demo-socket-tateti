// const MongoClient = require('mongodb').MongoClient

// console.log('ini 1');

// const dburi = 'mongodb://localhost:27017'; // copiado de compass
// MongoClient.connect(`${dburi}/test`, (err, client) => {
//   if (err) throw err

//   console.log('ini 2');

//   const db = client.db('test')
  
//   db.collection('myCollection').find().toArray((err, result) => {
//     if (err) throw err

//     console.log(result)
//   })
// })

// console.log('ini 1.2');

// const mongoose = require('mongoose')

// mongoose.connect('mongodb://localhost:27017/', {
    
// }).then(db => console.log('db connected'))
// .catch(err => console.log('db no conectada'))

// console.log('ini');

const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
const uri = "mongodb://127.0.0.1:27017";

const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db('test');
    const movies = database.collection('myCollection');

    // Query for a movie that has the title 'Back to the Future'
    const query = { name: 'jose luis palacios' };
    const movie = await movies.findOne(query);

    console.log(movie); // YA FUNCIONA!!
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
