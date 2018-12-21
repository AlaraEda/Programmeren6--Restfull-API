//Json object that lays out what a quote object looks like.

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//Lay-out in Json hoe een boek eruit ziet
let quoteModel = new Schema({
    quote:{
        type: String
    },
    author: {type: String},
    genre: {type: String},
    //read: {type: String, default:false},  
    _links:{self:{href:{type:String}},
            collection:{href:{type:String}}}
});

//Laden deze model naar Mongoose en noemen het Quote en geven het de variabele quoteModel mee.
module.exports=mongoose.model('Quote', quoteModel);