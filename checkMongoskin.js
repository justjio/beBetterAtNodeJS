var mongoskin = require('mongoskin'),
    dbHost = '120.0.0.1',
    dbPort = 27017;

var db = mongoskin.db(dbHost + ':' + dbPort + '/local', {safe:true});

db.bind('documents', {
    findOneAndAddText : function (text, fn) {
        if (error) {
            console.error(error);
            process.exit(1);
        }
        console.info('findOne: ', item);
        item.text = text;
        var id = item._id.toString(); //String ID is stored as a string
        console.info('before saving: ', item);
        db.collection('documents').save(item, (error, count) => {
            console.info('save: ', count);
            return fn(count, id);
        });
    }
})

db.documents.find('hi', (count, id) => {
    db.collection('documents').find({
        _id: db.collection('documents').id(id)
    }).toArray((error, items) => {
        console.info('find: ', items);
        db.close();
        process.exit(0);
    });
})