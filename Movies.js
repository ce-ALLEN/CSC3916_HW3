var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

//movies schema
var MovieSchema = new Schema({
    title: {type: String, required: true},
    yearReleased: {type: Date, required: true},
    genre: {type: String, required: true},
    actors: [{actor1Name: String, character1Name: String}, {actor2Name: String, character2Name: String},
        {actor3Name: String, character3Name: String}]
});


//return the model to server
module.exports = mongoose.model('Movie', MovieSchema);