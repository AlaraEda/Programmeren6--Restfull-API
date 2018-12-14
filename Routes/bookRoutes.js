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
    let bookController = require('../controllers/bookController')(Book)                     //Book model word meegestuurd naar controller.
    
    bookRouter.route('/')
        .post(bookController.post)                                                          //Roep functie post op van controllers.
        .get(bookController.get);                                                           //Roep functie get op van controllers. 
        
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
            /*
            Zorgt ervoor dat wanneer je op een boekID zit 
            je kan filteren op boeken met dezelfde genre
            */
            var returnBook = req.book.toJSON();

            returnBook.links = {};
            //Creeert genre-link
            var newLink = 'http://' + req.headers.host + '/api/books/?genre=' + returnBook.genre;
            returnBook.links.FilterByThisGenre = newLink.replace(' ','%20');  //Als de genre twee woorden is dan komt in de link inplaats van een spatie een %20. 
            res.json(returnBook);                                             //Return the book + links                                     
        })

        //Update alle onderdelen in een item in MangoDB database
        .put(function(req,res){                                     
            //Id word niet upgedate of verandert.
            req.book.title = req.body.title;
            req.book.author = req.body.author;
            req.book.genre = req.body.author;
            req.book.read = req.body.read;
            
            //Save upgedate boek
            req.book.save(function (err) {
                if (err)                                                    //Als er een error is...
                    res.status(500).send(err);
                else {                                                      //Anders...
                    res.json(req.book);                                     //Update nieuwe book...
                }
            });
        })

        //Update alleen delen van de item.
        .patch(function(req,res){
            if(req.body._id)                                                //Als er een nieuwe ID word geupdate
                delete req.body._id;                                        //Delete de nieuwe ID update.

            for (var p in req.body) {                                       //Loop die door alle onderdelen in de item gaat.
                req.book[p] = req.body[p];                                  //VB: Nieuwe ingevoerde boek titel word nieuwe book titel.
            }

            //Save upgedate boek
            req.book.save(function(err){
                if (err)                                                    //Als er een error is...
                    res.status(500).send(err);
                else{                                                       //Anders...
                    res.json(req.book);                                     //Update nieuwe book...
                }
            });
        })

        //Delete Item
        .delete(function(req,res){
            req.book.remove(function(err){                                  //Welk boek ook gevonden is in onze middelware -> remove it.
                if(err)                                                     //Als boek deleten niet gelukt is...
                    req.status(500).send(err);
                else{                                                       //Als boek deleten WEL gelukt is...                                         
                    res.status(204).send('Removed');
                }
            });
        });
        
    return bookRouter;
};

//exporteer routes functie
module.exports = routes;