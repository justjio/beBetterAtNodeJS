const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

const dbName = 'newtest';

const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});

client.connect((err) => {
    if (err) {
        console.error(error);
        process.exit(1);
    }
    console.log("Connection to server successful.");
    const db = client.db(dbName);
    console.log('db state: ', db._state);// At this stage, connection is established

    insertDocuments(db, () => {
        client.close();
        process.exit(0);
    })
});

//The function that inserts documents
const insertDocuments = (db, callback) => {
    const collection = db.collection('documents');

    collection.insertMany([
        {a : 1}, {a: 2}, {a: 3}
    ], (err, result) => {
        if(err) {
            console.error(error);
            process.exit(1);
        }
        console.log('3 documents successfully inserted into the collection.');
        callback(result);
    })
}