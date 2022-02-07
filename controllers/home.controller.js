const isAuth = require('../middlewares/isAuth.middleware')

module.exports = (app) => {
    app.get('/', (req, res) => {
        res.render('home/index')
    }) 
} 