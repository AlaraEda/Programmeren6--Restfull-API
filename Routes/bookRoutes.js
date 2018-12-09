let express = require('express');

//return value voor de module that exports routes

//Functie heeft "Book" meegekregen van app.js
let routes = function(Book){
    //A better way to create Routes
    let bookRouter = express.Router();                              //Router instance

    /*
    Book Route for API;
    
    Wanneer je naar /api/books, 
    zoek je naar het boek, neem je de resultaten
    en stuur je dat terug naar je browsor.
    */
    bookRouter.route('/')
        //Post een nieuwe item.
        .post(function (req, res) {
            //Create a new mangoose-instance of book-model
            var book = new Book(req.body);

            //Body parser = middleware die de body leest en het stopt in een json object

            //Saves Book made in Postman in mango-db
            book.save();

            //Sending book back so book-id is available to the client who called our API.
            res.status(201).send(book);                                                     //Send status & book back. 201 means created

        })

        //Get-Method: Express roept deze functie op als get-route '/Books' word opgeroepen;
        .get(function (req, res) {
            //let responseJson = {hello: "This is my api"};         //Data sending back

            /*
            Filter boeken op genre of author
            door in de URL te typen:
            books?author=Jules Verne
            books?genre
            */
            let query = {};

            //Check if de request(die je in URL typt) query bestaat
            //Dus als je bullshit typt in URL dan filtert het niet.
            if (req.query.genre) {
                //Bestaat?
                query.genre = req.query.genre;
            }

            //Book is onze model, vind het en doe een callback.
            //Zoek ondertussen ook naar de query in dat boek;
            Book.find(query, function (err, books) {
                if (err)                                             //Als er een Error aanwezig is...
                    res.status(500).send(err);                      //Stuur de 500-error terug met een message die de error heeft.         
                //console.log(err)
                else
                    res.json(books);                                        //Stuur terug een json object.                        
            });
        });

    /*
    Middelware voor bookid-Route;
    De request van de client gaat eerst door het 
    middelware heen en komt dan pas bij de server aan. 
    */
    bookRouter.use('/:bookId', function(req,res,next){                      //Next = ga door naar de volgende middelware (als het er is).
        
        //De waarde van 'bookId' staat in de URL
        Book.findById(req.params.bookId, function (err, book) {            //Vind het boek bij ID.
            if (err)
                res.status(500).send(err);                                  //Rest van de code word niet gelezen.
            else if (book) {                                                //Als het boek bestaat...
                req.book = book;                                            //Voeg het boek toe aan de request
                next()                                                      //Ga door naar de volgende middelware/lijnen code.
            }
            else{                                                           //Boek niet gevonden?                                                
                res.status(404).send("no book found");                      //Rest van de code word niet gelezen.
            }
        });
    });

    //Route zodat je boeken op ID kunt vinden in de URL
    bookRouter.route('/:bookId')
        .get(function (req, res) {
            res.json(req.book);                                             
        })

        //Update alle onderdelen in een item in MangoDB database
        .put(function(req,res){                                     
            //Id word niet upgedate of verandert.
            req.book.title = req.body.title;
            req.book.author = req.body.author;
            req.book.genre = req.body.author;
            req.book.read = req.body.read;
            book.save();                                                    //Save the changes
            res.json(req.book);                                             //Return new updated book.
        });
        
    return bookRouter;
};

//exporteer routes functie
module.exports = routes;