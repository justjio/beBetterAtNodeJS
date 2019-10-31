const FB_APP_ID = process.env.FB_APP_ID,
    FB_APP_SECRET = process.env.FB_APP_SECRET;

const express = require('express'),
    routeIndex = require('./routes/index'),
    routeUser = require('./routes/user'),
    routeArticle = require('./routes/article'),
    http = require('http'), 
    path = require('path'),
    models = require('./models'),
    mongoose = require('mongoose');

    //Mongoose set - up
    mongoose.connect('mongodb://localhost/blog', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error: '));
    db.once('open', () => {
        console.log('We are connected to database!');
    });

    //Everyauth is imported here
    everyauth = require('everyauth');

    //Adding middleware modules
    const session = require('express-session'),
        logger = require('morgan'),
        errorHandler = require('errorhandler'),
        cookieParser = require('cookie-parser'),
        methodOverride = require('method-override');

//Configure everyauth for twitter
everyauth.debug = true;
everyauth.facebook
    .appId(FB_APP_ID)
    .appSecret(FB_APP_SECRET)
    .handleAuthCallbackError((req, res) => {
        //What to do when user is denied the app
    })
    .findOrCreateUser(function(
    session, accessToken, accessTokenSecret, fbUserMetadata
) {
    const promise = this.Promise();
    process.nextTick(() => {
        if (fbUserMetadata.name === 'Joseph Obiagba') {
            session.user = fbUserMetadata;
            session.admin = true;
        };
        promise.fulfill(fbUserMetadata);
    })
    return promise;
}).redirectPath('/admin');

everyauth.everymodule.handleLogout(routeUser.logout);
everyauth.everymodule.findUserById((user, callback) => {
    callback(user);
});

//Now the express app
const app = express();
app.locals.appTitle = 'blog-express';

//Middleware for exposing collections via req.object
app.use((req, res, next) => {
    if (!models.Article || !models.User) 
        return next (new Error('No models'));
    req.model = models;
    return next();
});

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//Config Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded( { extended: false }));
app.use(cookieParser('THISnode@2019-bebetter@node'));
app.use(session({ secret: 'WHILEyouare@1234567890' }));
app.use(everyauth.middleware());
app.use(methodOverride());
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

//Check req.session damin value for truthyness
//Authentication middleware
app.use((req, res, next) => {
    if (req.session && req.session.admin)
        res.locals.admin = true;
    next();
});

//Authorization middleware
const authorize = (req, res, next) => {
    if (req.session && req.session.admin) 
        return next();
    else
        return res.send(401);
};

//Pages and Routes
//Make sure index.js, article.js and user.js are added in the routes folder
app.get('/', routeIndex.index);
app.get('/login', routeUser.login);
app.post('/login', routeUser.authenticate);
app.get('/logout', routeUser.logout);
app.get('/admin', authorize, routeArticle.admin);
app.get('/post', authorize, routeArticle.post);
app.post('/post', authorize, routeArticle.postArticle);
app.get('/articles/:slug', routeArticle.show);

//REST API ROUTES for admin page
app.all('/api', authorize); //This is a compact way of assigning authorization to all api routes
app.get('/api/articles', routeArticle.list);
app.post('/api/articles', routeArticle.add);
app.put('/api/articles/:id', routeArticle.edit);
app.delete('/api/articles/:id', routeArticle.del);

//In case all routes fail...
app.all('*', function (req, res) {
    res.send(404);
});


//Refactor server code to have boot and shutdown methods
const server = http.createServer(app);
const boot = function() {
    server.listen(app.get('port'), function() {
        console.info('Express server listening on port ' + app.get('port'));
    });
};

const shutdown = function() {
    server.close();
};

if (require.main === module) {
    boot();
} 
else {
    console.info('Running app as a module');
        exports.boot = boot;
        exports.shutdown = shutdown;
        exports.port = app.get('port');
};