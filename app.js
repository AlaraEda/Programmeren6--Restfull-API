//Tik "Gulp" in console om eerste veranderingen weer te geven. 

//MongooseDB en express ophalen
const express = require('express'),
    mongoose = require('mongoose'),                             //Database
    bodyParser = require('body-parser');                        //Post-data

//Open connection to the db
let db = mongoose.connect('mongodb://localhost/bookAPI');       //connection string is passed in. bookAPI is de db waar we mee connecteren.
                                                                //Als bookAPI niet bestaat dan creeert hij het nu gewoon zelf.

let Book = require('./models/bookModel');                       //Roep Model file op
let app = express();                                            //Execute Express()
let port = process.env.PORT || 3000;                            //Als er geen process.env.port (staat in gulpfile.js) aanwezig is doe port 3000. 

//Looks at the body of code and searches for Json
//Als er json is dan add hij het aan req.body.
app.use(bodyParser.urlencoded({ extended: true }));             //Let de app know we are using a body-parser
app.use(bodyParser.json());

//Functie oproep. hierbij geef je de model book ook mee aan de bookRoutes-file
bookRouter = require('./Routes/bookRoutes')(Book);

//Use Router instance to define all routes;
app.use('/api/books', bookRouter);                             //Waar gaat de Api-Route zich bevinden? 
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
    console.log("Gulp is running my app on Port:" + port );
});


