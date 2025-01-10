//giriş kontrolü
const requireLogin = (req, res, next) => {
    if (!req.session.loggedin) {
        res.redirect('/');
    } else {
        next();
    }
};

module.exports = { requireLogin };