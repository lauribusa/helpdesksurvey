const incidentsController = require('../controllers').incidents;

module.exports = (app) => {
    app.get('/', incidentsController.home);
    app.get('/list', incidentsController.list);
    app.post('/', incidentsController.refreshDB,incidentsController.validatePost, incidentsController.create, incidentsController.home);
    app.post('/list', incidentsController.list);
};