let bookController = function(Book){

    //Post-functie
    let post = function (req, res) {

        let book = new Book(req.body);                          //Create a new mangoose-instance of book-model
        
        if (!req.body.title) {                                  //Als titel niet bestaat in req.body
            
            res.status(400);
            res.send('Title is required.');
            
        }else{                                                  //Als titel WEL bestaat in req.body

            book.save();                                            //Saves Book made in Postman in mango-db
            res.status(201);                                        //Send status 201 means created
            res.send(book);                                         //Sending book back so book-id is available to the client who called our API.                                                    
       
        }                                                  
    }

    //Get-Functie
    let get = function (req, res) {

        /*
        Filter boeken op genre of author
        door in de URL te typen:
        books?author=Jules Verne
        books?genre
        */
        let query = {};

        if (req.query.genre) {                                 //Check if de request(die je in URL typt) query bestaat
            //Bestaat?                              
            query.genre = req.query.genre;
        }

        //Book is onze model, vind het en doe een callback.
        //Zoek ondertussen ook naar de query in dat boek;
        Book.find(query, function (err, books) {
            if (err)                                            //Als er een Error aanwezig is...
                res.status(500).send(err);                      //Stuur de 500-error terug met een message die de error heeft.         
            //console.log(err)
            else {

                let returnBooks = [];
                //ForEach book in the list...
                books.forEach(function (element, index, array) {
                    //Change element in model
                    var newBook = element.toJSON();
                    //Add hyperlinks op onze objecten.
                    newBook.links =  {};
                    //                              localhost:8000                   
                    newBook.links.self = 'http://' + req.headers.host + '/api/books/' + newBook._id         //Elke boek in onze return geeft ons een boek plus de link om naar de individuele boek te gaan.
                    returnBooks.push(newBook)                   //"Each" item in de array zal een nieuwe boek stoppen in de returnBooks-Array/
                });
                res.json(returnBooks);                          //Stuur terug alle json objecten + links                        
            }
        });

    }

    //Return back the fucntions you want to use;
    return {
        post: post,
        get: get
    }
}

module.exports = bookController;