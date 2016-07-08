var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var mongoose = require('mongoose');
var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');
// var Users = require('../app/collections/users');
// var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  console.log('rendering index');
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Link.find().then(function(links) {
    res.status(200).send(links);
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  Link.findOne( {url: uri} ) 
    .exec(function(err, result) { 
      if (err) {
        console.log(err); 
      } else if (result) {
        res.status(200).send(result);
      } else {
        
        var link = new Link({url: uri});

        util.getUrlTitle(uri, function(err, title) {
          if (err) {
            return err;
          }
          link.title = title;
          link.save(function(err, result) {
            if (err) {
              console.log(err);
            }
            res.status(200).send(result);
          });

        });
      }
    });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }, function(err, result) {
    if (err) {
      console.log(err);
    } else if (!result) {
      res.redirect('/login');
    } else {
      bcrypt.compare(password, result.password, function(err, isMatch) {
        if (isMatch) {
          util.createSession(req, res, result);
        } else {
          res.redirect('/login');
        }
      });
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }, function(err, result) {
    if (err) {
      console.log(err);
    } else if (!result) {
      var newUser = new User ({ 
        username: username, 
        password: password
      });
      newUser.save(function(err, result) {
        if (err) {
          console.log(err);
        } else {
          util.createSession(req, res, newUser);
        }
      });
    } else {
      console.log('Account already exists');
      res.redirect('/signup');
    }
  });
};

exports.navToLink = function(req, res) {
 
  Link.findOne({code: req.params[0]})
    .exec(function(err, result) {
      if (err) {
        console.log(err);
      } else if (!result) {
        res.redirect('/');
      } else {
        result.visits++;
        result.save();
        return res.redirect(result.url); 
      }
    }); 

};