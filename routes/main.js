// main.js
module.exports = function(app){
    app.get("/", function (req, res){
        res.render("index.html")
    });

    app.get("/query_result", function (req, res){
        res.render("query_result.html")
    });

///////////////////////////////////////////////////////////////////////
    app.post("/bookadded", (req, res)=>{
        //saving data in database
        let sqlquery = "INSERT INTO books (name, price) VALUE (?,?);";
        let newrecord = [req.body.name, req.body.price];
        db.query(sqlquery, newrecord, (err, result)=>{
            if (err){ return console.error(err.message);
            } else {
                res.send(`This book is added to databaes, name:${req.body.name}!, price:${req.body.price}! <a href="/list">View all books</a>`);
            }
        });
    });

    app.get("/list", function(req, res){
        //query database to get all the books
        let sqlquery ="SELECT * FROM books";
        //execute sql querry 
        db.query(sqlquery, (err, result)=> {
            if (err) {
                res.redirect("/");
            }
            res.render("list.html",{ availableBooks: result});
        });
    });


    // 6.407 Passing variables to templates and back-end (LAB)
    app.get("/search-result-db", function(req, res){
        // searching the database
        let word = [req.query.keyword];
        let myKey = req.query.keyword2;
        let sqlquery = "SELECT * FROM `books` WHERE name like ? ";

        // execute sql query
        db.query(sqlquery, word, (err, result) => {
            if(err) {
                return console.error("No book found with the keyword you have entered" + req.query.keyword + " error: " + err.message);
                //res.redirect("./search"); // can be used instead of the above
            } else {
                // step 1: (this will only show the collected form-data) for debugging purpose only
                // res.send(req.query);

                //step 2: (this shows keyword in collected form-data) for debugging purpose only
                // res.send("This is the keyword you entered: <b>"+ req.query.keyword+ "</b> <br>This is the keyword2:<b> " + req.query.keyword2 + "<b>");

                //step3: (this will show the result of the search) for debugging purpose only
                // res.send(result);
                // step 4: (this wil show the resut of the search using an ejs template file, list.ejs can be used here)
                res.render('list.html', {availableBooks: result, keyword2: myKey});
            }
        });
    });
};
