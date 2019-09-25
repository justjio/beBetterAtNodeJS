exports.list = (req, res) => {
    res.send('Respond with a resource');
}; //GET users listing

exports.login = (req, res, next) => {
    res.render('Login');
}; //GET login page

exports.logout = (req, res, next) => {
    res.redirect('/');
}; //GET logout route

exports.authenticate = (req, res, next) => {
    res.redirect('/admin');
}; //POST authenticate route