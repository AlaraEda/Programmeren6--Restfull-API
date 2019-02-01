//Tik "Gulp" in console om eerste veranderingen weer te geven. 

//MongooseDB en express ophalen
const express = require('express'),
    mongoose = require('mongoose'),                             //Database
    bodyParser = require('body-parser');                        //Post-data

//Open connection to the db
let db;


if(process.env.ENV == 'Test')                                   //Als environment Test is....
    db = mongoose.connect('mongodb://localhost/quoteAPI_test', { useNewUrlParser: true });  //connection string is passed in. quoteAPI is de db waar we mee connecteren.
                                                                //Als quoteAPI niet bestaat dan creeert hij het nu gewoon zelf.
else{
    db = mongoose.connect('mongodb://localhost/quoteAPI', { useNewUrlParser: true });
}

let Quote = require('./models/quoteModel');                     //Roep Model file op
let app = express();                                            //Execute Express()
let port = 8000;                            //Als er geen process.env.port (staat in gulpfile.js) aanwezig is doe port 3000. 
console.log("This is the chosen port:" + port);

//Optie om iets binnen te krijgen, aan te passen of te uploaden.
app.options("/api/quotes/", function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')             //* Betekent alles
    res.header('Allow', 'GET,POST,OPTIONS')
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
    res.send(200);
});

app.options("/api/quotes/:quoteId", function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');             //* Betekent alles
    res.header('Access-Control-Allow-Methods', 'GET,PUT, OPTIONS, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.header('Allow', 'GET,PUT, OPTIONS, DELETE');
    res.send(200);
});

//Looks at the body of code and searches for Json
//Als er json is dan add hij het aan req.body.
app.use(bodyParser.urlencoded({ extended: true }));             //Let de app know we are using a body-parser
app.use(bodyParser.json());

//Rij 3 v/d Checkers
//Als het json is ga door met de code, anders geef een foutmelding.
app.use(function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Headers', 'Content - Type, Authorization, Content - Length, X - Requested - With'); 
    if(req.accepts('json')){
        next();
        return
    };
    res.sendStatus(404);
});

//Functie oproep. hierbij geef je de model quote ook mee aan de quoteRoutes-file
quoteRouter = require('./Routes/quoteRoutes')(Quote);

//Use Router instance to define all routes;
app.use('/api/quotes', quoteRouter);                             //Waar gaat de Api-Route zich bevinden? 
//app.use('/api/authors', authorRouter);                             

//Setting up Handler for route-> localhost:8000
app.get('/', function(req, res){    
    /*
    Req = request send by Client
    Res = response that we are sending back.
    */
    res.send('Welcome to my Api!');                             //Request we send back become's a response to server
                                                                //res.send stuurt alleen een string van tekst.
});


//App.listen with the port number + a call back function.
app.listen(port, function(){
    //Letting know that the app has started listening.
    console.log("API is running my app on Port:" + port );
});


