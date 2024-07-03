function addIndex(queryResults){
	// Number the results (there are many alternative ways to do this)
	queryResults.forEach((el, index) => el.i = index);
	return queryResults;
}

function makeForm(response){
	// Run a query to get unmatched actors
	var query = `SHOW TABLES;`;
	db.query(query, templateRenderer(response));
}

function templateRenderer(response){
	// Return a renderer function with the res object built in
	return function(error, results, fields){
		if(error){
			throw error;
		}
		response.render('query1', { data: addIndex(results)} );
	}
}



exports.get = (req, res) => {
    res.render("query1.html")
};