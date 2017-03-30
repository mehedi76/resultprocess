var express = require('express');
var router = express.Router();
var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var _ = require('underscore');

module.exports = function(passport){

    //sends successful login state back to angular
    router.get('/success', function(req, res){
        console.log(req.user);
       
        res.send({
            state: 'success', 
            user: req.user ? _.pick(req.user, '_id', 'username', 'role','name','designation') : null
        });
    

            
        });
        
    

    //sends failure login state back to angular
    router.get('/failure', function(req, res){
        res.send({
        	state: 'failure', 
        	user: null, 
        	message: "Invalid username or password"});
    });

    //log in
    router.post('/login', passport.authenticate('login', {
        
        successRedirect: '/auth/success',
        failureRedirect: '/auth/failure'
    }));

    //sign up
    router.post('/signup', function(req,res){
        User.findOne({'username': req.body.username},function(err,user){
            if(err) 
                return res.send("database error");

            if(user){
                console.log("Username already exits.");
                return res.send("Username already exits.");
            }else{

                var newUser = new User();
                newUser.name = req.body.name;
                newUser.username = req.body.username;
                newUser.password = createHash(req.body.password);

                newUser.save(function(err,getUser){
                    if(err){
                        console.log("database error");
                    }
                    return res.json(getUser);
                });

            }

        });
    });

    //log out
    router.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


    

    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10),null);
    };

    return router;

};