'use strict';
var path = require('path');
/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Photo = mongoose.model('Photo'),
	_ = require('lodash');

/**
 * Create a Photo
 */
exports.create = function(req, res) {


	console.log('\n'+req.app+'\n');


  var photo = new Photo(req.body);
  photo.user = req.user;

  if(req.files.file) {
      photo.image =req.files.file.path.substring(req.files.file.path.indexOf(path.sep)+path.sep.length-1);
  }  else
      photo.image='default.jpg';
      
    photo.save(function(err) {

        if (err) {
            console.log('detected error:',errorHandler.getErrorMessage(err));
            return res.status(400).send({
    	         message: errorHandler.getErrorMessage(err)
            });
        } else {
            var notify_model = {
              user: req.user,
              photo: photo
            };
            var socketio = req.app.get('socketio'); // tacke out socket instance from the app container
              socketio.sockets.emit('photo.create', notify_model); // emit an event for all connected clients

            res.json({_id:photo._id});
        }
    });
};

/**
 * Show the current Photo
 */
exports.read = function(req, res) {
  var photo = req.photo;
  //  photo = _.extend(photo , req.body);
  photo.views += 1;
  photo.save(function(err) {
    if (err) {
      console.log('Problem'+err);
      return res.status(400).send({
	message: errorHandler.getErrorMessage(err)
      });
    } else
      console.log(photo);
      res.jsonp(photo);
  });
};


/**
 * Update a Photo
 */
exports.update = function(req, res) {
	var photo = req.photo ;

	photo = _.extend(photo , req.body);

	photo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(photo);
		}
	});
};

/**
 * Delete an Photo
 */
exports.delete = function(req, res) {
	var photo = req.photo ;

  console.log('deleting pohoto');
  req.flash('error', 'error text from flash error');

  photo.remove(function(err) {
    if (err) {

			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(photo);
		}
	});
};

/**
 * List of Photos
 */
exports.list = function(req, res) { 
	Photo.find().sort('-created').populate('user', 'displayName').exec(function(err, photos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(photos);
		}
	});
};
/**
 * Likes a photo
 */
exports.like = function(req, res) {
    var user = req.user;
    var containsValue = false,
        socketio = req.app.get('socketio'), // tacke out socket instance from the app container
        containsValue_dislike = false;

    var notify_model = {
        user: user,
        photo: req.photo
    };

    socketio.sockets.emit('photo.liked', notify_model); // emit an event for all connected clients
    console.log(user.likes);

    // Determine if user is already in LIKES arrat
    for(var i=0; i<req.photo.likes.length; i++) {
        console.log('Comparing likes - ' + req.photo.likes[i] + ' to ' + req.user._id + ' is ' + req.photo.likes[i].equals(req.user._id));
        if(req.photo.likes[i].equals(req.user._id)) {
            containsValue = true;
            console.log('found value in current photo likes array..');
        }
    }
    // Determine if user is already in DISLIKES arraY
    for(var j=0; j<req.photo.dislikes.length; j++) {
        console.log('Comparing dislikes - ' + req.photo.dislikes[j] + ' to ' + req.user._id + ' is ' + req.photo.dislikes[j].equals(req.user._id));
        if(req.photo.dislikes[j].equals(req.user._id)) {
            containsValue_dislike = j;
            console.log('found value in current photo dislikes array..');
        }
    }

    if(!containsValue) {

        req.photo.likes.push(req.user._id);
        req.photo.score++;
        console.log(user.likes);
        user.likes.push(req.photo);

        if(null !== containsValue_dislike){
            if(req.photo.dislikes){ console.log(req.photo.dislikes); }
            req.photo.dislikes.splice(containsValue_dislike, 1);
            console.log(req.photo.dislikes);
        }

        user.save(function(err){
            if(err){
                req.flash('error', 'attempting to like photo, user not saved');
            } else {
                console.log('Photo liked, user saved with a new like');
            }
        });

    } else {
        console.log('\nuser has already liked this photo, ignoring liek request\n');
    }


    req.photo.save(function(err) {
        if (err) {
            return res.status(400).send({
  		  message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(req.photo);
  	   }
    });
};

exports.dislike = function(req, res) {
  var user = req.user;
  var containsValue = false,
      socketio = req.app.get('socketio'); // tacke out socket instance from the app container

  var notify_model = {
      user: req.user,
      photo: req.photo
  };

  socketio.sockets.emit('photo.disliked', notify_model); // emit an event for all connected clients

  // Determine if user is already in 
  for(var i=0; i<req.photo.dislikes.length; i++) {

    console.log('Comparing ' + req.photo.dislikes[i] + ' to ' + req.user._id + ' is ' + req.photo.dislikes[i].equals(req.user._id));

    if(req.photo.dislikes[i].equals(req.user._id)) {
      containsValue = true;
    }

  }

  if(!containsValue) {
  	req.photo.dislikes.push(req.user._id);
  	req.photo.score--;
   
  }

  req.photo.save(function(err) {
    if (err) {
      return res.status(400).send({
		message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(req.photo);
	 }
  });
};

/**
 * Photo middleware
 */
exports.photoByID = function(req, res, next, id) {

  console.log('\nphotoByID called from server.controller - finding by id:'+id);

	Photo.findById(id).populate('user', 'displayName').exec(function(err, photo) {
	  if (err) return next(err);
	  if (! photo) return next(new Error('Failed to load Photo ' + id));
	  req.photo = photo;
	  next();
	});
};

/**
 * Photo authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.photo.user.id !== req.user.id) {
    req.flash('error', 'User not authorized');
		return res.status(403).send('User is not authorized');
	}
	next();
};
