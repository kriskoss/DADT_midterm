// routes/main.js
const mainControllers = require('../controllers/mainControllers');
const query1Controllers = require('../controllers/query1Controllers')
const query2Controllers = require('../controllers/query2Controllers')
const query3Controllers = require('../controllers/query3Controllers')
const query4Controllers = require('../controllers/query4Controllers')
const query5Controllers = require('../controllers/query5Controllers')
const result1Controllers = require('../controllers/result1Controllers')
const result2Controllers = require('../controllers/result2Controllers')
const result3Controllers = require('../controllers/result3Controllers')
const result4Controllers = require('../controllers/result4Controllers')
const result5Controllers = require('../controllers/result5Controllers')


module.exports = function(app) {
    app.get('/', mainControllers.get);

    app.get('/query1', query1Controllers.get);
    app.get('/query2', query2Controllers.get);
    app.get('/query3', query3Controllers.get);
    app.get('/query4', query4Controllers.get);
    app.get('/query5', query5Controllers.get);
    
    app.get('/result1', result1Controllers.get);
    app.get('/result2', result2Controllers.get);
    app.get('/result3', result3Controllers.get);
    app.get('/result4', result4Controllers.get);
    app.get('/result5', result5Controllers.get);
    // app.post('/', mainControllers.postMain);
};
