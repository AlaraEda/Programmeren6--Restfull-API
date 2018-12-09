/*File dat ervoor zorgt dat app.js zichzelf steeds herlaad bij nieuwe aanpassingen.
Inplaats van dat je het handmatig moet doen via de console door "node app.js" 
te typen hoef je nu alleen"gulp" te typen.*/

let gulp = require('gulp'),
    nodemon = require('gulp-nodemon');          //npm install plug-in

////use default-task to execute our nodemon-plog in
gulp.task('default', function(){
    //Takes a json object to configure itself.
    nodemon({
        //What is it going to run?
        script: 'app.js',

        //What to watch for?
        ext: 'js',                              //Js extention

        //setting up an evironment with a port
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

//HTTP get verb, zorgt ervoor dat we data kunnen ophalen
//MongoDB is onze back-end database