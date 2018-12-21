let express = require('express');                                                   //return value voor de module that exports routes

//Functie heeft "Quote" meegekregen van app.js
let routes = function(Quote){
    //A better way to create Routes
    let quoteRouter = express.Router();                                             //Router instance

    /*
    Quote Route for API;
    
    Wanneer je naar /api/Quotes, 
    zoek je naar het boek, neem je de resultaten
    en stuur je dat terug naar je browsor.
    */
    let quoteController = require('../controllers/quoteController')(Quote)          //Quote model word meegestuurd naar controller.
    
    quoteRouter.route('/')
        .post(quoteController.post)                                                 //Roep functie post op van controllers.
        .get(quoteController.get);                                                  //Roep functie get op van controllers. 
        
    /*
    Middelware voor quoteid-Route;
    De request van de client gaat eerst door het 
    middelware heen en komt dan pas bij de server aan. 
    */
    quoteRouter.use('/:quoteId', function(req,res,next){                            //Next = ga door naar de volgende middelware (als het er is).
        
        //De waarde van 'quoteId' staat in de URL
        Quote.findById(req.params.quoteId, function (err, quote) {                  //Vind het boek bij ID.
            if (err)
                res.status(500).send(err);                                          //Rest van de code word niet gelezen.
            else if (quote) {                                                       //Als het boek bestaat...
                req.quote = quote;                                                  //Voeg het boek toe aan de request
                next()                                                              //Ga door naar de volgende middelware/lijnen code.
            }
            else{                                                                   //Boek niet gevonden?                                                
                res.status(404).send("no quote found");                             //Rest van de code word niet gelezen.
            }
        });
    });


    //Route zodat je quotes op ID kunt vinden in de URL
    quoteRouter.route('/:quoteId')
        .get(function (req, res) {
            /*
            Zorgt ervoor dat wanneer je op een boekID zit 
            je kan filteren op boeken met dezelfde genre
            */
            let returnQuote = req.quote.toJSON();

            returnQuote._links = {};
            returnQuote._links.self = {};
            //Creeert genre-link
            let newLink = 'http://' + req.headers.host + '/api/quotes/' + returnQuote._id;
            returnQuote._links.self.href = newLink.replace(' ','%20');              //Als de genre twee woorden is dan komt in de link inplaats van een spatie een %20. 
            
            returnQuote._links.collection = {};
            returnQuote._links.collection.href = 'http://' + req.headers.host + '/api/quotes'

            res.json(returnQuote);                                                   //Return the quote + links                                     
        })

        //Update alle onderdelen in een item in MangoDB database
        .put(function(req,res){
            Quote.findById(req.params.quoteId, function (err, quote) {              //Vind het boek bij ID.
                if (!req.body.quote || !req.body.author || !req.body.genre) {       //||!req.body.read
                
                   res.status(400).send(err);
                   
                }
                else{
            
                    //Id word niet upgedate of verandert.
                    quote.quote = req.body.quote;
                    quote.author = req.body.author;
                    quote.genre = req.body.author;
                    //quote.read = req.body.read;
                
                    //Save upgedate boek
                    quote.save(function (err) {
                        if (err)                                                    //Als er een error is...
                            res.status(500).send(err)
                        else {                                                      //Anders...
                            res.json(req.quote)                                     //Update nieuwe quote...
                        }
                    
                    });
                }
            })
        })

        //Update alleen delen van de item.
        .patch(function(req,res){
            if(req.body._id)                                                        //Als er een nieuwe ID word geupdate
                delete req.body._id;                                                //Delete de nieuwe ID update.

            for (var p in req.body) {                                               //Loop die door alle onderdelen in de item gaat.
                req.quote[p] = req.body[p];                                         //VB: Nieuwe ingevoerde boek titel word nieuwe quote titel.
            }

            //Save upgedate boek
            req.quote.save(function(err){
                if (err)                                                            //Als er een error is...
                    res.status(500).send(err);
                else{                                                               //Anders...
                    res.json(req.quote);                                                //Update nieuwe quote...
                }
            });
        })

        //Delete Item
        .delete(function(req,res){
            req.quote.remove(function(err){                                         //Welk boek ook gevonden is in onze middelware -> remove it.
                if(err)                                                             //Als boek deleten niet gelukt is...
                    req.status(500).send(err);
                else{                                                               //Als boek deleten WEL gelukt is...                                         
                    res.status(204).send('Removed');
                }
            });
        });
        
    return quoteRouter;
};

//exporteer routes functie
module.exports = routes;