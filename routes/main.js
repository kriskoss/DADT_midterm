const mainControllers = require('../controllers/mainControllers');
const query_resultControllers = require('../controllers/query_resultControllers');
const query1Controllers = require('../controllers/query1Controllers')

module.exports = function(app) {
    app.get('/', mainControllers.get);
    app.get('/query_result', query_resultControllers.get);
    app.get('/query1', query1Controllers.get);
    // app.post('/', mainControllers.postMain);
};
