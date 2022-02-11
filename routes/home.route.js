const homeController = require('../controllers/home.controller')
const isAuth = require('../middlewares/isAuth.middleware')
module.exports = (app) => {

    /**
     * Trang chủ
     */
    app.get('/',isAuth.isAuthorize, homeController.index)

}