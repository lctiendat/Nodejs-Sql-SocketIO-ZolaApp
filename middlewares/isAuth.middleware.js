module.exports = (res, req, next) => {
    if (req.session.sessionEmail) {
        return next();
    }
    res.redirect('/login');
}