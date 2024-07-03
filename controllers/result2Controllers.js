// controllers/result2Controllers.js


// Displays available tables in the database.

// const db = require('../config/db');
function addIndex(queryResults) {
    // Number the results
    return queryResults.map((el, index) => ({
        i: index + 1, // Starting index from 1 for display purposes
        table: el['Tables_in_dadt_midterm']
    }));
}


function templateRenderer(response){
	// Return a renderer function with the res object built in
return function(error, results, fields){
		if(error){
			throw error;
		}
		// response.render('result2', { data: results} );
		response.render('result2', { data: addIndex(results)} );
	}
}

exports.get= (req, res) => { 

    let query = "SHOW TABLES";
    db.query(query, templateRenderer(res));

};