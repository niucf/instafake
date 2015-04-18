'use strict';

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
	var photo = new Photo(req.body);
	photo.user = req.user;

	console.log(req.body);
	photo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			//creates the path for storing the image
			var tempPath = req.files.file.path;
			ext = path.extname(req.files.file.name).toLowerCase(),
			targetPath = path.resolve('./public/upload/' + imgUrl + ext);

			//checks to make sure we're getting an image, then stores it if valid
			if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
				fs.rename(tempPath, targetPath, function(err) { 
					if (err) { 
						throw err; 
					}

				});
			} else {
				fs.unlink(tempPath, function () {
					if (err) {
						throw err;
					}

					res.json(500, {error: 'Only image files are allowed.'});
				});
			}
			res.jsonp(photo);
		}
	});
};

/**
 * Show the current Photo
 */
exports.read = function(req, res) {
	res.jsonp(req.photo);
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
 * Photo middleware
 */
exports.photoByID = function(req, res, next, id) { 
	Photo.findById(id).populate('user', 'displayName').exec(function(err, photo) {
		if (err) return next(err);
		if (! photo) return next(new Error('Failed to load Photo ' + id));
		req.photo = photo ;
		next();
	});
};

/**
 * Photo authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.photo.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
