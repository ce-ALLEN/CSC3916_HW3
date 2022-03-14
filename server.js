
var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var authController = require('./auth');
var authJwtController = require('./auth_jwt');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var User = require('./Users');
var Movie = require("./Movies");

var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

var router = express.Router();

function getJSONObjectForMovieRequirement(req, msg) {
    var json = {
        // title: title,
        // year_released: year,
        message: msg,
        headers: "No headers",
        key: process.env.UNIQUE_KEY,
        body: "No body"
    };

    if (req.body != null) {
        json.body = req.body;
    }

    if (req.headers != null) {
        json.headers = req.headers;
    }

    return json;
}

router.post('/signup', function(req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please include both username and password to signup.'})
    } else {
        var user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;

        user.save(function(err){
            if (err) {
                if (err.code == 11000)
                    return res.json({ success: false, message: 'A user with that username already exists.'});
                else
                    return res.json(err);
            }

            res.json({success: true, msg: 'Successfully created new user.'})
        });
    }
});

router.post('/signin', function (req, res) {
    var userNew = new User();
    userNew.username = req.body.username;
    userNew.password = req.body.password;

    User.findOne({ username: userNew.username }).select('name username password').exec(function(err, user) {
        if (err) {
            res.send(err);
        }

        user.comparePassword(userNew.password, function(isMatch) {
            if (isMatch) {
                var userToken = { id: user.id, username: user.username };
                var token = jwt.sign(userToken, process.env.SECRET_KEY);
                res.json ({success: true, token: 'JWT ' + token});
            }
            else {
                res.status(401).send({success: false, msg: 'Authentication failed.'});
            }
        })
    })
});

router.route('/movies')
    .get(function (req, res) {
        console.log(req.body);
        res = res.status(200);

        if (req.get('Content-Type')) {
            res = res.type(req.get('Content-Type'));
        }

        if (!req.body.title) {
            res.json({success: false, message: 'Request must contain a movie title.'})
        }

        Movie.find({ title: req.body.title }).exec(function (err, movie) {
            if (err) {
                res.send(err);
            }

            // var o = getJSONObjectForMovieRequirement(req, 'GET movies');
            res.json(movie);
        })
    })
    .post(function (req, res) {
        console.log(req.body);
        res = res.status(200);

        let movieNew = new Movie();
        movieNew.title = req.body.title;
        movieNew.yearReleased = req.body.yearReleased;
        movieNew.genre = req.body.genre;
        movieNew.actors = req.body.actors;

        if (req.get('Content-Type')) {
            res = res.type(req.get('Content-Type'));
        }

        movieNew.save(function(err){
            if (err) {
                if (err.code == 11000)
                    return res.json({ success: false, message: 'A movie with that username already exists.'});
                else
                    return res.json(err);
            }
            else {
                var o = getJSONObjectForMovieRequirement(req, 'movie saved');
                res.json(o)
            }
        });
    })
    .delete(authController.isAuthenticated, function(req, res) {
            console.log(req.body);
            res = res.status(200);
            if (req.get('Content-Type')) {
                res = res.type(req.get('Content-Type'));
            }
            var o = getJSONObjectForMovieRequirement(req, 'movie deleted');
            res.json(o);
        }
    )
    .put(authJwtController.isAuthenticated, function(req, res) {
            console.log(req.body);
            res = res.status(200);
            if (req.get('Content-Type')) {
                res = res.type(req.get('Content-Type'));
            }
            var o = getJSONObjectForMovieRequirement(req, 'movie updated');
            res.json(o);
        }
    );

app.use('/', router);
app.listen(process.env.PORT || 8080);
module.exports = app; // for testing only


