exports.show = (req, res, next) => {
    if (!req.params.slug) {
        return next(new Error('No article slug.'));
    }
    req.collections.articles.findOne({ slug: req.params.slug }).then((article) => {
        console.log(article);
        if (!article.published) return res.send(401);
        res.render('article', article);
    }).catch((error) => {
        console.log(error);
    })
};//GET article page with a particular slug

exports.list = (req, res, next) => {
    req.collections.articles.find({}, (error, articles) => {
        if (error) return next(error);
        res.send({articles: articles});
    });
};//GET all articles and return them as array... This is for the admin page.

exports.add = (req, res, next) => {
    if (!req.body.article) return next(new Error('No article payload.'));
    var article = req.body.article;
    article.published = false;
    req.collections.articles.insert(article, (error, articleResponse) => {
        if (error) return next(error);
        res.send(articleResponse);
    });
}; //Add new articles to articles collection and send back result with _id

exports.edit = (req, res, next) => {
    if (!req.params.id) return next(new Error('No article ID.'));
    req.collections.articles.updateById(req.params.id, {$set: req.body.article}, (error, count) => {
        if (error) return next(error);
        res.send({affectedCount: count});
    });
}; //Update an article

exports.del = (req, res, next) => {
    if (!req.params.id) return next(new Error('No article ID.'));
    req.collections.articles.removeById(req.params.id, (error, count) => {
        if (error) return next(error);
        res.send({affectedCount: count});
    });
}; //Delete an article

exports.post = (req, res, next) => {
    if (!req.body.title)
    res.render('post');
}; //This is to give a blank page to be filled with article details

exports.postArticle = (req, res, next) => {
    if (!req.body.title || !req.body.slug || req.body.text) {
        return res.render('post', {error: 'Fill title, slug and text.'});
    }
    const article = {
        title: req.body.title,
        slug: req.body.slug,
        text: teq.body.text,
        published: false
    };
    req.collections.articles.insert(article, (error, articleResponse) => {
        if (error) return next(error);
        res.render('post', {error: 'Article was added. Publish it on Admin page.'});
    });
}; //Post an article without admin access

exports.admin = (req, res, next) => {
    req.collections.articles.find({}, {sort: {_id: -1}}, (error, articles) => {
        if (error) return next(error);
        res.render('admin', {articles: articles});
    });
}; //Fetch all present articles and sort them but with admin access