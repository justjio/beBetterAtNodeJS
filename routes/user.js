exports.list = (req, res) => {
    res.send('Respond with a resource');
}; //GET users listing

exports.login = (req, res, next) => {
    res.render('login');
}; //GET login page

exports.logout = (req, res, next) => {
    res.session.destroy();
    res.redirect('/');
}; //GET logout route

exports.authenticate = (req, res, next) => {
    if (!req.body.email || !req.body.password)
        return res.render('login', {
            error: 'Please enter your email and password'
        });
    req.collections.users.findOne({
        email: req.body.email,
        password: req.body.password
    }, (error, user) => {
        if (error) 
            return next(error);
        if (!user) {
            return res.render('login', {
                error: 'Incorrect email and password combination'
            });
        };
        console.log(user);
        req.session.user = user;
        req.session.admin = user.admin;
        res.redirect('/admin');
    })
};