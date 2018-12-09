//Json object that lays out what a book object looks like.

let mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//Lay-out in Json hoe een boek eruit ziet
let bookModel = new Schema({
    title:{
        type: String
    },
    author: {type: String},
    genre: {type: String},
    read: {type: Boolean, default:false}                   //Is het boek al gelezen?
});

//Laden deze model naar Mongoose en noemen het Book en geven het de variabele bookModel mee.
module.exports=mongoose.model('Book', bookModel);