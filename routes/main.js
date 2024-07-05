// routes/main.js
const mainControllers = require('../controllers/mainControllers');
const query_resultControllers = require('../controllers/query_resultControllers');
const query1Controllers = require('../controllers/query1Controllers')
const query2Controllers = require('../controllers/query2Controllers')
const result1Controllers = require('../controllers/result1Controllers')
const result2Controllers = require('../controllers/result2Controllers')
const result3Controllers = require('../controllers/result3Controllers')


module.exports = function(app) {
    app.get('/', mainControllers.get);
    app.get('/query_result', query_resultControllers.get);

    app.get('/query1', query1Controllers.get);
    app.get('/query2', query2Controllers.get);
    
    app.get('/result1', result1Controllers.get);
    app.get('/result2', result2Controllers.get);
    app.get('/result3', result3Controllers.get);
    // app.post('/', mainControllers.postMain);
};
