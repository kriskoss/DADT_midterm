// controllers/result3Controllers.js


function getTableNames(response){
	// Return a renderer function with the res object built in
return function(error, results, fields){
        // response.send(results);
		if(error){
			throw error;
		}

        let newRes=[];
        let queriesToGo = results.length; //  necesary because of asynchronous behaviour of database querying
        
        results.forEach(el => {

            let tableName=el['Tables_in_dadt_midterm'];
            let queryCount = "SELECT COUNT(*) AS rowsCount FROM ??";
            db.query(queryCount, [tableName], (err,rowsCountResult)=>{
                if (error) {
                    throw error;
                }
                let line = { table:tableName, rowsCount : rowsCountResult[0].rowsCount }
                newRes.push(line);

                queriesToGo--;
                if (queriesToGo == 0) {
                    // response.send(newRes);
                    response.render('result3', { data: newRes} );
                }
            });
        });
	}
}


exports.get= (req, res) => { 

    let query = "SHOW TABLES";
    db.query(query, getTableNames(res));
};