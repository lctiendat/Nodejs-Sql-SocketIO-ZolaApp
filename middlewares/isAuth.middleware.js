module.exports = (res, req, next) => {
    if (!req.session.sessionEmail) {
        res.redirect('/signin')
    }
    next()
}