const isAuth = require('../middlewares/isAuth.middleware')

module.exports = (app) => {
    app.get('/', isAuth.isAuthorize, (req, res) => {
        res.render('home/index')
    })
} 