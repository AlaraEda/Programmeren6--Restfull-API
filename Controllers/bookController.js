let bookController = function(Book){

    //Post-functie
    let post = function (req, res) {

        let book = new Book(req.body);                          //Create a new mangoose-instance of book-model
        book.save();                                            //Saves Book made in Postman in mango-db
        res.status(201).send(book);                             //Sending book back so book-id is available to the client who called our API.                                                    
                                                                //Send status & book back. 201 means created

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
            else
                res.json(books);                               //Stuur terug een json object.                        
        });
        
    }

    //Return back the fucntions you want to use;
    return {
        post: post,
        get: get
    }
}

module.exports = bookController;