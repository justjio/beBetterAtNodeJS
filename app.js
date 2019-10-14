var express = require('express'),
    routeIndex = require('./routes/index'),
    routeUser = require('./routes/user'),
    routeArticle = require('./routes/article'),
    http = require('http'), 
    path = require('path'),
    monk = require('monk'),
    url = 'localhost:27017/blog',
    db = monk(url),
    collections = {
        articles: db.get('articles'),
        users: db.get('users')
    }; //At this stage, we are adding persistence

    //Adding middleware modules
    var session = require('express-session'),
        logger = require('morgan'),
        errorHandler = require('errorhandler'),
        cookieParser = require('cookie-parser'),
        bodyParser = require('body-parser'),
        methodOverride = require('method-override');

//Now the express app
var app = express();
app.locals.appTitle = 'blog-express';

//Middleware for exposing collections via req.object
app.use((req, res, next) => {
    if(!collections.articles || !collections.users) 
        return next(new Error('No collections present.'))
    req.collections = collections;
    return next();
})

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//Config Middlewares
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('THISnode@2019-bebetter@node'));
app.use(session({ secret: 'WHILEyouare@1234567890' }));
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
var authorize = (req, res, next) => {
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
app.del('/api/articles/:id', routeArticle.del);

//In case all routes fail...
app.all('*', function (req, res) {
    res.send(404);
});


//Refactor server code to have boot and shutdown methods
var server = http.createServer(app);
var boot = function() {
    server.listen(app.get('port'), function() {
        console.info('Express server listening on port ' + app.get('port'));
    });
};

var shutdown = function() {
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