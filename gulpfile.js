/*File dat ervoor zorgt dat app.js zichzelf steeds herlaad bij nieuwe aanpassingen.
Inplaats van dat je het handmatig moet doen via de console door "node app.js" 
te typen hoef je nu alleen"gulp" te typen.*/

let gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),          //npm install plug-in
    gulpMocha = require('gulp-mocha');          //Mocha running in gulp

//Use default-task to execute our nodemon-plog in
gulp.task('default', function(){

    //Takes a json object to configure itself.
    nodemon({
        
        script: 'app.js',                       //Main-page
        ext: 'js',                              //Let op Js extention
        env: {
            PORT:8000                           //localhost:8000 is de website
        },

        //Ignore everthing under node modules
        ignore: ['./node_modules/**']

    })

    //When you restart
    .on('restart', function(){
        console.log('Restarting');
    });
});

//Gulp Task om gulpMocha te gebruiken.
gulp.task('test', function(){//Functie heet "test"
  gulp.src('tests/*.js', {read: false})         //Gebruik mocha op al onze test files.
    .pipe(gulpMocha({reporter: 'nyan'}))
});


//HTTP get verb, zorgt ervoor dat we data kunnen ophalen
//MongoDB is onze back-end database