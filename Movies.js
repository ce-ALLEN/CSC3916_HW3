var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

//movies schema
var MovieSchema = new Schema({
    title: {type: String, required: true},
    yearReleased: {type: String, required: true},
    genre: {type: String, required: true},
    actors: [{actorName: String, characterName: String}, {actorName: String, characterName: String},
        {actorName: String, characterName: String}]
});


//return the model to server
module.exports = mongoose.model('Movie', MovieSchema);